# 安全特性研究 (Feature)

## 项目简述
本项目研究了各种序列化库和框架的安全特性，包括它们的漏洞利用方式和防御机制。

## 研究内容

### 1. Java 原生序列化
- **文件**: `JavaSerialization.java`
- **特点**: Java 内置序列化机制
- **风险**: 反序列化漏洞，gadget 链攻击
- **常见 Gadget**: Commons Collections, Spring, etc.

### 2. Fastjson 序列化
- **文件**: `FastjsonSerialization.java`
- **特点**: 高性能 JSON 库
- **风险**: AutoType 绕过，任意代码执行
- **防御**: 关闭 AutoType，使用白名单

### 3. Jackson 序列化
- **文件**: `JacksonSerialization.java`
- **特点**: 流行的 JSON 处理库
- **风险**: Default Typing 漏洞
- **防御**: 禁用 Default Typing

### 4. Hessian 序列化
- **文件**: `HessianSerialization.java`
- **特点**: 二进制序列化协议
- **风险**: 反序列化 RCE
- **应用**: Dubbo 等 RPC 框架

### 5. Kryo 序列化
- **文件**: `KryoSerialization.java`
- **特点**: 高性能序列化框架
- **风险**: 不安全的默认配置
- **防御**: 使用类注册机制

### 6. SnakeYAML
- **文件**: `SnakeYAML.java`
- **特点**: YAML 解析库
- **风险**: YAML 反序列化漏洞
- **应用**: Spring Boot 配置注入

### 7. XStream
- **文件**: `XStream.java`
- **特点**: XML 序列化库
- **风险**: 远程代码执行
- **应用**: Eureka Client 等

### 8. CAS 4.1 & 4.2
- **文件**: `CAS4$1And4$2.java`
- **特点**: CAS 认证系统
- **风险**: Padding Oracle, 反序列化

### 9. Jolokia 特性
- **文件**: `JolokiaAttackUrlFeature.java`
- **特点**: JMX HTTP 桥接
- **风险**: 通过 Jolokia 触发 Logback RCE

## 使用方法

### 编译项目
```bash
cd feature
mvn clean compile
```

### 运行示例
```bash
# 测试 Fastjson 序列化
mvn exec:java -Dexec.mainClass="com.security.bug.feature.FastjsonSerialization"

# 测试 Hessian 序列化
mvn exec:java -Dexec.mainClass="com.security.bug.feature.HessianSerialization"
```

## 安全对比

| 序列化库 | 性能 | 安全性 | 推荐使用 |
|---------|------|--------|---------|
| Java 原生 | 中 | 低 | ❌ |
| Fastjson | 高 | 低 | ⚠️ |
| Jackson | 高 | 中 | ✅ |
| Hessian | 高 | 低 | ⚠️ |
| Kryo | 很高 | 中 | ✅ |
| SnakeYAML | 中 | 低 | ⚠️ |
| XStream | 中 | 低 | ❌ |

## 防御建议
1. **避免使用不安全的序列化库**
2. **禁用危险特性**: 如 AutoType, Default Typing
3. **使用白名单**: 限制可反序列化的类
4. **输入验证**: 验证反序列化数据来源
5. **及时更新**: 使用最新版本的库

## 参考资料
- [Java Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
- [Fastjson Security](https://github.com/alibaba/fastjson/wiki/security_update)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
