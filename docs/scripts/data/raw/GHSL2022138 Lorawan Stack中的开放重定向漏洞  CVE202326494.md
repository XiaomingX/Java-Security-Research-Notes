# GHSL-2022-138: Lorawan Stack中的开放重定向漏洞 - CVE-2023-26494

## 漏洞简介

在Lorawan Stack服务器的登录页面中，存在一个开放重定向漏洞。攻击者可以在用户登录时提供一个恶意重定向地址。

## 受影响版本

- **Lorawan-stack**: v3.23.1

## 漏洞细节

1. **登录流程**:
   - 用户登录成功后，系统会将其重定向到一个由参数`n`指定的地址。
   - 具体来说，`n`的值会被赋给`window.location`，浏览器会转到这个地址。

2. **风险**:
   - 这个漏洞允许恶意用户利用重定向来进行网络钓鱼攻击。用户可能会以为自己被重定向到了网站的主页，实际上却是在访问攻击者指定的恶意网站。

## 相关链接

- 关于开放重定向的更多信息：[Snyk](https://learn.snyk.io/lessons/open-redirect/javascript/)

## 报告信息

- 该漏洞是由GHSL团队成员@Kwstubbs (Kevin Stubbings) 发现并报告的。
- 如需帮助，可以通过以下方式联系GHSL团队: 
  - 邮箱: [securitylab@github.com](mailto:securitylab@github.com)
  - 请在沟通中提及GHSL-2022-138。