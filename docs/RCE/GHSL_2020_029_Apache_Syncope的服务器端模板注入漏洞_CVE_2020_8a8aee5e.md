# GHSL-2020-029: Apache Syncope的服务器端模板注入漏洞（CVE-2020-1959）

## 概述

在Apache Syncope中发现了一个服务器端模板注入漏洞。攻击者可以通过这个漏洞注入任意的Java EL表达式，从而导致远程代码执行（RCE）。

## 影响版本

- Apache Syncope: 2.1.5

## 漏洞详情

通过注入Java表达式语言（EL）表达式，攻击者可以在服务器上以Syncope服务账户权限运行任意代码。

- Apache Syncope使用Java Bean验证（JSR 380）的自定义约束验证器，例如`org.apache.syncope.core.persistence.jpa.validation.entity.AnyObjectValidator`。
- 在构建自定义约束违例错误消息时，可以插入不同类型的文本，包括Java EL表达式。
- 如果攻击者可以注入恶意数据到错误消息模板中，那么就可以执行任意Java代码。
- 共有25个验证器使用了`ConstraintValidatorContext.buildConstraintViolationWithTemplate()`，其中有20个显然存在漏洞（将验证后的值反映在错误消息中）。

## 风险

此漏洞可能导致远程代码执行。

## 修复建议

有多种方法可以解决此问题，具体的修复方案已经在相关提交中实施。
