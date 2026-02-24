# GHSL-2022-018: Apache Commons Text中的任意代码执行漏洞 - CVE-2022-42889

## 概述

在Apache Commons Text版本1.9中，有一个安全漏洞，可能会导致任意代码执行。这是由于**StringSubstitutor**类的默认插值器造成的。

## 技术细节

- **StringSubstitutor**：这个类用于字符串替换，功能强大，但使用时需要小心。
- **默认插值器**：通过`StringSubstitutor.createInterpolator()`创建的插值器存在安全隐患。
  
### 漏洞说明

- 当不可信的数据被传入`StringSubstitutor.replace()`或`StringSubstitutor.replaceIn()`方法时，攻击者可以利用**ScriptStringLookup**功能进行恶意代码执行。
- 这可能导致*远程代码执行*(RCE)，即攻击者能够在受害者的系统上运行任意代码。
