# GHSL-2021-1042: Baremetrics中的XSS漏洞 - CVE-2021-32859

## 什么是XSS？
XSS（跨站脚本攻击）是一种安全漏洞，攻击者可以通过在网页中插入恶意的 HTML 或 JavaScript 代码，使得这些代码在用户的浏览器中执行。

## 漏洞简介
Baremetrics的日期范围选择器（Date Range Picker）在处理不可信的占位符输入时，存在XSS漏洞。

### 受影响的版本
- Baremetrics Date Range Picker v1.0.14

## 漏洞原理
如果攻击者能够影响到创建日历实例时的占位符字段，他们可以插入任意的HTML或JavaScript代码，这些代码会在用户的环境中执行，从而引发XSS攻击。

### 漏洞代码示例
- 漏洞代码位置：`Calendar.js`
