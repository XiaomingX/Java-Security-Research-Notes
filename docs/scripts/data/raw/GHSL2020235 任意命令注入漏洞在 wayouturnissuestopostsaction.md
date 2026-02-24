# GHSL-2020-235: 任意命令注入漏洞在 wayou/turn-issues-to-posts-action

## 概述

`turn-issues-to-posts` 是一个 GitHub Actions，存在任意命令注入的漏洞。

## 漏洞描述

- 该功能使用 GitHub 问题的标题来生成一个 Bash 脚本。
- 如果标题中包含恶意内容，攻击者可以插入额外的命令。

### 示例

例如，标题为 `a".md; echo "test" #` 的问题会导致在操作日志中执行 `echo "test"`，从而打印出 `test` 。

## 风险

- 攻击者可以通过此漏洞获取秘密令牌等敏感信息。

## 报告信息

- 此漏洞由 GHSL 团队成员 @JarLob（Jaroslav Lobačevski）发现并报告。
- 如需联系 GHSL 团队，请发送邮件至 securitylab@github.com，并在邮件中提及 GHSL-2020-235。

--- 

这样重新描述使得技术基础知识更加易懂，并且清晰地传达了漏洞的内容、风险及联系信息。