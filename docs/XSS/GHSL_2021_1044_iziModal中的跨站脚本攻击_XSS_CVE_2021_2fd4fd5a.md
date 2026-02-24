# GHSL-2021-1044: iziModal中的跨站脚本攻击 (XSS) - CVE-2021-32860

## 什么是iziModal？

iziModal是一个用于创建模态窗口的JavaScript库。

## 漏洞概述

### 漏洞类型：
- **跨站脚本攻击（XSS）**：攻击者利用该漏洞能够在用户的浏览器中执行恶意代码。

### 漏洞影响：

- 该漏洞在`iziModal`的标题处理时出现。
- 攻击者如果能控制模态窗口的标题，就可以输入任意的HTML或JavaScript代码。
- 一旦被渲染，该代码将在用户的上下文中执行，从而可能导致XSS攻击。

### 受影响的版本：
- iziModal 版本 **1.5.1**

## 示例代码

下面是一个可能的漏洞利用代码段：

```javascript
// 漏洞示例代码（假设）：
// 假设攻防者影响了title字段
iziModal.setTitle("<script>alert('XSS!');</script>");
```

## 发现此漏洞的人：

- 此漏洞由GitHub团队成员 **@erik-krogh** 发现。
