# GHSL-2024-145: Discord.js中的操作表达式注入漏洞

**概述**：Discord.js 存在一个漏洞，攻击者可以通过操作表达式注入影响到GitHub库，进而窃取机密信息。

## 技术背景

- **什么是Discord.js？**  
  Discord.js 是一个用于与 Discord API 交互的JavaScript库。

- **漏洞细节**：  
  最新的提交表明，在 `chore/label-enhancements` 分支中的 `pr-triage.yml` 工作流会在创建拉取请求时被触发。
  - 该工作流拥有完全写权限的GitHub库令牌，默认情况下，组织或库的工作流权限设置为可读写。
  - 工作流将用户控制的拉取请求数据（例如拉取请求的标题）注入到一个运行步骤的脚本中。
  
- **攻击风险**：  
  攻击者可以利用这个漏洞接管GitHub Runner，执行自定义命令和修改仓库。这可能导致：
  - 窃取工作流中的机密信息。
  - 修改仓库内容。

- **发现与报告**：  
  这个问题是由GHSL团队成员@pwntester（Alvaro Muñoz）发现并报告的。
