# GHSL-2020-028: Netflix Titus中的服务器端模板注入漏洞

## 概述
在Netflix Titus中发现了一种**服务器端模板注入**漏洞。这一漏洞允许攻击者注入任意的Java EL（表达式语言）表达式，从而导致**远程代码执行（RCE）**漏洞。

- **CVE编号**: CVE-2020-9297
- **受影响版本**: Netflix Titus v0.1.1-rc.263

## 技术细节
- **漏洞类型**: 服务器端模板注入
- **攻击方式**: 攻击者可以通过自定义约束验证器注入错误信息模板中的任意Java EL表达式，进而在服务器上执行任意代码（使用Titus服务账户的权限）。

### 背景知识
- Netflix Titus使用Java Bean Validation（JSR 380）和自定义约束验证器。
- 在构建自定义约束违例错误信息时，验证器会支持不同类型的插值，包括Java EL表达式。
- 如果攻击者能够注入任意数据到 `ConstraintValidatorContext.buildConstraintViolationWithTemplate()` 函数的参数中，就可以执行任意Java代码。
- 经过分析，我们发现多个路径可以进入 `ConstraintValidatorContext.buildConstraintViolationWithTemplate()`。

## 风险与解决方案
这个问题可能导致远程代码执行。为了解决此问题，可以采取不同的方法。
