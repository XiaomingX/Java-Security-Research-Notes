# GHSL-2024-145: Discord.js 的 Actions 表达式注入漏洞

**简介**
Discord.js 存在一个安全漏洞，允许攻击者通过 Actions 表达式注入获取代码库的控制权并窃取敏感信息。

**技术背景**
- **Discord.js**：一个用于与 Discord API 交互的 JavaScript 库。
- **漏洞类型**：Actions 表达式注入。

**漏洞细节**
1. **工作流触发**：在 `chore/label-enhancements` 分支中的 `pr-triage.yml` 工作流会在创建拉取请求时触发。
2. **权限设置**：由于组织或代码库的默认工作流权限设置为读写，这个工作流可以使用写权限的 GitHub 认证令牌。
3. **注入漏洞**：攻击者可以通过拉取请求的标题（`${{ github.event.pull_request.title }}`）注入恶意数据到工作流的执行步骤中。这让攻击者能够控制 GitHub Runner，执行自定义命令并修改代码库。

**潜在后果**
- 窃取工作流中的敏感信息。
- 修改代码库内容。

**发现与联系**
- 这个漏洞是由 GHSL 团队成员 @pwntester（Alvaro Muñoz）发现的。
- 如果需要对此漏洞进行进一步沟通，请联系 GHSL 团队：securitylab@github.com，并在邮件中引用 GHSL-2024-145。