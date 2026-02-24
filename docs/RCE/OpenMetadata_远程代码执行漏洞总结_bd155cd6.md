# OpenMetadata 远程代码执行漏洞总结

OpenMetadata 存在多个安全漏洞，主要涉及 SpEL 表达式注入和身份验证绕过，这些漏洞可能导致远程代码执行（RCE）。

## 漏洞概述

### 1. SpEL 表达式注入

- **影响版本**: OpenMetadata 1.2.2
- **漏洞路径**: 
  - `AlertUtil::validateExpression`
  - `CompiledRule::validateExpression`
- **漏洞细节**: 
  1. 这两个方法通过 `StandardEvaluationContext` 评估用户控制的 SpEL 表达式，允许访问 Java 类（如 `java.lang.Runtime`），从而执行任意系统命令。
  2. 受影响的 API 端点 `/api/v1/events/subscriptions/validation/condition/<expression>` 和 `/api/v1/policies/validation/condition/<expression>`。

### 2. 身份验证绕过

- **概述**: 
  - 使用 JWT 进行 API 身份验证，某些端点可以不进行身份验证（列在 `EXCLUDED_ENDPOINTS` 中）。
  - 攻击者可以构造请求，以绕过身份验证，触发上述的漏洞。

## 漏洞链分析

### 漏洞链1：事件订阅

- **请求路径**: `PUT /api/v1/events/subscriptions`
- **调用链**:
  - `EventSubscriptionResource.createOrUpdateEventSubscription` 
  - → `EntityResource.createOrUpdate`
  - → `EntityRepository.prepareInternal`
  - → `AlertUtil::validateExpression`
  
- **缺失的授权**: `Authorizer.authorize()` 在执行 SpEL 表达式后调用，未能阻止未经授权的访问。

### 漏洞链2：策略规则

- **请求路径**: `PUT /api/v1/policies`
- **调用链**:
  - `PolicyResource.createOrUpdate`
  - → `EntityRepository.prepareInternal`
  - → `CompiledRule::validateExpression`

- **缺失的授权**: 类似于事件订阅，授权检查后执行了 SpEL 表达式评估。

## 建议

- **使用 SimpleEvaluationContext**: 为了防止 RCE，建议不使用 `StandardEvaluationContext`，即使是管理员也不应执行任意系统命令。
- **加强身份验证**: 所有端点均应有效执行 JWT 验证，避免潜在的身份验证绕过。
