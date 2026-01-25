# Pure JRE 8 RCE Deserialization gadget (JRE 8u20)

## 漏洞解析
此项目演示了在 **JRE 8u20** 环境下，即使没有任何第三方依赖（如 CommonsCollections），也能实现远程代码执行（RCE）的反序列化利用链。

### 核心原理
1. **Gadget Chain**: 利用 `LinkedHashSet` 触发 `TemplatesImpl.getOutputProperties()`。
2. **绕过限制**: 为了绕过某些版本对 `AnnotationInvocationHandler` 的限制，使用了 `BeanContextSupport` 的特殊反序列化过程。
3. **关键类**:
   - `java.util.LinkedHashSet`
   - `com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl`
   - `java.beans.beancontext.BeanContextSupport`
   - `sun.reflect.annotation.AnnotationInvocationHandler`

### 参考
- https://gist.github.com/frohoff/24af7913611f8406eaf3
- http://wouter.coekaerts.be/2015/annotationinvocationhandler

## 如何运行
1. 确保环境为 Java 8u20。
2. 使用 Maven 编译：`mvn clean compile`
3. 运行生成 Payload：`java -cp target/classes ExploitGenerator`
