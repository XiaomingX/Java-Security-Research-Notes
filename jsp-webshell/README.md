# JSP WebShell 研究

## 项目简述
本项目收集并研究了多种不同技术实现、具备免杀特性的 JSP WebShell。涵盖了从简单的指令执行到复杂的字节码加载技术。

## 核心技术
1. **BCEL 字节码加载**: 利用 `com.sun.org.apache.bcel.internal.util.ClassLoader` 直接加载 $$BCEL$$ 编码的字节码，在内存中动态实例化恶意类。
2. **ScriptEngine 绕过**: 利用 Java 的脚本引擎机制（如 JavaScript, Groovy）执行任意代码，逃避静态查杀。
3. **SPI (Service Provider Interface)**: 利用 `ScriptEngineFactory` 等接口结合 SPI 机制（如 `META-INF/services`）实现隐蔽的加载和执行。
4. **JNDI/LDAP 联动**: 演示了如何通过内存 LDAP 服务下发恶意载荷到受害者机器。
5. **动态编译**: 利用 `javax.tools.JavaCompiler` 在服务器端实时编译并加载恶意代码。

## 目录结构
- `jsp/1`: BCEL 字节码示例。
- `jsp/10`: ScriptEngineFactory SPI 示例。
- `jsp/13`: JNDI/LDAP 联动示例。
- `jsp/15`: 动态编译示例。

## 如何验证
1. 编译辅助工具: `mvn clean compile`
2. 将特定的 `.jsp` 文件部署到测试服务器（如 Tomcat）。
3. 使用辅助工具（如 `BcelEvil`, `EvilMake`）生成特定负载。
4. 访问 JSP 并带上相应参数进行验证。
