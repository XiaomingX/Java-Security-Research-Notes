# GHSL-2024-011: 在Edge和Firefox中通过Universal Cross-Site Scripting (UXSS)实现任意JavaScript执行 - CVE-2024-49378

## 概述
在Edge和Firefox版本的Smartup扩展中发现了一种Universal XSS漏洞，允许其他扩展在用户的标签页中执行任意代码。

## 关键技术点
- **Vulnerable Extension**: Smartup (版本 7.2.622.1170)
- **漏洞性质**: Smartup扩展接收来自外部扩展的消息，但没有验证发送者的身份。
- **执行方式**: 外部输入消息通过`funOnMessage`函数传递，该函数调用`executeScript`以当前标签页的上下文执行代码。

## 风险
- 恶意扩展可以在用户的标签页上下文中运行任意JavaScript，可能会危及用户的账户安全。

## 漏洞发现
- 该漏洞是通过CodeQL工具发现的。
- 由GHSL团队成员@Kwstubbs（Kevin Stubbings）报告。
