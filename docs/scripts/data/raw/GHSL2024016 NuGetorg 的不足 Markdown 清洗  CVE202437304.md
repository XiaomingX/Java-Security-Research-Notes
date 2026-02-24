# GHSL-2024-016: NuGet.org 的不足 Markdown 清洗 - CVE-2024-37304

NuGetGallery 是提供 .NET 包的主要公共源，网址为 [nuget.org](https://nuget.org/)。在 NuGet 包中，Readme 文件以 Markdown 格式存在，并且会被转换为 HTML 格式进行展示。NuGetGallery 过滤了链接中的 JavaScript，但未能清洗自动链接（autolinks）。

## 技术背景

- **NuGetGallery 版本**: v2023.04.25
- **Markdown 处理**: 通过 `markdig` 库将 Markdown Readme 转换为 HTML 文件。
- **HTML 限制**: Markdown 中不允许原始 HTML，只有 HTTP 或 HTTPS 协议的链接会被清洗。

## 问题描述

- **自动链接漏洞**: 由于对自动链接的清洗不彻底，攻击者可以利用该漏洞，使得像 `<javascript:alert(1)>` 这样的链接显示为普通链接，仍保留攻击性代码。
  
- **攻击方式**: 
  - 攻击者可以隐藏自动链接的真实内容，可能需要额外的社交工程策略来说服用户点击链接。
  - 尽管 NuGetGallery 的 Cookies 设置了 HttpOnly 标志，但攻击者仍然可以执行其他操作，例如通过跨站脚本（XSS）重定向用户、伪造内容或提取页面数据。

## 报告信息

此问题是由 GHSL 团队成员 @JarLob（Jaroslav Lobačevski）发现并报告。

如需进一步联系 GHSL 团队，请发送邮件到 securitylab@github.com，并在相关通信中提及 GHSL-2024-016。