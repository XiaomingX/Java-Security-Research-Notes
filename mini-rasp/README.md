# Mini-RASP (Java Runtime Application Self-Protection)

这是一个轻量级的 Java RASP 实现，旨在演示如何通过 Java Instrumentation 和 ASM 字节码技术对应用程序进行运行时自我保护。

## 核心架构

本项目采用了一种高性能、低侵入式的 RASP 架构：

1.  **Java Agent**: 作为 `premain` 代理加载，介入 JVM 类加载过程。
2.  **Instrumentation & ASM**: 使用 `ClassFileTransformer` 拦截敏感类，并通过 ASM 框架在目标方法（如 `ProcessBuilder.start()`）中插入 Hook。
3.  **Global Hook Handler (`HookHandler`)**: 所有插入的 Hook 都会调用 `HookHandler` 中的静态方法。这种设计避免了在热点代码路径中频繁实例化对象，极大降低了 GC 压力。
4.  **Security Filters**: 具体的安全策略（白名单、黑名单、日志记录）在此实现。

## 支持的防护能力

### 🛡️ 远程代码执行 (RCE)
- **命令注入**: 拦截 `java.lang.ProcessBuilder`，支持黑白名单过滤与堆栈采集。
- **反序列化攻击**: 拦截 `ObjectInputStream`，在实例化前进行类名校验。
- **OGNL 表达式**: 拦截 `ognl.Ognl` 表达式求值，防止恶意 OGNL 注入。

### 📊 其他能力
- **堆栈分析**: 在触发敏感操作时自动采集并记录当前调用栈。
- **多模式运行**: 支持 `block`（拦截）、`log`（仅记录）、`white`/`black`（黑白名单）等多种运行模式。

## 快速开始

### 1. 编译打包
使用 Maven 构建 Agent JAR 包：
```bash
mvn clean package -DskipTests
```
构建完成后，在 `target/` 目录下会生成 `mini-rasp-1.0-SNAPSHOT.jar`。

### 2. 挂载 Agent
在启动目标 Java 应用时，通过 `-javaagent` 参数挂载：
```bash
java -javaagent:/path/to/mini-rasp.jar -jar your-app.jar
```

### 3. 配置说明
配置文件位于 `src/main/resources/main.config` (打包后位于 JAR 根目录)，可在此配置各模块的运行模式及黑白名单。

## 技术优势
- **高性能**: 采用静态 Hook 分发模式，减少运行时对象分配。
- **高兼容性**: 使用 ASM9 支持最新版本的 Java 字节码。
- **Fail-Safe**: 设计上支持 "失效放行"，确保 RASP 自身的异常不会导致目标业务应用崩溃。
