# GHSL-2023-185: Posthog中的服务器端请求伪造（SSRF）漏洞 - CVE-2023-46746

## 概述
在Posthog中发现了一个服务器端请求伪造（SSRF）漏洞。这个漏洞只能被经过身份验证的用户利用。

### 影响版本
- **Posthog版本**: 1.43.1

## 漏洞详情
- **位置**: `posthog/api/user.py` 文件中的 `test_slack_webhook` 方法。
- **问题**: 该方法没有正确验证用户提供的 webhook 变量，导致可以发送伪造的 POST 请求 (在第283行)。
  
## 漏洞利用
此SSRF漏洞允许攻击者通过PostHog服务器伪造发送POST请求。

## 发现与报告
- **发现者**: GHSL团队成员 @sylwia-budzynska (Sylwia Budzynska)。
- **报告方式**: 如果有任何关于此问题的咨询，请联系 GHSL 团队，邮箱为 securitylab@github.com，并在通信中提及 GHSL-2023-185。

通过这个简化的描述，您可以更清楚地了解漏洞的基本信息和影响。