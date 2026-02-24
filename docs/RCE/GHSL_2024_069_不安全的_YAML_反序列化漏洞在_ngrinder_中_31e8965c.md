# GHSL-2024-069: 不安全的 YAML 反序列化漏洞在 ngrinder 中

## 概述
在对 GHSL-2023-239/CVE-2024-28212 的重新测试中发现，ngrinder 的 `/script/api/github/validate` 接口仍然存在不安全的 YAML 反序列化漏洞。虽然这个漏洞可能不会造成重大影响，但仍值得注意。

## 技术背景
- **软件版本**: ngrinder v3.5.9
- **漏洞描述**: 
  - 该接口允许用户控制的 YAML 数据被直接传递到受影响的 `YamlReader#read` 方法。
  - 用户通过未经身份验证的 `validateGithubConfig` 接口提交 YAML 数据。

## 漏洞机制
1. 用户的数据流入 `GitHubFileEntryService` 类的 `validate` 方法。
2. `validate` 方法进一步调用 `getAllGithubConfig`，最终到达 `YamlReader#read`。

## 风险
- **代码执行**: 攻击者可以利用该漏洞执行恶意代码。因为 YamlBeans 允许根据用户控制的类名实例化类并使用公共字段或 setter 来填充对象。
- 理论上，如果攻击者知道某个“gadget chain”，可能会找到合适的类在 ngrinder 的运行环境中引发远程代码执行。
  
### 示例
如果 ngrinder 使用了 c3p0 库，攻击者可能会使用 `WrapperConnectionPoolDataSource` 类来执行代码。例如，可以构造一个请求使 YamlBeans 实例化该类并调用其 setter 方法。
