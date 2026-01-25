# CAS 4 Padding Oracle CBC 漏洞

## 漏洞点
该项目演示了 CAS 4 版本在加密过程中如果使用了不安全的 CBC 模式且未正确校验 Padding，可能遭受 **Padding Oracle** 攻击。

## 核心原理
1. **侧信道攻击**: 攻击者通过观察服务器对不同 Padding 的解密响应（如 200 OK vs 500 Error），可以逐字节推断出明文内容，或构造任意密文。
2. **绕过加密**: 在不知道密钥的情况下，通过大量请求（通常是数千次）实现对数据的重放或篡改。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 运行攻击程序: `java -cp target/classes:../../common/target/common-1.0-SNAPSHOT.jar com.security.bug.cas.CasPaddingOracleCBC --attack http://localhost:8080/cas/login`
