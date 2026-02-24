# GHSL-2023-249: Meshery的SQL注入漏洞 - CVE-2024-29031

Meshery（版本最高至v0.6.181）存在一个SQL注入漏洞，使得远程攻击者可以通过`GetMeshSyncResources`接口的`order`参数获取敏感信息。

## 技术细节

- **受影响的功能**：Meshery项目在API URL `/api/system/meshsync/resources`上暴露了`GetMeshSyncResources`功能。
- **漏洞位置**：在`meshync_handler.go`文件的第135行，`order`查询参数未经过适当处理，直接用于构建SQL查询。
  
## 漏洞影响

- **潜在风险**：
  - 攻击者可能利用SQL注入执行任意文件写入操作。
  - 攻击者可以访问并修改数据库中的任何数据，例如性能配置（可能包含会话cookie），Meshery应用数据或Kubernetes配置。
  
## 利用示例

要复现这个问题，可以发送以下三条请求生成任意位置的文件（需要使用合适的cookie进行本地认证）：

1. 文件创建请求
2. 确认文件已创建请求
3. 数据库条目创建请求
  
通过发送特定请求，还可以提取数据库中的信息，常用的方法有盲注（blind SQL injection）或者使用工具如`sqlmap`，自动化提取请求中的cookie。

## 漏洞发现

该漏洞由GitHub CodeQL团队成员@atorralba（Tony Torralba）发现，使用CodeQL的SQL注入查询进行了确认。

如需进一步联系GHSL团队，请发送邮件至securitylab@github.com，并在任何关于此问题的沟通中提及GHSL-2023-249。