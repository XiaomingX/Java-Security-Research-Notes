# GHSL-2024-051: Misskey中的GitHub Actions表达式注入漏洞

Misskey存在一个GitHub Actions表达式注入漏洞，攻击者可以利用该漏洞接管仓库并窃取机密信息。

## 什么是Misskey？

Misskey是一款用于实时信息分享和社交的开源软件。

## 漏洞描述

- **版本**：2024.3.1
- **触发条件**：这个漏洞发生在`pull_request_target`事件触发时，即当创建一个Pull Request时。
- **权限**：此工作流使用的GitHub仓库令牌具有完全的写入权限，因为仓库的默认工作流权限设置为读写。
  
## 漏洞原理

1. 工作流中有一个步骤会插入被Pull Request控制的数据（例如，分支名称`${{ github.event.pull_request.head.ref }}`）。
2. 这使得攻击者可以在GitHub Runner上运行自定义命令。
3. 攻击者可以利用该权限窃取工作流机密或修改仓库内容。

## 发现与报告

该问题由GHSL团队成员@jorgectf（Jorge Rosillo）发现并报告。如果您对该问题有任何疑问，可以联系GHSL团队，邮件地址为securitylab@github.com，邮件中请提及GHSL-2024-051。