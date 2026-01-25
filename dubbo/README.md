# Apache Dubbo Hessian2 反序列化漏洞研究

## 项目简述
本项目研究了 Apache Dubbo 在默认配置（使用 Hessian2 序列化）下存在的反序列化漏洞。包含了多种经典的 gadget 利用链。

## 核心原理
1. **Hessian2 序列化**: Dubbo 默认使用 Hessian2 进行协议传输。Hessian2 在处理复杂对象时，如果 classpath 中存在特定的易受攻击类，可能触发漏洞。
2. **ToString 触发**: 许多利用链通过构造特定的 Map（如 `Hashtable` 或 `HashMap`）结构，在反序列化或后续处理中触发对象的 `toString()`、`equals()` 或 `hashCode()` 方法，从而开启利用链。
3. **利用链示例**:
   - **Resin**: 利用 `com.caucho.naming.QName` 实现 RCE。
   - **Rome**: 利用 `com.rometools.rome.feed.impl.EqualsBean` 实现 RCE。
   - **XBean**: 利用 `org.apache.xbean.naming.context.ContextUtil.ReadOnlyBinding` 实现 JNDI 注入。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 启动一个受漏洞影响的 Dubbo 服务提供者。
3. 运行相应的 POC:
   - Resin 链: `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.dubbo.ResinPoc`
   - Rome 链: `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.dubbo.RomePoc`
   - XBean 链: `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.dubbo.XBeanPoc`
