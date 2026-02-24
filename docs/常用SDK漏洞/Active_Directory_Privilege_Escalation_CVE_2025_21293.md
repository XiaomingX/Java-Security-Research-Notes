---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ CVE-2025-21293 Detection: PoC Exploit Released for a Privilege Escalation Vulnerability in Active Directory Domain Services Daryna Olyniychuk WRITTEN BY Daryna Olyniychuk Team Lead of Marketing February 04, 2025 · 4 min read CVE-2025-21293 Detection: PoC Exploit Released for a Privilege Escalation Vulnerability in Active Directory Domain Services Table of contents: Detect CVE-2025-21293 Exploitation Attempts CVE-2025-21293 Analysis Shortly after the critical zero-click OLE vulnerability in Microsoft Outlook (CVE-2025-21298), yet another dangerous security threat has come to light. A recently patched privilege escalation vulnerability affecting Active Directory Domain Services (CVE-2025-21293) has taken a dangerous turn. With a proof-of-concept (PoC) exploit now circulating publicly online, the risk of exploitation has significantly increased. This vulnerability opens the door for attackers to gain system-level privileges within an organization’s Active Directory environment, potentially compromising sensitive operations and data. Detect CVE-2025-21293 Exploitation Attempts CVE-2025-21293 stands out for its potential to cause widespread disruption. Active Directory is a fundamental component of corporate environments, from Fortune 500 giants to small businesses, making this vulnerability a serious concern. The public release of a PoC exploit has only increased the urgency for proactive security measures. With attackers potentially seeking to exploit the flaw, security teams require a reliable source of detection content to spot intrusions on time. SOC Prime Platform for collective cyber defense offers a couple of relevant Sigma rules accompanied by a complete product suite for threat detection and hunting. Possible Abuse of Performance Counters (via registry_event) This rule by the SOC Prime Team helps to detect potential exploitation of CVE-2025-21293 or persistence and monitor for unauthorized registry modifications, particularly the creation of subkeys under HKLM\SYSTEM\CurrentControlSet\Services\DnsCache and HKLM\SYSTEM\CurrentControlSet\Services\NetBT. Additionally, it helps to spot the registration of performance counters linked to unrecognized DLLs, as this may indicate an attempt to execute code with elevated privileges. The detection is compatible with multiple SIEM, EDR, and Data Lake solutions and mapped to MITRE ATT&CK®, addressing the Event Triggered Execution (T1546) technique. A User was Added to a Group that Usually Must be Empty (via audit) This detection is related to the list of groups that usually must be empty because they are rarely used legitimately. The nested privileges of these groups could provide an attacker with an additional path to compromise Tier0 / Control Plane of Active Directory. This rule addresses the Account Manipulation (T1098) technique. Click the Explore Detections button below to reach relevant context-enriched Sigma rules to proactively detect CVE-2025-21293 exploitation attempts: Explore Detections Security professionals seeking more relevant content addressing the proactive vulnerability exploitation detection use case might access the whole relevant detection stack by hitting this link. CVE-2025-21293 Analysis The vulnerability stems from an issue within Active Directory “Network Configuration Operators” group which is a default security group automatically created during the setup of on-premises domain controllers. While this group is meant to allow users to manage network interfaces without full administrative rights, Microsoft granted it excessive privileges, including the ability to create registry subkeys for critical system services. With this door wide open, a recently released PoC exploit leverages Windows Performance Counters — a mechanism that allows applications and services to register monitoring routines through performance counter consumers such as PerfMon.exe or WMI. While typically used to track system and application performance, performance counters also provide a pathway for executing custom code via DLLs, as BirkeP, the researcher who revealed the PoC, highlighted. By exploiting the excessive permissions granted to the “Network Configuration Operators” group, an attacker could register malicious Performance Counter DLLs under the DnsCache service registry key. Once registered, these DLLs could be executed with SYSTEM-level privileges, posing a critical security threat. CVE-2025-21293 vulnerability was patched by Microsoft in January 2025 during the Patch Tuesday release. Users are strongly recommended to explore the advisory and apply the patch immediately. As Active Directory remains a fundamental component for identity management, recognizing and mitigating these vulnerabilities is essential. Rely on SOC Prime Platform for proactive vulnerability exploitation and a future-proof defense against any emerging cyber threats using a complete product suite for advanced threat detection, automated threat hunting, and intelligence-driven detection engineering
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
CVE-2025-21293 Detection: PoC Exploit Released for a Privilege Escalation Vulnerability in Active Directory Domain Services
Daryna Olyniychuk
WRITTEN BY
Daryna Olyniychuk
Team Lead of Marketing
February 04, 2025 · 4 min read
CVE-2025-21293 Detection: PoC Exploit Released for a Privilege Escalation Vulnerability in Active Directory Domain Services
Table of contents:
Detect CVE-2025-21293 Exploitation Attempts
CVE-2025-21293 Analysis
Shortly after the critical zero-click OLE vulnerability in Microsoft Outlook (CVE-2025-21298), yet another dangerous security threat has come to light. A recently patched privilege escalation vulnerability affecting Active Directory Domain Services (CVE-2025-21293) has taken a dangerous turn. With a proof-of-concept (PoC) exploit now circulating publicly online, the risk of exploitation has significantly increased. This vulnerability opens the door for attackers to gain system-level privileges within an organization’s Active Directory environment, potentially compromising sensitive operations and data.

Detect CVE-2025-21293 Exploitation Attempts
CVE-2025-21293 stands out for its potential to cause widespread disruption. Active Directory is a fundamental component of corporate environments, from Fortune 500 giants to small businesses, making this vulnerability a serious concern. The public release of a PoC exploit has only increased the urgency for proactive security measures.

With attackers potentially seeking to exploit the flaw, security teams require a reliable source of detection content to spot intrusions on time. SOC Prime Platform for collective cyber defense offers a couple of relevant Sigma rules accompanied by a complete product suite for threat detection and hunting.

Possible Abuse of Performance Counters (via registry_event)

This rule by the SOC Prime Team helps to detect potential exploitation of CVE-2025-21293 or persistence and monitor for unauthorized registry modifications, particularly the creation of subkeys under HKLM\SYSTEM\CurrentControlSet\Services\DnsCache and HKLM\SYSTEM\CurrentControlSet\Services\NetBT. Additionally, it helps to spot the registration of performance counters linked to unrecognized DLLs, as this may indicate an attempt to execute code with elevated privileges. The detection is compatible with multiple SIEM, EDR, and Data Lake solutions and mapped to MITRE ATT&CK®, addressing the Event Triggered Execution (T1546) technique.

A User was Added to a Group that Usually Must be Empty (via audit)

This detection is related to the list of groups that usually must be empty because they are rarely used legitimately. The nested privileges of these groups could provide an attacker with an additional path to compromise Tier0 / Control Plane of Active Directory. This rule addresses the Account Manipulation (T1098) technique.

Click the Explore Detections button below to reach relevant context-enriched Sigma rules to proactively detect CVE-2025-21293 exploitation attempts:

Explore Detections

Security professionals seeking more relevant content addressing the proactive vulnerability exploitation detection use case might access the whole relevant detection stack by hitting this link.

CVE-2025-21293 Analysis
The vulnerability stems from an issue within Active Directory “Network Configuration Operators” group which is a default security group automatically created during the setup of on-premises domain controllers. While this group is meant to allow users to manage network interfaces without full administrative rights, Microsoft granted it excessive privileges, including the ability to create registry subkeys for critical system services.

With this door wide open, a recently released PoC exploit leverages Windows Performance Counters — a mechanism that allows applications and services to register monitoring routines through performance counter consumers such as PerfMon.exe or WMI. While typically used to track system and application performance, performance counters also provide a pathway for executing custom code via DLLs, as BirkeP, the researcher who revealed the PoC, highlighted.

By exploiting the excessive permissions granted to the “Network Configuration Operators” group, an attacker could register malicious Performance Counter DLLs under the DnsCache service registry key. Once registered, these DLLs could be executed with SYSTEM-level privileges, posing a critical security threat.

CVE-2025-21293 vulnerability was patched by Microsoft in January 2025 during the Patch Tuesday release. Users are strongly recommended to explore the advisory and apply the patch immediately.

As Active Directory remains a fundamental component for identity management, recognizing and mitigating these vulnerabilities is essential. Rely on SOC Prime Platform for proactive vulnerability exploitation and a future-proof defense against any emerging cyber threats using a complete product suite for advanced threat detection, automated threat hunting, and intelligence-driven detection engineering.

---

**Assistant:** ## Active Directory权限提升漏洞 CVE-2025-21293 简述与应对
最近，Active Directory（AD）域服务中发现了一个权限提升漏洞，编号为 CVE-2025-21293。由于网上已经出现了概念验证（PoC）的利用代码，该漏洞的风险显著增加。攻击者可以利用此漏洞在组织的AD环境中获得系统级权限，从而可能危及敏感操作和数据。
### 技术原理：
此漏洞源于Active Directory中“网络配置操作员”组的不当权限配置。这个组的本意是允许用户管理网络接口，而无需完全的管理员权限。但是，Microsoft授予了它过多的权限，包括为关键系统服务创建注册表子项的能力。
攻击者可以利用此权限，通过Windows性能计数器注册恶意DLL。性能计数器通常用于跟踪系统和应用程序性能，但也允许通过DLL执行自定义代码。攻击者可以将恶意DLL注册到`DnsCache`服务注册表项下，一旦注册，这些DLL就可以使用`SYSTEM`权限执行，从而完全控制系统。
### 实际应用例子：
- ### 攻击场景： 假设一个内部员工获得了“网络配置操作员”组的权限（可能是无意或恶意）。他/她可以利用此漏洞上传并执行恶意DLL，从而获得整个域的控制权。
- ### Demo 代码（PowerShell）： *以下代码仅为演示目的，请勿在生产环境中使用*。
powershell# 步骤1: 创建恶意DLL（需要C#编译）
# 步骤2: 将DLL复制到目标机器
# 步骤3: 修改注册表，注册性能计数器
$RegPath = "HKLM:\SYSTEM\CurrentControlSet\Services\DnsCache\Performance"
$DLLPath = "C:\Malicious.dll"
New-ItemProperty -Path $RegPath -Name "Library" -Value $DLLPath -PropertyType String
New-ItemProperty -Path $RegPath -Name "Open" -Value "OpenProcedure" -PropertyType String
New-ItemProperty -Path $RegPath -Name "Collect" -Value "CollectProcedure" -PropertyType String
New-ItemProperty -Path $RegPath -Name "Close" -Value "CloseProcedure" -PropertyType String
# 步骤4: 重启DnsCache服务 (触发DLL执行)
Restart-Service DnsCache
*请注意，以上代码需要先创建一个恶意的DLL文件，并且需要相应的权限才能执行注册表修改和重启服务。实际攻击会更加复杂，并且可能涉及权限绕过等技术。*
### 应对措施：
- **立即安装补丁：** Microsoft已在2025年1月的补丁星期二发布中修复了此漏洞。请务必尽快应用此补丁。
- **监控异常注册表修改：** 监控`HKLM\SYSTEM\CurrentControlSet\Services\DnsCache`和`HKLM\SYSTEM\CurrentControlSet\Services\NetBT`下未经授权的注册表子键创建。
- **监控性能计数器滥用：** 检查与未知DLL关联的性能计数器注册。
- **限制“网络配置操作员”组的权限：** 审查并限制此组的权限，确保其成员只能执行必要的网络管理任务。
- **加强Active Directory安全监控：** 利用SIEM、EDR等安全工具，监控Active Directory中的异常活动。
### 检测规则示例 (Sigma):
以下是一个Sigma规则示例，用于检测可能的CVE-2025-21293利用，侧重于注册表事件：
texttitle: Possible Abuse of Performance Counters (CVE-2025-21293)
logsource:
category: registry_event
detection:
selection:
EventType: RegistryEvent
TargetObject: 'HKLM\SYSTEM\CurrentControlSet\Services\DnsCache\Performance'
# 可以添加更多条件，例如监控特定的DLL名称
condition: selection
level: high
### 指标数据：
- **漏洞严重性：** 权限提升，可能导致域控制器的完全控制。
- **影响范围：** 所有使用Active Directory域服务的组织，包括大型企业和小型企业。
- **修复优先级：** 高，应立即修复。
总而言之，CVE-2025-21293是一个严重的安全漏洞，需要立即采取行动来缓解风险。通过应用补丁、加强监控和限制权限，可以有效地降低攻击者利用此漏洞的可能性。