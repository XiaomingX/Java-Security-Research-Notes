# Fastjson 反序列化漏洞研究

## 项目简述
本项目研究了 Fastjson 在多个版本中存在的反序列化漏洞，特别是针对 **AutoType** 机制的绕过技术。

## 核心原理
1. **AutoType 机制**: Fastjson 使用 `@type` 标签来指定反序列化的类。为了安全，Fastjson 引入了黑白名单机制。
2. **绕过技术**:
   - **期望类 (ExpectClass)**: 在某些版本（如 1.2.68）中，如果指定一个类作为另一个类的期望子类（如 `AutoCloseable`），Fastjson 可能会绕过常规的 `autoType` 检查。
   - **Throwable / Exception**: 由于异常类需要被反序列化以传递错误信息，Fastjson 默认允许反序列化 `Throwable` 的子类。
3. **利用后果**:
   - **远程代码执行 (RCE)**: 通过加载恶意的补丁类（如 `TemplatesImpl` 或 JNDI 引用）。
   - **任意文件读写**: 利用特定的类（如 `FileOutputStream`）实现。
   - **敏感信息泄漏**: 利用异常类的属性（如 `WebDriverException` 中的系统信息）。

## 关键 POC 说明
- `com.security.bug.fastjson.file.FileWriteBypassAutoType1_2_68`: 演示在 1.2.68 版本中绕过限制实现任意文件写入。
- `com.security.bug.fastjson.leak.seleniumBypassAutotype1_2_68`: 演示利用恶意异常类泄漏敏感系统信息。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 运行特定的 POC 类。例如:
   `java -cp target/classes:../common/target/common-1.0-SNAPSHOT.jar com.security.bug.fastjson.file.FileWriteBypassAutoType1_2_68`
