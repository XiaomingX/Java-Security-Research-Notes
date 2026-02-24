# GHSL-2023-203_GHSL-2023-204: Audiobookshelf的多个漏洞

**Audiobookshelf** 是一个音频书籍管理系统，当前在其版本 **v2.4.3** 中存在几个安全漏洞，包括：

1. **服务器端请求伪造 (SSRF)**
2. **任意文件读取 (AFR)**
3. **任意文件删除 (AFD)**

## 漏洞详情

- **用户权限**：具有更新权限的用户可以：
  - 读取任意文件
  - 删除任意文件
  - 发送GET请求到任意URL并读取响应

### SSRF 漏洞示例

利用 `curl` 命令可以向系统发送请求，从而读取敏感信息：

```bash
curl -i -s -k -X $'GET' \
    -H $'Host: localhost:3333' \
    -H $'Authorization: Bearer <YOUR_TOKEN>' \
    -H $'Content-Length: 2' \
    --data-binary $'\x0d\x0a' \
    $'http://localhost:3333/api/authors/<AUTHOR_ID>/image?token=JWT_TOKEN&raw=true'
```

### 任意文件删除

任何用户（不论其权限）都可能通过路径遍历漏洞读取本地文件系统中的文件。下载文件的路径需要经过 URL 编码，以避免与正则解析的混淆。这可能导致泄露敏感信息。

### 示例

示例中的 `%2F` 是 URL 编码的斜杠 `/`，通过这类技术可以访问目标文件的完整路径。

## 漏洞报告

这些问题由GHSL团队的成员 **@Kwstubbs (Kevin Stubbings)** 发现，并借助于 CodeQL 的 SSRF 和路径注入查询工具进行检测。

如需联系GHSL团队，请发送邮件至 **securitylab@github.com**，并在相关沟通中提及 **GHSL-2023-203** 或 **GHSL-2023-204**。