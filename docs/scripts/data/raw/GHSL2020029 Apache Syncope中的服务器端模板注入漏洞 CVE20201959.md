# GHSL-2020-029: Apache Syncope中的服务器端模板注入漏洞 (CVE-2020-1959)

## 概述

在Apache Syncope中发现了一种服务器端模板注入漏洞，攻击者可以注入任意的Java EL表达式，导致远程代码执行(RCE)的风险。

## 技术细节

- **影响版本**: Apache Syncope 2.1.5
- **漏洞性质**: 攻击者可以利用注入的Java表达式在服务器上以Syncope服务账户的权限执行任意代码。

### 如何发生

1. Apache Syncope使用Java Bean Validation（JSR 380）自定义约束验证器，例如`org.apache.syncope.core.persistence.jpa.validation.entity.AnyObjectValidator`。
2. 在构建自定义的约束违规错误消息时，支持多种插值方式，包括Java EL表达式。
3. 如果攻击者能够在传递给`ConstraintValidatorContext.buildConstraintViolationWithTemplate()`的错误消息模板中注入任意数据，就可以执行任意Java代码。
4. 一些验证的bean属性（通常被认为不可信）流入自定义错误消息，从而引发漏洞。

### 受影响的验证器

- 总共有25个验证器使用`ConstraintValidatorContext.buildConstraintViolationWithTemplate()`，其中20个存在漏洞，因为它们在错误消息中反映了被验证的值。

## 风险

此漏洞可能导致远程代码执行。

## 修复措施

该问题已在后续的提交中被解决。

## 联系信息

如果你对此问题有疑问，可以通过以下方式联系GHSL团队：
- 邮箱: securitylab@github.com
- 请在相关沟通中提及GHSL-2020-029。