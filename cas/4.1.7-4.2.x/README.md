# CAS 4.1.7 ~ 4.2.x 反序列化漏洞 (C3P0 利用链)

## 漏洞点
虽然从 4.1.7 开始密钥不再硬编码，但如果配置不当或泄露了密钥，仍然可以通过反序列化漏洞进行攻击。本项目演示了如何结合 **C3P0** 库的 gadget 实现攻击。

## 核心原理
1. **C3P0 Gadget**: 利用 `PoolBackedDataSource` 和恶意引用（Reference）触发远程类加载或 JNDI 注入。
2. **利用流程**: 构造包含 C3P0 恶意对象的加密 Webflow 状态，发送给服务器触发反序列化。

## 如何验证
1. 编译本项目 POC: `mvn clean compile`
2. 运行 POC: `java -cp target/classes:../../common/target/common-1.0-SNAPSHOT.jar com.security.bug.cas.AttackDemo`
