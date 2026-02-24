# GHSL-2024-030: 潜在的秘密泄露漏洞在 docfx 的 Pull Request 中

## 漏洞概述
在 dotnet/docfx 仓库中，由于不安全地使用 `pull_request_target`，导致可能泄露机密信息。

### 关键概念
- **Pull Request**：一种在 GitHub 上提议代码修改的方式。
- **pull_request_target**：一种 GitHub 事件，允许在 Pull Request 中运行代码。
  
## 为什么会有漏洞？
- 在 ci.yml 工作流中，`pull_request_target` 事件直接检查 Pull Request 的代码，这样攻击者控制的代码就会被运行。
- 如果从用户的分支中获取并执行不受信任的代码，这会导致该代码在能够访问机密（如 secrets.PERCY_TOKEN）的环境中运行。

### 可能的攻击
攻击者可以创建一个包括恶意 `templates/packages.json` 文件的 Pull Request，这个文件可以执行任意命令，从而获取与工作流共享的机密。

## 漏洞验证
使用特定的 CodeQL 查询可检测到在受信任环境中运行不受信任代码的漏洞。

## 危害
如果运行不受信任的代码并使用特权的仓库令牌，可能导致：
- 未授权的仓库修改
- 机密泄露（例如：secrets.PERCY_TOKEN）
