# GHSL-2022-138: Lorawan Stack 的开放重定向漏洞 - CVE-2023-26494

## 概述
在 lorawan stack 服务器的登录页面存在一个开放重定向漏洞。这允许攻击者在用户登录时提供一个可以被用户控制的重定向地址。

## 受影响版本
- lorawan-stack 版本：**v3.23.1**

## 漏洞详情
在用户成功登录后，系统会将用户重定向到 `n` 参数指定的地址。这一处理是在 `/oauth/login` 和 `/oauth/token-login` 接口中发生的：

- 登录成功后，`n` 的值被赋给 `window.location`，导致用户被重定向。

## 风险
此漏洞可能导致恶意攻击者进行网络钓鱼（phishing）攻击。用户可能会误认为自己已经安全地返回主页，实际上却被重定向到攻击者指定的网站。

## 更多信息
- [开放重定向漏洞学习资源](https://learn.snyk.io/lessons/open-redirect/javascript/)
- 此漏洞由 GHSL 团队成员 @Kwstubbs（Kevin Stubbings）发现并报告。
