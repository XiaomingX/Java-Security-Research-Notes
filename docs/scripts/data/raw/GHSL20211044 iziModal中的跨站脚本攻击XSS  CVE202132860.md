# GHSL-2021-1044: iziModal中的跨站脚本攻击（XSS） - CVE-2021-32860

## 技术背景
iziModal是一个用于显示模态对话框的JavaScript库。该库在处理不可信的模态标题时存在跨站脚本攻击（XSS）的漏洞。

### 漏洞描述
- **受影响版本**：iziModal v1.5.1
- **漏洞类型**：XSS（跨站脚本攻击）
- **攻击路径**：当攻击者能够控制iziModal实例的标题字段时，他们可以输入任意HTML或JavaScript代码，这些代码会在用户的上下文中执行，从而导致XSS攻击。

### 漏洞示例
在`iziModal.js`中的某段脆弱代码可能会导致此问题。

### 发现者信息
此问题由GitHub团队成员@erik-krogh（Erik Krogh Kristensen）发现。

### 联系信息
如果您有任何关于此问题的疑问，可以通过电子邮件联系GHSL团队，邮箱地址为securitylab@github.com。请在交流中提及GHSL-2021-1044作为参考。