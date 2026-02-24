# GHSL-2023-253: OpenRASP中的反射型跨站脚本漏洞 (XSS) - CVE-2024-29183

在OpenRASP的云接口中发现了一个反射型跨站脚本（XSS）漏洞，允许未认证的攻击者获取用户的会话信息。

## 漏洞概述

- **受影响版本**: OpenRASP v1.3.7
- **漏洞类型**: 反射型XSS
- **影响页面**: /login

## 漏洞描述

在登录页面，因为`redirect`参数的反射，攻击者能够执行任意的JavaScript代码。这样，当用户用他们的账户登录后，攻击者可以在用户的权限下运行脚本。

### 漏洞影响

- **特权提升**: 攻击者可能会利用此漏洞获得更高的权限。
- **信息泄露**: 攻击者能够访问用户的敏感信息。

### 演示链接

以下链接展示如何执行JavaScript以显示已登录用户的Cookie值，表明攻击者可以获取用户的会话信息：
```
http://openrasp_cloud.domain/#/login?redirect=javascript:alert(document.cookie)
```

攻击者可以通过对URL进行编码来隐藏攻击过程，增加攻击的隐蔽性。

## 报告者信息

此漏洞由GHSL团队成员 @Kwstubbs (Kevin Stubbings) 发现并报告。 

如需更多信息，请联系GHSL团队，邮箱地址为 securitylab@github.com，并在沟通中提及GHSL-2023-253。