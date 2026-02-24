---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ CVE-2024-38856: Pre-Auth RCE Vulnerability in Apache OFBiz NATARAJA GUNDALE, RISHABH NIHALANI, SAKSHI AGGARWAL, NISHANT GUPTA August 12, 2024 - 3 min read Threatlabz Research Contents Introduction Recommendations Affected Versions Background How It Works Conclusion Zscaler Coverage More blogs Copy URL Introduction On August 5, 2024, researchers at SonicWall discovered a zero-day security flaw in Apache OFBiz tracked as CVE-2024-38856. The vulnerability, which has been assigned a CVSS score of 9.8, allows threat actors to perform pre-authentication remote code execution (RCE). While testing a patch for CVE-2024-36104, SonicWall researchers discovered that unauthenticated access was permitted to the ProgramExport endpoint, potentially enabling the execution of arbitrary code. These vulnerabilities arise from a flaw in the override view functionality, which can be exploited by unauthorized threat actors through maliciously crafted requests, leading to the remote code execution. Recommendations Zscaler ThreatLabz strongly advises users of the Apache OFBiz application to promptly upgrade to version 18.12.15, as this version contains fixes to mitigate the security vulnerabilities identified in CVE-2024-38856 and CVE-2024-36104. Affected Versions The following versions of Apache OFBiz are affected by the disclosed vulnerabilities and should be updated immediately: All versions 18.12.13 and below are impacted by CVE-2024-36104 All versions 18.12.14 and below are impacted by CVE-2024-38856 Background Apache OFBiz is an open-source Enterprise Resource Planning (ERP) system that provides business solutions for various industries. This includes tools to manage operations like customer relationships, order processing, human resource functions, warehouse management, and more. During the analysis of CVE-2024-36104, a vulnerability disclosed on June 3, 2024, SonicWall researchers discovered the ControlServlet and RequestHandler functions received different endpoints when handling the same request. Ideally, both functions should process the same endpoint. CVE-2024-38856 allows unauthenticated access to the ProgramExport endpoint, which should have been restricted. How It Works In the previous vulnerability, CVE-2024-36104, Apache OFBiz was found to have a flaw that enabled remote attackers to access system directories due to inadequate validation of user requests. Exploiting this flaw involved sending a malformed URL containing '..' sequences, which could result in the execution of arbitrary code on the system. An example of a malformed POST request and request-body is shown below. POST /webtools/control/forgotPassword/;%2e%2e/ProgramExport POST-Body: groovyProgram=throw new Exception('whoami'.execute().text); In the figure below, the example malformed request is shown. This request includes a command 'whoami' that is being executed, and the resulting output of the command is displayed in the error message. The output of the command is highlighted in the green box. An example of a POST request related to CVE-2024-36104. The request includes an encoded request body, along with its corresponding output. Figure 1: An example of a POST request related to CVE-2024-36104. The request includes an encoded request body, along with its corresponding output. The most recent vulnerability, CVE-2024-38856, permits unauthorized access to the ProgramExport endpoint without the need for a path traversal vector. This means that access is granted even when it should have been restricted. The figure below shows an attack chain exploiting CVE-2024-38856. The attack chain depicting an attacker exploiting CVE-2024-38856. Figure 2: The attack chain depicting an attacker exploiting CVE-2024-38856. The figure below shows the malformed request, without a path traversal vector, being executed, and the resulting output of the command is displayed in the error message. An example of a POST request related to CVE-2024-38856. The request includes an encoded request body, and the output associated with it. Figure 3: An example of a POST request related to CVE-2024-38856. The request includes an encoded request body, and the output associated with it. Further investigation revealed that unauthenticated access to the ProgramExport endpoint was possible by combining it with any other endpoint that does not require authentication. Examples of such endpoints include: forgotPassword showDateTime TestService view main URLs that could be used to exploit this vulnerability are: POST /webtools/control/forgotPassword/ProgramExport POST /webtools/control/showDateTime/ProgramExport POST /webtools/control/TestService/ProgramExport POST /webtools/control/view/ProgramExport POST /webtools/control/main/ProgramExport Conclusion To protect against CVE-2024-38856, it is important to update Apache OFBiz systems to version 18.12.15 as soon as possible. Neglecting to upgrade promptly exposes systems to significant security risks, which could enable threat actors to manipulate login parameters and execute arbitrary code on the target server. Zscaler Coverage The Zscaler ThreatLabz team has deployed the following. Zscaler Advanced Threat Protection App.Exploit.CVE-2024-38856 App.Exploit.CVE-2024-36104 Zscaler Private Access AppProtection HTML.Exploit.CommandInjection:6000004 For more details, visit the Zscaler Threat Library
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
CVE-2024-38856: Pre-Auth RCE Vulnerability in Apache OFBiz
NATARAJA GUNDALE,
RISHABH NIHALANI,
SAKSHI AGGARWAL,
NISHANT GUPTA
August 12, 2024 - 3 min read
Threatlabz Research
Contents

Introduction
Recommendations
Affected Versions
Background
How It Works
Conclusion
Zscaler Coverage
More blogs
Copy URL
Introduction
On August 5, 2024, researchers at SonicWall discovered a zero-day security flaw in Apache OFBiz tracked as CVE-2024-38856. The vulnerability, which has been assigned a CVSS score of 9.8, allows threat actors to perform pre-authentication remote code execution (RCE). While testing a patch for CVE-2024-36104, SonicWall researchers discovered that unauthenticated access was permitted to the ProgramExport endpoint, potentially enabling the execution of arbitrary code. These vulnerabilities arise from a flaw in the override view functionality, which can be exploited by unauthorized threat actors through maliciously crafted requests, leading to the remote code execution.

Recommendations
Zscaler ThreatLabz strongly advises users of the Apache OFBiz application to promptly upgrade to version 18.12.15, as this version contains fixes to mitigate the security vulnerabilities identified in CVE-2024-38856 and CVE-2024-36104.

Affected Versions
The following versions of Apache OFBiz are affected by the disclosed vulnerabilities and should be updated immediately: 

All versions 18.12.13 and below are impacted by CVE-2024-36104
All versions 18.12.14 and below are impacted by CVE-2024-38856
Background
Apache OFBiz is an open-source Enterprise Resource Planning (ERP) system that provides business solutions for various industries. This includes tools to manage operations like customer relationships, order processing, human resource functions, warehouse management, and more.

During the analysis of CVE-2024-36104, a vulnerability disclosed on June 3, 2024, SonicWall researchers discovered the ControlServlet and RequestHandler functions received different endpoints when handling the same request. Ideally, both functions should process the same endpoint. CVE-2024-38856 allows unauthenticated access to the ProgramExport endpoint, which should have been restricted.

How It Works
In the previous vulnerability, CVE-2024-36104, Apache OFBiz was found to have a flaw that enabled remote attackers to access system directories due to inadequate validation of user requests. Exploiting this flaw involved sending a malformed URL containing '..' sequences, which could result in the execution of arbitrary code on the system.

An example of a malformed POST request and request-body is shown below.

POST /webtools/control/forgotPassword/;%2e%2e/ProgramExport

POST-Body: groovyProgram=throw new Exception('whoami'.execute().text);

In the figure below, the example malformed request is shown. This request includes a command 'whoami' that is being executed, and the resulting output of the command is displayed in the error message. The output of the command is highlighted in the green box.

 An example of a POST request related to CVE-2024-36104. The request includes an encoded request body, along with its corresponding output.
Figure 1: An example of a POST request related to CVE-2024-36104. The request includes an encoded request body, along with its corresponding output.

The most recent vulnerability, CVE-2024-38856, permits unauthorized access to the ProgramExport endpoint without the need for a path traversal vector. This means that access is granted even when it should have been restricted. 

The figure below shows an attack chain exploiting CVE-2024-38856.

The attack chain depicting an attacker exploiting CVE-2024-38856.
Figure 2: The attack chain depicting an attacker exploiting CVE-2024-38856.

The figure below shows the malformed request, without a path traversal vector, being executed, and the resulting output of the command is displayed in the error message.

An example of a POST request related to CVE-2024-38856. The request includes an encoded request body, and the output associated with it.
Figure 3: An example of a POST request related to CVE-2024-38856. The request includes an encoded request body, and the output associated with it.

Further investigation revealed that unauthenticated access to the ProgramExport endpoint was possible by combining it with any other endpoint that does not require authentication. Examples of such endpoints include:

forgotPassword 
showDateTime 
TestService 
view 
main
URLs that could be used to exploit this vulnerability are:

POST /webtools/control/forgotPassword/ProgramExport
POST /webtools/control/showDateTime/ProgramExport
POST /webtools/control/TestService/ProgramExport
POST /webtools/control/view/ProgramExport
POST /webtools/control/main/ProgramExport
Conclusion
To protect against CVE-2024-38856, it is important to update Apache OFBiz systems to version 18.12.15 as soon as possible. Neglecting to upgrade promptly exposes systems to significant security risks, which could enable threat actors to manipulate login parameters and execute arbitrary code on the target server.

Zscaler Coverage
The Zscaler ThreatLabz team has deployed the following.

Zscaler Advanced Threat Protection

App.Exploit.CVE-2024-38856
App.Exploit.CVE-2024-36104
Zscaler Private Access AppProtection

HTML.Exploit.CommandInjection:6000004
For more details, visit the Zscaler Threat Library.

---

**Assistant:** ## Apache OFBiz 远程代码执行漏洞 (CVE-2024-38856) 详解
### 什么是 Apache OFBiz？
Apache OFBiz 是一个开源的企业资源计划 (ERP) 系统，可以帮助公司管理各种业务，比如客户关系、订单处理、人力资源、仓库管理等等。
### 漏洞描述
2024 年 8 月 5 日，SonicWall 的研究人员发现 Apache OFBiz 存在一个安全漏洞，编号为 CVE-2024-38856。这个漏洞允许攻击者在*未*登录的情况下，直接在服务器上执行任意代码，CVSS 评分为 9.8，属于*高危*漏洞。简单来说，就是黑客可以远程控制你的服务器。
### 受影响的版本
所有 18.12.14 及以下版本的 Apache OFBiz 都受此漏洞影响。所以，如果你在使用这些版本，需要*立即*升级。
### 漏洞原理
这个漏洞的根源在于 `ProgramExport` 这个功能没有进行严格的权限控制。正常情况下，这个功能应该只有授权用户才能访问。但是，攻击者可以利用一些其他的*无需登录*即可访问的接口，比如 `forgotPassword`、`showDateTime` 等，和 `ProgramExport` 组合起来，绕过权限验证，从而执行恶意代码。
例如，攻击者可以通过发送以下 POST 请求来利用此漏洞：
textPOST /webtools/control/forgotPassword/ProgramExport
POST-Body: groovyProgram=throw new Exception('whoami'.execute().text);
在这个例子中，攻击者利用 `forgotPassword` 接口和 `ProgramExport` 接口组合，并通过 `groovyProgram` 参数执行了 `whoami` 命令。这个命令会显示当前用户的用户名，如果攻击成功，就意味着攻击者可以在服务器上执行任何命令。
### 实际案例
假设一家公司使用 Apache OFBiz 管理其电商平台。如果该公司使用的 Apache OFBiz 版本存在 CVE-2024-38856 漏洞，那么攻击者就可以利用该漏洞，直接在服务器上执行恶意代码。
攻击者可能会执行以下操作：
- **窃取客户数据**：攻击者可以读取数据库中的客户信息，包括姓名、地址、电话号码、信用卡信息等。根据 Verizon 的《2020 年数据泄露调查报告》，Web 应用程序攻击是造成数据泄露的常见原因，其中涉及个人数据的泄露可能导致平均 150 美元的单次记录成本。
- **篡改商品价格**：攻击者可以修改商品的价格，导致公司损失收入。
- **植入恶意代码**：攻击者可以在服务器上植入恶意代码，例如挖矿程序、僵尸网络客户端等。根据 CrowdStrike 的 2021 年全球威胁报告，针对供应链的攻击增加了 200%，表明攻击者越来越倾向于利用软件漏洞进行渗透。
- **勒索赎金**：攻击者可以加密服务器上的数据，并要求公司支付赎金才能解密。根据 Sophos 的《2021 年勒索软件状态报告》，勒索软件攻击的平均赎金支付额为 170,404 美元，给企业带来了巨大的经济损失。
### 修复方案
- **升级到最新版本**：将 Apache OFBiz 升级到 18.12.15 或更高版本，这些版本已经修复了 CVE-2024-38856 漏洞。
- **使用防火墙**：使用防火墙可以阻止恶意流量访问 Apache OFBiz 服务器。
- **安全加固**：对 Apache OFBiz 服务器进行安全加固，例如禁用不必要的服务、修改默认密码等。
### Demo 代码（Groovy 脚本）
以下是一个简单的 Groovy 脚本，可以模拟 CVE-2024-38856 漏洞的利用：
groovy// 模拟执行系统命令
def executeCommand(String command) {
try {
def process = command.execute()
process.waitFor()
return process.text
} catch (Exception e) {
return "Error executing command: ${e.message}"
}
}
// 漏洞利用
def exploit(String command) {
return executeCommand(command)
}
// 测试
def result = exploit("whoami")
println "Command execution result: ${result}"
### 注意： 此代码仅用于演示漏洞原理，请勿在生产环境中使用。
### 总结
CVE-2024-38856 是一个高危漏洞，可能导致严重的后果。请所有使用 Apache OFBiz 的用户*尽快*升级到最新版本，并采取必要的安全措施，以保护您的系统安全。