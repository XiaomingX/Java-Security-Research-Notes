# Go2rtc 存在的安全漏洞概述

## 漏洞简介
Go2rtc 版本 v1.7.1 存在跨站脚本（XSS）和任意命令执行漏洞。这些漏洞源于未对用户输入进行处理。

### 漏洞类型
1. **跨站脚本 (XSS)**: 
   - 由于将用户输入直接插入页面，攻击者可以通过特制的链接注入恶意脚本。
   - 示例负载: 
     ```html
     foo">foo</a></li><img src=x onerror=alert(document.location)><!--
     ```

2. **任意命令执行**:
   - 攻击者可以通过修改 API 配置，执行任意命令。
   - 示例表单:  
     ```json
     { "customStream": "cmd_to_execute" }
     ```

## 漏洞细节
- **XSS 漏洞**:
  - 在 links.html 页面中，`src` 参数被直接使用在 `innerHTML` 中。
  - 在 index.html 页面中，API 的响应数据经过处理后也被用在 `innerHTML` 中。
  
- **任意命令执行漏洞**:
  - `/api/config` 端点允许用户提供配置值，但此端点未能防止来自其他网站的请求（CSRF）。

## 利用方式
1. **drive-by 攻击**:
   - 攻击者可设立一个服务器，包含特制代码。
   - 受害者访问该服务器后，浏览器会自动向 Go2rtc 实例发送请求。

## 联系方式
这些问题由 GHSL 团队成员 @jorgectf (Jorge Rosillo) 和 @maclarel (Logan MacLaren) 发现并报告。如需反馈，请联系 [GHSL团队](mailto:securitylab@github.com)，邮件中请提及 GHSL-2023-205 或 GHSL-2023-206。