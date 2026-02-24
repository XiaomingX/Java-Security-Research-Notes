# GHSL-2022-061: 在ghinstallation中泄露Bearer Token - CVE-2022-39304

**发布日期**：2022年12月19日

## 概述
当在令牌更新时发生错误时，应用的Bearer Token可能会被泄露。这是一个关于`ghinstallation`库中的安全漏洞。

## 影响版本
- 直至最新版本2.1.0

## 问题详情
如果在令牌更新过程中出现错误，完整的Bearer Token将被打印出来，可能会被发送到Slack频道等应用程序中。

### 风险
- 该问题可能导致应用的Token泄露，从而被攻击者劫持应用。

## 报告者
此问题是由GitHub团队成员@Miskerest（Mike Bailey）发现并报告的。

## 联系方式
如需进一步沟通此问题，请联系GHSL团队，邮箱是securitylab@github.com，邮件中请提及GHSL-2022-061。