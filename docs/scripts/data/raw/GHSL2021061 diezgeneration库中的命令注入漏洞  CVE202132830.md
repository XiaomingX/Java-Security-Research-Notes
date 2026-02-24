# GHSL-2021-061: @diez/generation库中的命令注入漏洞 - CVE-2021-32830

## 漏洞概述
`@diez/generation`库中的`locateFont`方法存在命令注入漏洞。这意味着使用该库的开发者可能会无意中编写包含安全漏洞的代码。

## 技术背景
- **命令注入** 是一种安全漏洞，攻击者可以通过向程序传递恶意输入来执行任意命令。
- 此漏洞特别影响在 `locateFont` 方法中处理不可信输入的时候。

## 漏洞示例
截至报告时间（2021年3月25日），以下是一个简单的演示步骤：

1. 安装 `@diez/generation` 库。
2. 创建一个包含特定内容的文件（具体内容未提供）。
3. 运行该文件。

运行后会发现生成了名为 `exploit` 的文件。

> **注意**: 该示例仅在 MacOS 或已修补 `isMacOS` 函数的 Unix 系统上有效（可在 `node_modules/@diez/cli-core/lib/utils.js` 中找到）。

## 类似案例
该漏洞与其他 JavaScript 库中发现的命令注入漏洞类似，例如：
- CVE-2020-7646
- CVE-2020-7614
- CVE-2020-7597
- 等等

## 潜在影响
若库的用户使用不可信输入调用受影响的方法，可能会导致远程代码执行。

## 报告信息
此漏洞由 GitHub 工程师 @erik-krogh（Erik Krogh Kristensen）发现并报告。如需进一步联系，请通过 securitylab@github.com 联系 GHSL 团队，并提及 GHSL-2021-061。