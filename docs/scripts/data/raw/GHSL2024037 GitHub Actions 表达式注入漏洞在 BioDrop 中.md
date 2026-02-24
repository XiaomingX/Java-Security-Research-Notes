# GHSL-2024-037: GitHub Actions 表达式注入漏洞在 BioDrop 中

**BioDrop** 是一个存在安全漏洞的项目，容易受到 **Actions 表达式注入** 攻击，攻击者可以操控仓库问题（issues）。

## 关键信息

- **受影响版本**: BioDrop v2.99.18
- **漏洞触发**: `check-author-issues.yml` 工作流在创建或修改问题时被触发。
- **权限**: 该工作流对问题具有写入权限。

## 漏洞详细说明

1. 工作流从创建或修改的问题中获取数据，具体是 `$${{ github.event.issue.body }}`（问题的全部内容）。
2. 数据被注入到一个运行步骤的脚本中，这使得攻击者可以利用这个漏洞接管 GitHub Runner，并执行自定义命令。

## 影响

- **任意问题修改**：攻击者可能会通过此漏洞改变问题内容。

## 漏洞发现

这个漏洞是通过使用 **CodeQL** 对 JavaScript 进行的表达式注入安全检查发现的。

## 联系方式

该漏洞由 GHSL 团队成员 @jorgectf（Jorge Rosillo）发现并报告。若有任何关于此漏洞的沟通，请发送邮件至 **securitylab@github.com**，并在邮件中提及 **GHSL-2024-037**。