# Jackson 反序列化漏洞研究

## 项目简述
本项目研究了 Jackson 数据绑定库中的多种反序列化漏洞，涵盖了 CVE-2019-12384 等多个经典 RCE 利用链。

## 核心原理
1. **Default Typing**: 当 Jackson 开启 `enableDefaultTyping()` 时，它会在 JSON 中包含类型信息。如果反序列化的类在 classpath 中且是一个易受攻击的 gadget，则可能触发 RCE。
2. **利用链类别**:
   - **数据库驱动链**: 利用 `DriverManagerConnectionSource` (H2) 触发远程 SQL 执行。
   - **JNDI 链**: 利用多种支持 JNDI 的类实现远程对象加载。
   - **JMS 链**: 利用 Aries JMS 等组件触发恶意对象的处理。

## 关键 POC 说明
- `com.security.bug.jackson.rce.H2Rce`:演示 CVE-2019-12384，通过 H2 数据库驱动实现 RCE。
- `com.security.bug.jackson.rce.AriesJMSPoc`: 演示基于 Aries JMS 的利用方式。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 运行特定的 POC 类。例如:
   `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.jackson.rce.H2Rce`
