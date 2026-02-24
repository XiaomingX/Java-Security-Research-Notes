# ysoserial-plus

**核心职责**: Java 反序列化漏洞利用工具，用于生成针对常见 Java 库的恶意序列化 Payload。

## 项目概述

ysoserial-plus 是一个用于生成 Java 反序列化漏洞利用 Payload 的工具集合。该工具通过构造特定的对象链（Gadget Chain），在目标应用反序列化恶意数据时触发任意代码执行。

## 免责声明

⚠️ **本工具仅用于学术研究和防御技术开发，不得用于未经授权的系统攻击。项目维护者不对工具的滥用负责。请负责任地使用。**

## 支持的 Gadget Chains

该工具支持多种常见 Java 库的反序列化利用链，包括但不限于：

- **Commons Collections** (3.1, 4.0)
- **Spring Framework** (Core, Beans, AOP)
- **Hibernate** (4.x, 5.x)
- **Apache Wicket**
- **Groovy**
- **BeanShell**
- **C3P0**
- **ROME**
- **Vaadin**
- **AspectJ**
- **Clojure**
- **Jython**
- **MyFaces**

## 快速开始

### 构建项目

```bash
# 编译并打包
mvn clean package -DskipTests

# 生成的 JAR 文件位于 target/ 目录
# ysoserial-0.0.6-SNAPSHOT-all.jar
```

### 基本使用

```bash
# 查看所有可用的 Payload
java -jar ysoserial-0.0.6-SNAPSHOT-all.jar

# 生成 CommonsCollections1 Payload
java -jar ysoserial-0.0.6-SNAPSHOT-all.jar CommonsCollections1 "calc.exe"

# 将 Payload 输出到文件
java -jar ysoserial-0.0.6-SNAPSHOT-all.jar CommonsCollections1 "calc.exe" > payload.ser
```

## 技术架构

### 核心组件

- **GeneratePayload**: 主入口类，负责 Payload 生成
- **ObjectPayload**: Payload 接口，所有 Gadget Chain 实现此接口
- **Serializer/Deserializer**: 序列化和反序列化工具类
- **Exploit 模块**: 包含 JRMPListener、JRMPClient、JBoss 等利用工具

### 依赖管理

- **Java 版本**: 1.8
- **构建工具**: Maven 3.x
- **主要依赖**: 
  - Commons Collections (3.1, 4.0)
  - Spring Framework (4.1.4)
  - Hibernate (4.3.11)
  - Javassist (3.19.0)

## 使用场景

1. **安全研究**: 研究 Java 反序列化漏洞原理
2. **渗透测试**: 在授权范围内测试应用安全性
3. **防御开发**: 开发和测试反序列化漏洞防御机制
4. **漏洞验证**: 验证已知 CVE 漏洞的影响范围

## 已知问题

- [ ] 依赖版本较旧（Spring 4.1.4, Hibernate 4.3.11）
- [ ] 部分 Gadget Chain 可能在新版本 JDK 中失效
- [ ] 缺少对 JDK 9+ 模块化系统的适配

## 相关资源

- [原始项目](https://github.com/frohoff/ysoserial)
- [Java 反序列化漏洞原理](https://github.com/GrrrDog/Java-Deserialization-Cheat-Sheet)
- [OWASP 反序列化备忘录](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)

## 许可证

本项目遵循原始 ysoserial 项目的许可证条款。详见 LICENSE 文件。
