# OpenMetadata 漏洞概述

## 漏洞简介
OpenMetadata 存在多个 **SpEL 表达式注入** 和 **认证绕过** 漏洞，这些漏洞可以导致 **未认证的远程代码执行**（RCE）。

## 受影响的版本
- OpenMetadata 1.2.2

## 漏洞类型

### 1. SpEL 表达式注入
- **漏洞路径**: `AlertUtil::validateExpression`
- **风险**: 使用用户控制的数据，攻击者能够执行任意系统命令。
- **利用方法**:
  - 通过 `/api/v1/events/subscriptions/validation/condition/<expression>` 端点提交恶意 SpEL 表达式。
  - 对于已认证的非管理员用户，没有授权检查。

### 2. 认证绕过
- **漏洞路径**: JWT 认证
- **风险**: 通过绕过 JWT 验证，攻击者可以访问未受限制的 API 端点。
- **利用方法**:
  - 请求端点是否在 `EXCLUDED_ENDPOINTS` 列表中。如果在该列表中，将跳过 JWT 验证。
  - 攻击者可以利用路径参数构造不需要认证的请求。

## 代码片段分析
- **EventSubscriptionResource.java** 和 **AlertUtil.java**
- **PolicyResource.java** 和 **CompiledRule.java**
  
在这些类中都存在对 `evaluate` 方法的调用，允许通过 SpEL 注入执行代码。

### 授权缺失
- `Authorizer.authorize()` 方法没有在关键路径中被调用，意味着即使是已认证的用户，依然能执行未经过授权的操作。

## 建议
- 强烈建议开发者使用 **SimpleEvaluationContext**，以降低风险。
- 及时修复以上提到的漏洞，以确保系统安全。

## 联系方式
如需了解更多信息或报告其他问题，请联系 GHSL 团队 (securitylab@github.com)，并提及 GHSL-2023-235、GHSL-2023-236、GHSL-2023-237、GHSL-2023-251 或 GHSL-2023-252。