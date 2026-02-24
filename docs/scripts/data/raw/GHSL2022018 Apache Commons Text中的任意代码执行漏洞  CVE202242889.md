# GHSL-2022-018: Apache Commons Text中的任意代码执行漏洞 - CVE-2022-42889

## 概述

在Apache Commons Text的1.9版本中，`StringSubstitutor`类的默认插值器可能导致不安全的脚本评估和任意代码执行。

## 技术细节

- **问题描述**: 
  `StringSubstitutor`在使用默认插值器时（通过`StringSubstitutor.createInterpolator()`创建）会进行字符串查找，这个过程可能允许恶意代码执行。

- **风险**:
  如果不信任的数据被传入`StringSubstitutor.replace()`或`StringSubstitutor.replaceIn()`方法，攻击者可以利用`ScriptStringLookup`触发任意代码执行。

- **后果**: 
  此漏洞可能导致远程代码执行（Remote Code Execution, RCE）。

## 报告信息

此问题由GHSL团队成员@pwntester（Alvaro Muñoz）发现并报告。

如需联系GHSL团队，请发送邮件至securitylab@github.com，并在任何有关此问题的交流中提及GHSL-2022-018。