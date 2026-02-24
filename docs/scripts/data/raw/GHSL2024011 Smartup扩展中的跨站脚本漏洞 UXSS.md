# GHSL-2024-011: Smartup扩展中的跨站脚本漏洞 (UXSS)

## 概述
在Smartup扩展的Edge和Firefox版本中，存在一个通用的跨站脚本（UXSS）漏洞，允许其他扩展在用户的网页标签中执行任意的JavaScript代码。

## 技术细节
- **受到影响的版本**: Smartup 7.2.622.1170
- **漏洞原因**: Smartup扩展接收来自其他扩展的消息，但没有验证发送者的身份。
- **利用方式**:
  1. 外部扩展发送消息给Smartup。
  2. Smartup处理这些消息并调用`executeScript`，在当前标签的上下文中运行外部消息中的代码。

由于这一点，恶意扩展可能会在用户的网页标签中执行任意JavaScript，可能会窃取用户账户信息或进行其他恶意操作。

## 发现与报告
- **漏洞发现**: 通过CodeQL（一个代码分析工具）发现。
- **报告人**: GHSL团队成员@Kwstubbs (Kevin Stubbings)。

## 联系方式
如需进一步信息，请联系GHSL团队：
- 电子邮件: securitylab@github.com
- 提交查询时请参考GHSL-2024-011。