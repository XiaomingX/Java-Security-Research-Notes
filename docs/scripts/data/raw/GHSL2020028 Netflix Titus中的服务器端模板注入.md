# GHSL-2020-028: Netflix Titus中的服务器端模板注入

在Netflix Titus中发现了一个服务器端模板注入漏洞，攻击者可以通过该漏洞注入任意Java EL（表达式语言）表达式，从而导致未经认证的远程代码执行（RCE）漏洞。

### 漏洞信息
- **CVE编号**: CVE-2020-9297
- **受影响版本**: Netflix Titus v0.1.1-rc.263

### 漏洞概述
该漏洞允许攻击者在服务器上运行任意代码（使用Titus服务账户的权限），通过注入Java表达式语言（EL）表达式实现。

### 技术背景
- **Java Bean Validation**：Netflix Titus使用Java Bean Validation（JSR 380）进行自定义约束验证。它包括像`com.netflix.titus.api.jobmanager.model.job.sanitizer.SchedulingConstraintSetValidator`这样的自定义验证器。
- **错误信息模板**：在构建自定义约束违规错误消息时，支持多种插值方式，包括Java EL表达式。如果攻击者能在传递给`ConstraintValidatorContext.buildConstraintViolationWithTemplate()`的错误消息模板中注入数据，就有可能执行任意Java代码。这是因为被验证的（通常不可信的）bean属性常常流入自定义错误消息中。

### 漏洞影响
找到多个路径可以流入`ConstraintValidatorContext.buildConstraintViolationWithTemplate()`，可能导致远程代码执行。

### 修复建议
存在多种方法可以缓解此问题。

### 报告和联系信息
该报告遵循GHSL协调披露政策。  
此问题由GHSL团队成员@pwntester（Alvaro Muñoz）发现和报告。  
感谢Hibernate Validator团队的Guillaume Smet为修复建议提供的帮助。

如需联系GHSL团队，请发送邮件至securitylab@github.com，并在任何与此问题相关的通信中包含GHSL-YEAR-ID。