# GHSL-2024-001_GHSL-2024-003: RubyGems.org 远程拒绝服务（DoS）和潜在的身份验证绕过 - CVE-2024-35221

## 概述

在RubyGems.org发现了远程拒绝服务（DoS）漏洞，以及潜在的身份验证绕过。这些问题影响了Ruby社区的gem托管服务。

**注意**：经过确认，潜在的身份验证绕过（GHSL-2024-002和GHSL-2024-003）在RubyGems.org的生产环境中无法被利用。但为了防止未来的攻击，已经采取了强化措施。

## 漏洞详情

### 1. 远程拒绝服务（DoS）

- **原因**：Gem 发布者在发布 gem 时可能导致远程 DoS。Ruby 通过 `Gem::Specification.from_yaml` 读取 gem 文件的清单，`from_yaml` 使用 `SafeYAML.load` 处理 YAML 文件。YAML 文件中的别名可能导致所谓的“YAML-bombs”攻击，类似于“亿笑”攻击。
  
- **影响**：如果攻击者使用包含YAML-bombs 的多个 gem，可能导致整个 RubyGems.org 无法响应。

- **例子**：成功的攻击需要发送多个请求，系统会被阻断。如果所有工作进程都忙，RubyGems Rails 应用将无法响应。

### 2. 身份验证绕过

- **问题描述**：RubyGems 的可信发布者控制器在某些稀有情况下会接受使用“none”算法的JWT，这可能允许攻击者用伪造的令牌替换有效的API密钥。

- **流程**：
  1. JWT被提供后被解码，但不进行验证。
  2. 从数据库查询JWT的发行者。
  3. 然后用JWKS（JSON Web Key Set）验证签名。

- **漏洞**：在某些情况下，如果JWKS为空，则可能允许伪造的JWT通过，从而攻击者可能发布新版本的gem，尤其是在数据库未返回JWKS的情况下。

### 3. API密钥角色控制器

- **问题描述**： API密钥角色控制器也接受“none”算法的JWT。

- **影响**：攻击者可以使用伪造的令牌交换有效API密钥，与RubyGems.org API通信，并可能发布或删除gem，或添加/删除拥有者，前提是相应的API密钥角色已经设置并且JWKS返回为null。

- **流程**：JWT在`decode_jwt`方法中进行验证，存在类似的JWKS为空的漏洞。
