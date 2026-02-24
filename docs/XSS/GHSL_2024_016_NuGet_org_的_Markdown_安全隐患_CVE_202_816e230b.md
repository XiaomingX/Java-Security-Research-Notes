# GHSL-2024-016: NuGet.org 的 Markdown 安全隐患 - CVE-2024-37304

## 背景

NuGetGallery 是 https://nuget.org/ 的核心，提供 .NET 包的公共源。NuGet 包的 Readme 文件使用 Markdown 格式编写，并转换为 HTML 显示。

## 主要问题

- **Markdown 渲染**：NuGetGallery 使用 markdig 库将 Markdown 转换为 HTML。
- **安全措施**：它会过滤链接中的 JavaScript 代码，但对自动链接（autolinks）的过滤不够严格。

## 具体问题

### 自动链接的安全漏洞

- 一些 Markdown，如 `<javascript:alert(1)>`，会被渲染为普通链接，而没有被适当地过滤。
- 攻击者可以伪装链接文本，使受害者误点击，从而可能导致 XSS（跨站脚本攻击）。

### 安全影响

- 虽然 NuGetGallery 的 Cookies 设置了 `HttpOnly` 标志，但攻击者仍可以：
  - 重定向用户到其他页面。
  - 伪装页面内容或链接。
  - 提取页面数据。
