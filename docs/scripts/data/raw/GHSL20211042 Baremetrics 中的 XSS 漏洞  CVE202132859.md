# GHSL-2021-1042: Baremetrics 中的 XSS 漏洞 - CVE-2021-32859

## 概述

Baremetrics 的日期范围选择器在处理不可信的占位符输入时存在 **跨站脚本攻击（XSS）** 漏洞。

## 受影响版本

- Baremetrics 日期范围选择器版本：**v1.0.14**

## 漏洞描述

- 如果攻击者能够影响创建日历实例时的字段占位符，他们可以插入任意的 HTML 或 JavaScript 代码。
- 这些插入的代码会在用户的浏览器中执行，从而导致 **XSS** 漏洞。

## 漏洞示例

**脆弱代码位置：** `Calendar.js`

- 该漏洞可能导致 XSS 攻击。

## 发现者

- 此漏洞是由 GitHub 团队成员 **Erik Krogh Kristensen (@erik-krogh)** 发现的。

## 联系信息

- 如果您需要更多信息，可以通过邮件联系 GHSL 团队：**securitylab@github.com**，请在任何沟通中提及 **GHSL-2021-1042**。