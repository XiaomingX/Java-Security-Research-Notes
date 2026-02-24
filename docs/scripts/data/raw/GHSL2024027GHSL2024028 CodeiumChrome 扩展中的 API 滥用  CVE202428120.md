# GHSL-2024-027_GHSL-2024-028: Codeium-Chrome 扩展中的 API 滥用 - CVE-2024-28120

## 易于理解的概述

### 背景
Codeium-Chrome 是一个浏览器扩展，而在其工作中有个叫做 **service worker** 的部分。这个组件负责处理接收到的信息，但它存在一个安全漏洞。

### 漏洞描述
- **问题**: Codeium-Chrome 的 service worker 没有检查信息的发送者。这意味着任何网站都可以向扩展发送信息。
- **结果**: 攻击者可以制作一个网页，窃取用户的 `Codeium API 密钥`，从而冒充用户进行后台操作。

### 风险
- **信息泄露**: 攻击者可获取用户的姓名、API 密钥及其他设置。
- **滥用 API 密钥**: 利用窃取的 API 密钥，攻击者可以受害者身份向 Codeium 后台发起请求。

### 如何利用
攻击者仅需要在其网页上运用特定的 JavaScript 代码，即可发送信息至 Codeium-Chrome 扩展，并通过警告框显示 API 密钥和用户名。

### 报告与联系
- 这个漏洞由 GHSL 团队成员 @Kwstubbs (Kevin Stubbings) 发现并报告。
- 如果有任何关于此问题的询问，请联系 GHSL 团队（email: securitylab@github.com），请在沟通中提及参考 GHSL-2024-027。

### 版本
- 受影响版本: codeium-chrome v1.2.52