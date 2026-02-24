# GHSL-2020-109: Codecov中的命令注入漏洞

## 概述
Codecov的上传方法存在一个命令注入漏洞。使用`codecov-node`库的客户可能会不知道这一点，因此可能会不小心编写包含此漏洞的代码。

## 漏洞细节
- **影响版本**: Codecov NodeJS Uploader
- **提交ID**: eeff4e1
- **漏洞机制**: 漏洞允许攻击者通过未经过滤的输入执行任意命令。

## 演示
1. **安装codecov**: 首先安装`codecov`。
2. **创建文件**: 创建一个含有特定内容的文件。
3. **运行文件**: 执行该文件后，会生成一个名为`exploit`的文件。

### 注意
我们已知CVE-2020-7597的存在，但之前的修复不完整，只阻止了`&`符号，而我们的示例使用了反引号（`）绕过了过滤器。

## 风险
如果库的客户端使用不受信任的输入调用这个脆弱的方法，可能会导致远程代码执行。

## 建议
建议避免使用能够将字符串解释为shell命令的API，例如，使用`child_process.execFile`而不是`child_process.exec`。

## 联系方式
此漏洞由GitHub工程师@erik-krogh（Erik Krogh Kristensen）发现并报告。对于此问题，您可以通过邮件联系GHSL团队，邮箱为securitylab@github.com，并在通讯中包含“GHSL-2020-109”。