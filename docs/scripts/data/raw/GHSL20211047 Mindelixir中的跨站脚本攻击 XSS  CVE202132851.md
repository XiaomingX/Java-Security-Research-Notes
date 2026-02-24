# GHSL-2021-1047: Mind-elixir中的跨站脚本攻击 (XSS) - CVE-2021-32851

## 什么是Mind-elixir?
Mind-elixir是一个用于创建思维导图的工具。

## 问题概述
在使用Mind-elixir时，如果处理不受信任的菜单，可能会出现跨站脚本攻击（XSS）的漏洞。

## 漏洞细节
- **版本**: v0.12.2
- **攻击方式**: 攻击者可以通过影响Mind-elixir实例中的字段名称，注入任意的HTML或JavaScript代码。
- **后果**: 注入的代码会在用户的上下文中执行，从而导致XSS攻击。

## 示例代码
有漏洞的代码片段位于 `contextMenu.js` 文件中。

## 发现者
此问题由GitHub团队成员@erik-krogh（Erik Krogh Kristensen）发现。

## 联系方式
如果需要更多信息，请联系GHSL团队，邮箱为: securitylab@github.com，并在沟通中提及GHSL-2021-1047。