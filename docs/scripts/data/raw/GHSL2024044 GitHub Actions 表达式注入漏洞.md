# GHSL-2024-044: GitHub Actions 表达式注入漏洞

## 概述
Simple Icons 存在一个 GitHub Actions 表达式注入漏洞，攻击者可以利用该漏洞接管代码库并窃取机密信息。

### 受影响的版本
- Simple Icons v11.9.0

## 漏洞详情
1. **触发条件**: `autoclose-issues.yml` 工作流程在新问题创建时触发。
2. **权限**: 该工作流程使用的 GitHub 令牌具有完全写权限，因为组织或仓库的默认工作流程权限设置为读写。
3. **漏洞利用**: 攻击者可以利用问题标题（`${{ github.event.issue.title }}`）将恶意数据注入到脚本中。这使得他们能够控制 GitHub Runner，运行自定义命令，进而修改代码库。

## 影响
- 攻击者可能会窃取工作流程中的机密信息。
- 攻击者可以修改代码库内容。

## 漏洞发现与报告
- 该问题是由 GHSL 团队成员 @jorgectf（Jorge Rosillo）发现并报告的。

## 联系信息
如需更多信息，请联系 GHSL 团队，邮件地址为 securitylab@github.com，并在邮件中提及 GHSL-2024-044。