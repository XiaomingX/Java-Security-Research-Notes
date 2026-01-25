# Apache Tomcat 安全研究

## 项目简述
本项目研究了 Apache Tomcat 中的安全漏洞，特别是 Session 集群同步机制中的反序列化漏洞。

## 核心原理
1. **Session 集群同步**: Tomcat 的 Cluster 功能允许多个 Tomcat 实例共享 Session 数据，通过 TCP 端口进行数据同步。
2. **反序列化风险**: 集群节点之间通过 Java 序列化传输 Session 数据。如果攻击者能访问集群接收端口（默认 4000-5000），可以发送恶意序列化对象触发 RCE。
3. **AJP 协议**: 研究了 Tomcat AJP 协议中的文件读取漏洞（CVE-2020-1938，Ghostcat）。

## 目录结构
- `sync-session-bug`: Session 集群同步反序列化漏洞研究
- `ajp-bug`: AJP 协议文件读取漏洞研究

## 如何验证
1. 编译项目: `mvn clean compile`
2. 配置 Tomcat 启用 Cluster 功能
3. 运行 `TomcatSessionClusterExploit` 发送恶意载荷
