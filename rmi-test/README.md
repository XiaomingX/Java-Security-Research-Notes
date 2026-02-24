# Java RMI 安全研究

## 项目简述
本项目研究了 Java 远程方法调用 (RMI) 中的多种安全风险，包括注册中心 (Registry)、服务端 (Server) 和客户端 (Client) 三者之间的相互攻击。

## 核心原理
1. **反序列化风险**: RMI 协议在传输对象时深度依赖 Java 原生序列化。如果通信的任何一方能控制反序列化的输入，且 classpath 中存在恶意 gadget，则可能触发 RCE。
2. **Registry 攻击**: 注册中心在处理 `bind`、`rebind`、`lookup` 等请求时会对传输的对象进行反序列化。攻击者可以向注册中心发送一个恶意的 `Remote` 对象载荷。
3. **双向攻击**:
   - **服务端打客户端**: 服务端的远程方法返回值会被客户端反序列化。
   - **客户端打服务端**: 客户端的远程方法参数会被服务端反序列化。
   - **DGC (Distributed Garbage Collection)**: 客户端与服务端之间的 DGC 通信同样涉及序列化操作，可被利用。

## 目录结构
- `com.security.bug.rmi.registry`: 攻击 RMI 注册中心的示例。
- `com.security.bug.rmi.server`: RMI 服务端及其潜在风险说明。
- `com.security.bug.rmi.client`: RMI 客户端及其攻击演示。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 启动一个 RMI 注册中心（默认端口 1099）。
3. 运行相应的攻击或业务代码进行研究。
