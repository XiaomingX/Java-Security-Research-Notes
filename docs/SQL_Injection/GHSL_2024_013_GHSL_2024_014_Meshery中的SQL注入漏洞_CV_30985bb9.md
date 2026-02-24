# GHSL-2024-013_GHSL-2024-014: Meshery中的SQL注入漏洞 - CVE-2024-35181, CVE-2024-35182

## 概述

Meshery在版本v0.7.22及之前存在SQL注入漏洞，这使得远程攻击者可以通过HTTP接口的Order和Sort参数获取敏感信息、修改数据库内容或创建任意文件。

## 漏洞详细信息

### 影响的功能

- **GetMeshSyncResourcesKinds**: API URL为 `/api/system/meshsync/resources/kinds`
  - **问题**: Order查询参数直接构建SQL查询。攻击者可以利用这个漏洞执行堆叠查询，通过执行 `ATTACH DATABASE` 命令来写入任意文件。

- **GetAllEvents**: API URL为 `/api/v2/events`
  - **问题**: Sort查询参数同样直接用于构建SQL查询，攻击者可以利用这个漏洞同样执行堆叠查询和创建任意数据库条目。

### 潜在影响

- 攻击者可以访问和修改数据库中的数据，包括：
  - 性能配置（可能包含会话cookie）
  - Meshery应用数据
  - Kubernetes配置

### 漏洞利用方式

1. **写入文件**: 使用SQL注入的堆叠查询加载任意内容。
2. **创建数据库条目**: 通过相应请求创建数据库中的任意条目。
3. **提取信息**: 需要使用盲SQL注入技巧，比如使用 `sqlmap` 工具自动化提取性能配置中的请求cookie。

### 发现和报告

这些漏洞是由GitHub团队成员@atorralba（Tony Torralba）发现并报告的，使用了CodeQL的SQL注入查询工具。
