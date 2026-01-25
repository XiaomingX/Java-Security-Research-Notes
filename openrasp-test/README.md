# Java Open RASP (Runtime Application Self-Protection)

这是一个 Java RASP 的演示项目，用于验证 RASP 的原理和实现。

### 支持的防护

#### 远程代码执行 (RCE)

1. 反序列化漏洞
2. 危险的 OGNL 表达式
3. ProcessBuilder 日志记录

#### SQL 注入

1. MySQL
2. SQL Server

### 如何使用

在运行 Java 应用程序时，添加以下 JVM 参数：

```sh
-javaagent:/path/javaopenrasp.jar
```

将 `/path/javaopenrasp.jar` 替换为你实际的 `javaopenrasp.jar` 文件的路径。

#### Spring Boot 项目示例

如果你使用 Maven 运行 Spring Boot 项目，可以使用以下命令包含 JVM 参数：

```sh
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-javaagent:/path/javaopenrasp.jar"
```

### 使用 Maven 打包成 JAR 包的教程

要使用 Maven 将项目打包成 JAR 文件，请运行以下命令：

```sh
mvn clean package
```

打包完成后，生成的 JAR 文件将位于 `target` 目录中。

### Maven 构建命令中的参数注入教程

1. **清理项目**
   
   要清理项目（删除先前的构建结果）：
   
   ```sh
   mvn clean
   ```

2. **编译项目**
   
   要编译项目：
   
   ```sh
   mvn compile
   ```

3. **运行单元测试**
   
   要运行项目中的单元测试：
   
   ```sh
   mvn test
   ```

4. **打包项目**
   
   要将项目打包成 JAR 文件：
   
   ```sh
   mvn package
   ```

5. **跳过测试进行打包**
   
   如果希望在打包时跳过测试：
   
   ```sh
   mvn package -DskipTests
   ```

6. **安装到本地仓库**
   
   要将打包好的 JAR 文件安装到本地 Maven 仓库：
   
   ```sh
   mvn install
   ```

这些命令可以根据项目的需要进行组合和使用，帮助你更好地管理和构建项目。

