# RedosVulnHunter

RedosVulnHunter 是一个自动化的混合分析工具，用于检测 ReDoS（正则表达式拒绝服务）漏洞。给定一个正则表达式，RedosVulnHunter 会尝试静态分析漏洞模式，并动态生成有效的攻击字符串。

RedosVulnHunter 基于 JDK 1.8 库中的正则表达式引擎实现。

更多详细信息可以参考这篇论文：[RedosVulnHunter: Detecting and Exploiting Regular Expression Denial-of-Service Vulnerabilities](https://www.computer.org/csdl/proceedings-article/sp/2021/893400b063/1t0x8WDjGGk)。

### 快速开始

#### 构建项目

RedosVulnHunter 使用 Maven 管理依赖，因此需要先安装 JDK (1.8) 和 Maven，然后运行：

```
mvn clean package
```

项目的所有依赖会打包成一个 jar 文件，位于 `./target/RedosVulnHunter-0.0.1-jar-with-dependencies`。

### 使用方法

这个项目提供三种使用方式：

#### 1. 测试单个正则表达式

如果你将正则表达式作为命令行参数传递，RedosVulnHunter 会测试这个正则表达式是否存在漏洞。

例如，运行：
```
java -jar target/RedosVulnHunter-0.0.1-jar-with-dependencies.jar "/\?\w.*?\[\w.*?\[\w.*?\]\]=/smiU"
```
你会得到：
```
/\?\w.*?\[\w.*?\[\w.*?\]\]=/smiU
Find vulnerability (Polynomial) in structure!
{"regex":"/\?\w.*?\[\w.*?\[\w.*?\]\]=/smiU","prefix":"/?0[0","pump":"[0","suffix":"\n"}
```
第一行是存在漏洞的正则表达式，第二行是漏洞类型，第三行是攻击字符串信息。
<img width="883" alt="image" src="https://github.com/user-attachments/assets/e31bc40b-56c8-42c2-bee3-e98e9248b050">

如果输入的正则表达式没有漏洞，你会看到：
```
Contains no vulnerability
```
请注意，输入的正则表达式需要进行转义，例如 `/\?\w.*?\[\w.*?\[\w.*?\]\]=/smiU` 中的反斜杠需要再加一个反斜杠。

#### 2. 从数据集中测试多个正则表达式

默认情况下（无命令行参数），RedosVulnHunter 会测试 `data` 文件夹中所有正则表达式的数据集，结果会保存到 `result` 文件夹中。

```
RedosVulnHunter
├─src
├─target  # RedosVulnHunter-0.0.1-jar-with-dependencies.jar
├─data    # 放置你的数据集
│   ├─test1.txt
│   └─test2.txt
└─result  # 结果会显示在这里
    ├─vul-test1.txt
    └─vul-test2.txt
```
然后运行：
```
java -jar target/RedosVulnHunter-0.0.1-jar-with-dependencies.jar
```
RedosVulnHunter 会在命令行上打印当前正在处理的正则表达式，完成所有正则表达式的测试后打印 "finished"。

在结果文件中，对于每个存在漏洞的正则表达式，RedosVulnHunter 会输出漏洞类型和攻击字符串信息。对于没有漏洞的正则表达式则不会有任何信息。

#### 3. 验证攻击字符串信息

第三种使用方式是提供两个命令行参数：`{输入文件路径}` 和 `{输出文件路径}`。它会计算最大长度为 `128` 的匹配步骤（论文中最大匹配步骤设置为 `1e8`）。

输入文件中的每一行应是包含 `regex`、`prefix`、`pump` 和 `suffix` 字段的 JSON 对象。
例如，可以使用 `./attackInfo450.txt` 文件，它包含 RedosVulnHunter 检测到的 `450` 个漏洞：
```
java -jar target/RedosVulnHunter-0.0.1-jar-with-dependencies.jar attackInfo450.txt out.txt
```
对于输入文件中的每一行，RedosVulnHunter 会在命令行中打印正则表达式、包含攻击字符串的 JSON 对象，以及匹配步骤。例如：
```
(\w+[\.\_\-]*)*\w+@[\w]+(.)*\w+$
{"input":"000...000\b","pattern":"(\w+[\.\_\-]*)*\w+@[\w]+(.)*\w+$"}
100000256
```
如果匹配步骤大于 `1e5`，对应的正则表达式会出现在输出文件中。

### 其他说明

注意，RedosVulnHunter 中的一些文件可能有其自己的版权声明，特别是修改了 JDK 1.8 库中的正则表达式引擎源文件和 [ReScue 项目](https://github.com/2bdenny/ReScue) 的源文件。

## 许可证

请查看 LICENSE.md 文件。

## 继承来自
 - https://github.com/cuhk-seclab/Revealer

