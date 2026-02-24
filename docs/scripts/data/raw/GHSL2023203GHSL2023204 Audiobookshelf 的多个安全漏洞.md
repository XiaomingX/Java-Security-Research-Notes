# GHSL-2023-203_GHSL-2023-204: Audiobookshelf 的多个安全漏洞

## 概述
Audiobookshelf 是一个存在多种安全漏洞的应用程序，这些漏洞包括：

1. **服务器端请求伪造 (SSRF)**
2. **任意文件读取 (AFR)**
3. **任意文件删除 (AFD)**

这些漏洞的影响取决于用户的权限。

## 漏洞详情
- **版本**: audiobookshelf v2.4.3
- **受影响的用户**: 具有更新权限的用户可以：
  - 读取任意文件
  - 删除任意文件
  - 向任意 URL 发送 GET 请求并读取响应

### SSRF 漏洞
攻击者可以利用 SSRF 漏洞向应用程序发起 GET 请求，访问内部服务。

**示例代码**:
```bash
curl -i -s -k -X $'GET' \
    -H $'Host: localhost:3333' -H $'Authorization: Bearer YOUR_TOKEN' \
    $'http://localhost:3333/api/authors/YOUR_AUTHOR_ID/image?token=JWT_TOKEN&raw=true'
```

### 任意文件删除
任何用户（无论权限如何）都可能因为路径遍历漏洞而读取本地文件系统中的文件。

**示例攻击向量**:
- URL 中的 `%2F` 是编码后的斜杠，用于绕过正则表达式解析。攻击者可以通过反向遍历目录来获取想要访问的文件的完整路径。

## 安全隐患
这些漏洞可能导致信息泄露，给用户的隐私和数据安全带来威胁。

## 报告与联系
这些问题由 GHSL 团队成员 @Kwstubbs (Kevin Stubbings) 发现，并通过 CodeQL 的 SSRF 和路径注入查询辅助识别。

如需联系 GHSL 团队，请通过以下邮件：  
[securitylab@github.com](mailto:securitylab@github.com)  
请在任何与这些问题相关的通信中提及 GHSL-2023-203 或 GHSL-2023-204。