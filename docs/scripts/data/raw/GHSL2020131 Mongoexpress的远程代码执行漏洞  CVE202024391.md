# GHSL-2020-131: Mongo-express的远程代码执行漏洞 - CVE-2020-24391

## 概述
Mongo-express 是一个用于管理MongoDB的Web应用程序。它使用一个名为 **safer-eval** 的库来验证用户提供的JavaScript代码。然而，这个验证机制并不安全，攻击者可以绕过它，从而在Node.js服务器上执行任意代码（Remote Code Execution, RCE）。

## 漏洞信息
- **受影响版本**: mongo-express v0.54.0
- **漏洞类型**: 远程代码执行 (RCE)

## 漏洞利用
该漏洞利用了Mongo-express在处理用户输入时缺乏CSRF（跨站请求伪造）保护的缺陷。攻击者可以利用有效的用户凭证，通过特制的请求来执行任意代码。

### 漏洞验证步骤
1. 创建一个名为 `index.html` 的文件，添加攻击代码。
2. 在包含 `index.html` 的目录中启动一个Web服务器。
3. 确保目标Mongo-express服务器上有用户已登录，并且在同一浏览器中维持会话。
4. 访问 `http://localhost/`，可以观察到请求成功，并且在mongo-express的控制台中执行了命令。

## 联络信息
此漏洞由GHSL团队成员 @agustingianni (Agustin Gianni) 发现并报告。如需进一步联系GHSL团队，请发送邮件至 securitylab@github.com，并在邮件中包含 **GHSL-2020-131** 以获取更多信息。