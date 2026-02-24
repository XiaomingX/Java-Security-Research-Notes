# GHSL-2024-051: Misskey中的GitHub Actions表达式注入漏洞

## 概述
Misskey存在一个安全漏洞，攻击者可以利用此漏洞接管代码库并窃取敏感信息。

## 漏洞详情

- **影响版本**: Misskey 2024.3.1
- **工作流程触发**: 该漏洞利用了在创建Pull Request时触发的`storybook.yml`工作流程。
- **权限问题**: 此工作流程使用的GitHub存储库令牌具有写权限，因为组织/存储库的默认权限设置为可读可写。

## 漏洞利用
1. 攻击者可以通过创建一个特定的Pull Request来注入数据（即分支名称 `${{ github.event.pull_request.head.ref }}`）。
2. 注入的数据被用在工作流程的Run步骤中，使攻击者能够操控GitHub Runner 执行自定义命令。
3. 这可能导致盗取工作流程中的秘密信息和修改代码库。
