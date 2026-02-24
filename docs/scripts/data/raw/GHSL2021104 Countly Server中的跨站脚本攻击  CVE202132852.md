# GHSL-2021-104: Countly Server中的跨站脚本攻击 - CVE-2021-32852

本报告介绍了Countly服务器中的跨站脚本（XSS）漏洞。有关详情请查看[Countly GitHub页面](https://github.com/Countly/countly-server)。

## 漏洞概述

在`reset.html`模板中，攻击者可以进行代码注入。具体在以下参数中：

- `message`
- `password_min`

这些参数来自查询字符串。通过特殊的输入格式，可以绕过HTML转义保护，从而进行代码注入。

## 漏洞影响

- **代码执行**：当受害者点击恶意链接或被导向恶意网站时，攻击者可以执行代码。  
- **条件**：攻击者需要一个账户，或者能够创建一个账户才能利用这个漏洞。

## 版本影响

目前不清楚开源代码与企业版之间的关系，可能只有社区版存在此漏洞。

## 发现者

该漏洞由GitHub CodeQL团队的@asgerf（Asger F）发现。

如需更多信息，请联系GHSL团队：securitylab@github.com，并在通讯中提及GHSL-2021-104。