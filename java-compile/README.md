# Java 动态编译技术研究

## 项目简述
本项目研究了 Java 中的多种动态编译技术，包括 JavaCompiler API、Javassist 等，这些技术常被用于内存马注入和动态代码执行。

## 核心技术

### 1. JavaCompiler API
Java 6 引入的标准 API，允许在运行时编译 Java 源代码。

**特点:**
- 标准 JDK 自带，无需额外依赖
- 可以编译字符串形式的 Java 代码
- 支持自定义类加载器

**使用场景:**
- 动态生成和加载类
- 内存马注入
- 代码热更新

### 2. Javassist
强大的字节码操作库，可以在运行时修改和生成 Java 类。

**特点:**
- 提供高级 API，无需直接操作字节码
- 支持运行时修改已加载的类
- 性能优于反射

**使用场景:**
- AOP (面向切面编程)
- 动态代理
- 内存马注入

## 目录结构
```
java-compile/
├── src/main/java/com/security/bug/compile/
│   ├── javac/          # JavaCompiler 相关示例
│   └── javassist/      # Javassist 相关示例
```

## 使用示例

### JavaCompiler 动态编译
```java
String code = "public class Hello { public void sayHello() { System.out.println(\"Hello\"); } }";
JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
// ... 编译和加载
```

### Javassist 动态生成类
```java
ClassPool pool = ClassPool.getDefault();
CtClass cc = pool.makeClass("com.example.DynamicClass");
CtMethod m = CtNewMethod.make("public void hello() { System.out.println(\"Hello\"); }", cc);
cc.addMethod(m);
Class clazz = cc.toClass();
```

## 安全风险
动态编译技术在安全攻防中的应用：
1. **内存马注入**: 动态生成恶意类并注入到目标进程
2. **绕过静态检测**: 代码在运行时生成，静态扫描无法发现
3. **无文件攻击**: 恶意代码仅存在于内存中

## 防御建议
1. **限制动态编译**: 在生产环境禁用或限制动态编译功能
2. **监控异常类加载**: 监控运行时的类加载行为
3. **使用 Security Manager**: 限制动态代码执行权限

## 编译运行
```bash
cd java-compile
mvn clean compile
mvn exec:java -Dexec.mainClass="com.security.bug.compile.javac.RuntimeMakeClass"
```

## 参考资料
- [JavaCompiler API](https://docs.oracle.com/javase/8/docs/api/javax/tools/JavaCompiler.html)
- [Javassist Documentation](https://www.javassist.org/)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
