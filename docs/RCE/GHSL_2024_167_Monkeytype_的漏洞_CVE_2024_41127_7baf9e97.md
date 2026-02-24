# GHSL-2024-167: Monkeytype 的漏洞 - CVE-2024-41127

## 漏洞概述
Monkeytype 在其 `ci-failure-comment.yml` GitHub 工作流程中存在一个漏洞，允许攻击者通过代码注入进行“污染管道执行”。这使得攻击者可以对拉取请求（pull requests）进行写访问。

## 工作流程
1. **触发条件**：当 Monkeytype 的 CI 工作流程完成时，会触发 `ci-failure-comment.yml` 工作流程。
2. **下载数据**：该工作流程会下载由触发工作流程上传的一个工件（artifact）。
3. **读取内容**：从下载的工件中读取 `./pr_num/pr_num.txt` 的内容，并将其存储在一个变量中。

## 安全问题
- **变量验证缺失**：该变量的内容没有进行有效性检测（例如，确保它是一个数字）。
- **代码注入漏洞**：该变量随后被插入到 JavaScript 脚本中，攻击者可以利用这一点改变要执行的代码。

## 后果
这个漏洞使得攻击者能够获得对拉取请求的写入权限。

## 报告信息
此问题是由 GHSL 团队成员 @pwntester（Alvaro Muñoz）发现并报告的。如果您需要联系 GHSL 团队，请发送邮件至 securitylab@github.com，并在相关沟通中引用 GHSL-2024-167。