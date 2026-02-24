---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ CVE-2022-22963: Remote code execution in Spring Cloud Function by malicious Spring Expression CRITICAL | MARCH 29, 2022 | CVE-2022-22963 Description In Spring Cloud Function versions 3.1.6, 3.2.2 and older unsupported versions, when using routing functionality it is possible for a user to provide a specially crafted SpEL as a routing-expression that may result in remote code execution and access to local resources. Affected Spring Products and Versions Spring Cloud Function 3.1.6 3.2.2 Older, unsupported versions are also affected Mitigation Users of affected versions should upgrade to 3.1.7, 3.2.3. No other steps are necessary. Releases that have fixed this issue include: Spring Cloud Function 3.1.7 3.2.3
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
CVE-2022-22963: Remote code execution in Spring Cloud Function by malicious Spring Expression
CRITICAL | MARCH 29, 2022 | CVE-2022-22963
Description
In Spring Cloud Function versions 3.1.6, 3.2.2 and older unsupported versions, when using routing functionality it is possible for a user to provide a specially crafted SpEL as a routing-expression that may result in remote code execution and access to local resources.

Affected Spring Products and Versions
Spring Cloud Function
3.1.6
3.2.2
Older, unsupported versions are also affected
Mitigation
Users of affected versions should upgrade to 3.1.7, 3.2.3. No other steps are necessary. Releases that have fixed this issue include:

Spring Cloud Function
3.1.7
3.2.3

---

**Assistant:** ## Spring Cloud Function 远程代码执行漏洞 (CVE-2022-22963)
### 漏洞简介
Spring Cloud Function 在 3.1.6、3.2.2 及更早的不受支持版本中存在一个严重的安全漏洞（CVE-2022-22963）。当使用路由功能时，恶意用户可以通过构造特殊的 SpEL (Spring Expression Language) 表达式作为路由表达式，实现远程代码执行，并访问本地资源。这意味着攻击者可以控制你的服务器，例如读取敏感文件、安装恶意软件等。
### 受影响版本
- Spring Cloud Function 3.1.6
- Spring Cloud Function 3.2.2
- 更早的不受支持版本
### 修复方案
立即升级到以下版本：
- Spring Cloud Function 3.1.7
- Spring Cloud Function 3.2.3
### 技术细节
该漏洞的核心在于 SpEL 表达式的解析和执行。Spring Cloud Function 的路由功能允许开发者使用 SpEL 表达式来动态决定请求的路由目标。如果未对 SpEL 表达式进行充分的安全检查，攻击者就可以构造恶意的 SpEL 表达式，利用 SpEL 表达式引擎执行任意代码。
SpEL 类似于 Java 的表达式语言，它允许在运行时查询和操作对象图。 攻击者可以利用 SpEL 表达式来调用 Java 的反射机制，从而执行任意代码。
### 实际应用例子
假设你有一个 Spring Cloud Function 应用，用于处理用户订单。该应用使用路由功能根据用户所在的地区将订单路由到不同的处理函数。
java@SpringBootApplication
public class OrderApplication {
public static void main(String[] args) {
SpringApplication.run(OrderApplication.class, args);
}
@Bean
public FunctionRouter functionRouter() {
return new FunctionRouter();
}
public static class FunctionRouter implements Function&lt;String, String&gt; {
@Override
public String apply(String route) {
// 恶意用户可以控制 route 变量，并将其设置为恶意的 SpEL 表达式
return route;
}
}
}
如果你的应用存在 CVE-2022-22963 漏洞，攻击者可以通过修改 `route` 参数，注入恶意的 SpEL 表达式，例如：
textT(java.lang.Runtime).getRuntime().exec("calc.exe")
这个 SpEL 表达式会调用 `java.lang.Runtime.getRuntime().exec()` 方法，执行 `calc.exe` 命令，从而在服务器上启动计算器程序。这只是一个简单的例子，攻击者可以执行更复杂的命令，例如读取敏感文件、安装恶意软件等。
### Demo 代码
以下是一个简单的示例，演示了如何利用 SpEL 表达式执行任意代码：
javaimport org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
public class SpelDemo {
public static void main(String[] args) {
String spelExpression = "T(java.lang.Runtime).getRuntime().exec('calc.exe')";
ExpressionParser parser = new SpelExpressionParser();
Expression expression = parser.parseExpression(spelExpression);
// 执行 SpEL 表达式
expression.getValue();
}
}
在这个例子中，我们使用 `SpelExpressionParser` 解析 SpEL 表达式，然后调用 `expression.getValue()` 执行该表达式。这将会在本地机器上启动计算器程序。
### 安全建议
- **及时更新:** 务必将 Spring Cloud Function 升级到安全版本，以修复该漏洞。
- **输入验证:** 对所有用户输入进行严格的验证，防止恶意用户注入恶意的 SpEL 表达式或其他恶意代码。
- **最小权限原则:** 确保 Spring Cloud Function 运行在最小权限的环境中，以减少攻击者利用漏洞造成的损失。
- **安全审计:** 定期进行安全审计，检查系统中是否存在其他安全漏洞。
### 数值指标
根据 NIST (美国国家标准与技术研究院) 的数据，CVE-2022-22963 漏洞的 CVSS v3 评分为 **9.8 (Critical)**，表明该漏洞的危害程度非常高。 成功利用该漏洞的攻击者可以完全控制受影响的系统，并造成严重的损失。
### 总结
CVE-2022-22963 是一个非常严重的安全漏洞，可能导致远程代码执行。请务必及时升级 Spring Cloud Function 到安全版本，并采取其他安全措施，以保护你的系统安全。