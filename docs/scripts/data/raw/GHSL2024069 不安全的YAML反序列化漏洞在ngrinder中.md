# GHSL-2024-069: 不安全的YAML反序列化漏洞在ngrinder中

## 概述
在对 ngrinder 进行的复测中，发现其 `/script/api/github/validate` 接口存在不安全的 YAML 反序列化漏洞。尽管该漏洞被确认，但似乎不会产生严重的影响。

## 技术背景
- **受影响版本**: ngrinder v3.5.9
- **漏洞类型**: 不安全的 YAML 反序列化
- **漏洞原因**: 用户控制的 YAML 数据可以流入一个默认易受攻击的 `YamlReader#read` 方法。

### 漏洞流程
1. 用户通过未认证的 `validateGithubConfig` 接口提供 YAML 数据。
2. 这些数据被传递到 `GitHubFileEntryService` 类中的 `validate` 方法。
3. `validate` 方法最终调用 `getAllGithubConfig`，并进入 `YamlReader#read`。

### 漏洞风险
- 使用 `YamlBeans` 允许用户控制的类名被实例化。
- 攻击者可利用这个漏洞执行任意代码，前提是他们知道特定的类（称为“gadget”）。
  
例如，如果 ngrinder 使用了 `c3p0` 库，攻击者可以利用 `WrapperConnectionPoolDataSource` 类，发送特定请求，触发代码执行。

### 潜在影响
该漏洞理论上可能导致远程代码执行，特别是当攻击者能在 ngrinder 的类路径中找到合适的 gadget 类时。

## 发现与联系
此问题由 GHSL 团队成员 @p-（Peter Stöckli）发现并报告。  
若需联系 GHSL 团队，请发送邮件至 securitylab@github.com，并在相关通信中提及 GHSL-2024-069。