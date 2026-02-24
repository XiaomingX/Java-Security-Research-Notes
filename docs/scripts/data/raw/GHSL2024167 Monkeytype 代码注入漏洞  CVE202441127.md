# GHSL-2024-167: Monkeytype 代码注入漏洞 - CVE-2024-41127

## 漏洞概述

Monkeytype 存在一个代码注入漏洞，允许攻击者通过一个特定的 GitHub Workflow (`ci-failure-comment.yml`) 执行恶意代码，进而获取对拉取请求的写入访问权限。

## 技术细节

- **触发条件**: 该 Workflow 在 Monkey CI 工作流完成后被触发。
  
- **流程**:
  1. **下载工件**: 它会下载由触发工作流上传的工件。
  2. **读取内容**: 将 `./pr_num/pr_num.txt` 文件的内容赋值给 `steps.pr_num_reader.outputs.content` 变量。

- **漏洞点**: 
  - 该变量内容没有被验证是否为数字。
  - 随后，这个值被插入到 JavaScript 脚本中，攻击者可以利用这一点更改执行的代码。

## 结果

此漏洞使得攻击者可以对拉取请求进行写入，实施恶意操作。

## 联系方式

该问题由 GHSL 团队成员 @pwntester（Alvaro Muñoz）发现并报告。如需进一步交流，请通过 securitylab@github.com 联系 GHSL 团队，邮件中请提及 GHSL-2024-167。