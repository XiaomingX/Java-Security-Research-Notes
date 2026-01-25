# Apache Commons Collections 反序列化漏洞研究

## 项目简述
本项目包含了对 **Apache Commons Collections (ACC)** 库中经典反序列化漏洞的多种利用方式的研究。主要针对 ACC 3.1 版本。

## 核心原理
1. **Transformer 链**: 利用 `ChainedTransformer` 组合 `ConstantTransformer` 和 `InvokerTransformer` 来构造反射调用链，最终执行 `Runtime.getRuntime().exec()`。
2. **触发点**:
   - **TransformedMap**: 在 Map 的 entry 发生改变时（如 `readObject` 过程中）触发转换。
   - **LazyMap**: 在获取不存在的 key 时触发 factory 的 `transform` 方法。
3. **入口点**: 使用 `sun.reflect.annotation.AnnotationInvocationHandler` 作为反序列化的入口类，它的 `readObject` 方法会遍历 Map 并触发上述链。

## 目录结构
- `com.security.bug.collections.v3.no1`: 基础的 `TransformedMap` 利用。
- `com.security.bug.collections.v3.no2`: 结合 `defineClass` 实现回显的进阶利用。

## 如何验证
1. 使用 Maven 编译: `mvn clean compile`
2. 运行 POC:
   - `no1`: `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.collections.v3.no1.SerializeMapForTransformer`
   - `no2`: `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.collections.v3.no2.SerializeMapForTransformer`
