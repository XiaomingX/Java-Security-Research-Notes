# GHSL-2023-253：openrasp中的跨站脚本攻击（XSS） - CVE-2024-29183

## 概述
openrasp的云接口存在一个反射型XSS漏洞，允许未经身份验证的攻击者获取用户的会话信息。

## 影响版本
- openrasp 版本：v1.3.7

## 漏洞详情
- 漏洞位置：/login 页面
- 漏洞类型：反射型XSS，由于重定向参数的反射导致的。

### 攻击方式
攻击者可以在用户登录后执行任意JavaScript代码，从而获取用户的会话信息，例如cookie。以下链接可用于展示漏洞：

```
http://openrasp_cloud.domain/#/login?redirect=javascript:alert(document.cookie)
```

执行此链接后，会弹出一个警告框，显示已登录用户的cookie值，这表明攻击者可以执行恶意脚本并获取敏感信息，进而可能导致权限提升和信息泄露。

## 防护建议
攻击者可能会使用URL编码来隐藏攻击，因此用户和开发者需增强对链接的监控与保护。

## 联系我们
本漏洞由GHSL团队成员@Kwstubbs（Kevin Stubbings）发现和报告。如需进一步信息，请联系GHSL团队，邮件地址为securitylab@github.com，并在通信中提及GHSL-2023-253。