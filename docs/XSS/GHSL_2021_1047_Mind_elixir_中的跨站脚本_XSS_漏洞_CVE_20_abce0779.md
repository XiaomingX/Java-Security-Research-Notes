# GHSL-2021-1047: Mind-elixir 中的跨站脚本（XSS）漏洞 - CVE-2021-32851

## 概述
Mind-elixir 是一款软件，在处理不可信的菜单时存在跨站脚本（XSS）漏洞。

## 版本
- 受影响版本：v0.12.2

## 漏洞详情
如果攻击者能够影响创建 MindElixir 实例时的字段名称，他们可能会插入任意的 HTML 或 JavaScript 代码。这些代码将在用户的上下文中执行，从而可能导致 XSS 攻击。

### 漏洞示例
- 漏洞代码位置：contextMenu.js

## 风险
此漏洞可能导致 XSS 攻击。

## 报告者
该问题由 GitHub 团队成员 @erik-krogh（Erik Krogh Kristensen）发现。
