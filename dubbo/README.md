# Apache Dubbo Security Research

本目录专注于 Apache Dubbo 框架的安全研究，特别是其底层通信协议（如 Hessian2）中的反序列化漏洞。

## 🔬 核心漏洞领域

### 1. Hessian2 反序列化 (RCE)
Apache Dubbo 在默认配置下广泛使用 Hessian2 进行对象序列化。如果 Classpath 中包含已知的利用链（Gadget Chains），攻击者可以通过构造请求触发远程代码执行。

**已知利用链:**
- **Resin Chain**: 利用 `com.caucho.naming.QName` 实现。
- **Rome Chain**: 利用 `com.rometools.rome.feed.impl.EqualsBean` 实现。
- **XBean Chain**: 通过 JNDI 注入实现。

### 2. 安全加固 (Dubbo-Hessian2-Safe-Reinforcement)
本目录还包含了一个安全加固示例，演示如何通过底层的序列化拦截和白名单校验来缓解反序列化攻击。

## 🚀 验证与复现

### 项目结构
- `src/`: 核心 POC 源码。
- `dubbo-hessian2-safe-reinforcement/`: 安全增强组件。

### 运行步骤
1.  **编译项目**:
    ```bash
    mvn clean compile
    ```
2.  **运行各利用链 POC**:
    ```bash
    # 示例: 运行 Resin POC
    java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.dubbo.ResinPoc
    ```

---
> [!TIP]
> 建议在实际生产环境中使用 Dubbo 的反序列化白名单功能，并保持 Hessian2 库至最新版本。
