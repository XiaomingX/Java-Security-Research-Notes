# GHSL-2023-257: 服务器端请求伪造 (SSRF) 漏洞在 Plane - CVE-2024-31461

**日期：** 2024-03-11  
**跟进邮件**：询问新的修复版本的发布日期。

## 漏洞描述

Plane v0.13-dev 存在一个认证盲服务器端请求伪造（SSRF）漏洞。

### 漏洞细节

- **受影响的文件**：`apiserver/plane/api/views/importer.py`
- **相关类**：`ServiceIssueImportSummaryEndpoint`
- **关键函数**：`get` 
- **漏洞情况**：
  - `get` 函数接受用户控制的 `cloud_hostname` GET 参数，并将其传递给 `jira_project_issue_summary` 函数。
  - 在代码的多个地方（行 11, 16, 21, 26 和 36），该参数与 URL 不安全地拼接。
  - 结果是，这些拼接后的 URL 被用来向任意目标发起 GET 请求，导致了盲 SSRF 漏洞。

### 漏洞影响

该漏洞可能导致信息泄露。攻击者可以利用服务器向任意地址发送 GET 请求。

### 漏洞发现

此问题是由 GHSL 团队成员 @sylwia-budzynska（Sylwia Budzynska）发现并报告的。
