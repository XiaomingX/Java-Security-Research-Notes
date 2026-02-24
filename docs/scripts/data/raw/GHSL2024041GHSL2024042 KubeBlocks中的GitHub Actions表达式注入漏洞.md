# GHSL-2024-041_GHSL-2024-042: KubeBlocks中的GitHub Actions表达式注入漏洞

## 概述
KubeBlocks存在一个安全漏洞，允许攻击者通过注入GitHub Actions表达式控制代码仓库，从而窃取敏感信息。

### 受影响的版本
- KubeBlocks版本：v0.8.2

## 漏洞描述
1. **工作流触发**:
   - **pull-request-check.yml**：当创建Pull Request时触发。
   - **cicd-pull-request.yml**：当提交Pull Request审核时触发。

2. **权限问题**:
   - 默认的工作流权限为读写权限，允许使用全权访问的GitHub仓库令牌。

3. **攻击向量**:
   - 在工作流中，攻击者可以利用Pull Request提供的数据（如Pull Request标题或分支名称）注入到运行步骤的脚本中。
   - 这让攻击者能够操纵GitHub Runner，执行自定义命令并可能修改仓库。

## 可能后果
- 窃取工作流中的秘密信息。
- 修改代码仓库内容。

## 发现者
- 此漏洞由GHSL团队成员Jorge Rosillo（@jorgectf）发现并报告。

## 联系方式
如需了解更多信息或报告问题，请联系GHSL团队：securitylab@github.com，务必在邮件中提到GHSL-2024-041或GHSL-2024-042。