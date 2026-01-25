# CAS 4.1.x ~ 4.1.6 反序列化漏洞 (硬编码 AES 密钥)

## 漏洞点
在 CAS 4.1.x 到 4.1.6 版本中，默认的 `webflow` 加密机制使用了硬编码的 AES 密钥。这意味着任何人都可以构造一个加密的对象，并将其作为 `execution` 参数发送给服务器，从而触发 Java 反序列化漏洞。

## 核心原理
1. **硬编码密钥**: `EncryptedTranscoder` 类中默认使用的是固定密钥。
2. **Webflow 机制**: CAS 使用 Webflow 来管理登录流程，状态信息（加密后）存储在 `execution` 参数中。
3. **攻击效果**: 如果 classpath 中存在易受攻击的库（如 Commons Collections），攻击者可以实现 RCE。

## 如何验证
1. 编译本项目 POC: `mvn clean compile`
2. 启动受漏洞影响的 CAS 服务器。
3. 运行 POC: `java -cp target/classes:../../common/target/common-1.0-SNAPSHOT.jar com.security.bug.cas.AttackDemo`
   > 注意: 需要根据实际情况修改 POC 中的 target URL 和绑定的恶意对象（gadget）。
