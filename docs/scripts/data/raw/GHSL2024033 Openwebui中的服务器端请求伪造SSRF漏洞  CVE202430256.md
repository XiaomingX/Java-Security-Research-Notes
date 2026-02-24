# GHSL-2024-033: Open-webui中的服务器端请求伪造（SSRF）漏洞 - CVE-2024-30256

## 概述
Open-webui 存在一个安全漏洞，允许经过身份验证的用户利用服务器端请求伪造（SSRF）进行攻击。

## 具体信息
- **漏洞版本**: Open-webui v0.1.111
- **漏洞类型**: 盲服务器端请求伪造 (Blind SSRF)

## 漏洞详情
1. **漏洞成因**:  
   Open-webui的下载接口接受用户输入的URL作为GET参数。这些参数被用于 `download_file_stream` 函数发送GET请求，从而导致了盲服务器端请求伪造问题。

2. **攻击影响**:  
   通过此漏洞，攻击者可以代表Open-webui服务器发送请求。这可以帮助攻击者探测服务器本身的其他漏洞或内部网络中其他后端系统的漏洞。

## 发现与报告
此漏洞由GHSL团队成员 @sylwia-budzynska （Sylwia Budzynska）发现，并利用CodeQL工具进行了检测。

## 联系信息
如需进一步沟通，请联系GHSL团队，邮箱为：securitylab@github.com，并在邮件中提及GHSL-2024-033。