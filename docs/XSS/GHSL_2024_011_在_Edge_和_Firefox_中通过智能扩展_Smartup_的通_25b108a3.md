# GHSL-2024-011: 在 Edge 和 Firefox 中通过智能扩展 Smartup 的通用跨站脚本（UXSS）执行任意 JavaScript - CVE-2024-49378

## 背景信息

- **漏洞类型**: 通用跨站脚本 (UXSS)
- **影响浏览器**: Edge 和 Firefox
- **受影响扩展**: Smartup (版本 7.2.622.1170)

## 漏洞描述

在 Smartup 扩展中，存在一个安全漏洞，允许其他扩展在用户的标签页中执行任意 JavaScript 代码。这是因为 Smartup 接收来自外部扩展的消息时，没有验证发送者的身份。

## 漏洞机制

1. **消息接收**: Smartup 允许外部扩展发送消息，而不检查这些消息的来源。
2. **代码执行**: 收到的外部消息被传递到 `funOnMessage` 函数，该函数使用 `executeScript` 在当前标签页的上下文中执行传入的 JavaScript 代码。

## 潜在影响

恶意扩展可以利用此漏洞在用户的标签页中运行任意代码，可能导致用户所登录账户的安全性受到威胁。

## 漏洞发现与报告

- 此漏洞是通过 **CodeQL** 工具发现的。
- 报告者: GHSL 团队成员 @Kwstubbs (Kevin Stubbings)
