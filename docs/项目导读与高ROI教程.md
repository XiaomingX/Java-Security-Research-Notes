# Java Security Research Notes 项目导读与高 ROI 教程

> 适用场景：你刚接手这个仓库，想尽快搞清楚它是干什么的、优先看哪里、常用 API 在哪、以及如何以最低成本跑通几个最有价值的实验。
>
> 说明：本仓库包含大量漏洞研究与 PoC 内容。下面的说明只面向授权实验环境、源码阅读和本地复现，不展开针对外部系统的利用细节。

## 1. 这个项目到底是干啥的

这个仓库本质上不是一个单体应用，也不是一个标准 SDK，而是一个 **Java 安全研究资料库**，由三部分组成：

1. **可运行的研究代码**
   典型目录：`common`、`fastjson`、`jackson`、`dubbo`、`spring`、`shiro`、`cas`、`java-compile`、`xxe`、`tomcat`。

2. **研究文档和漏洞笔记**
   典型目录：`docs`、`poc-for-red-team`、`the-Bug-Hunter-Methodology`、`nexus`。

3. **外部资料或镜像型内容**
   典型目录：`amass`、`payloadallthethings`、`bugbounty`、`fixinventory` 等。
   这些目录更像资料集或外部项目快照，不一定纳入根 `pom.xml` 的统一构建链路。

如果一句话概括：

**它是一个以 Java 漏洞研究为主线、兼带靶场样例、协议实验、漏洞笔记和外部资料的综合型知识仓库。**

## 2. 仓库结构怎么读最省时间

### 2.1 真正建议优先看的目录

如果你的目标是快速建立对仓库的控制感，优先看这 6 个：

1. `common`
   这是基础工具模块。很多子模块依赖这里的 HTTP/LDAP/RMI 辅助服务、反射工具、序列化工具。

2. `fastjson`
   适合理解“JSON 反序列化 + gadget + AutoType 绕过”这一类问题。

3. `jackson`
   适合理解 `ObjectMapper`、Default Typing、JNDI/JDBC/JMS 类链这条主线。

4. `spring`
   适合理解 HTTP 接口型问题，尤其是配置端点、URI 解析、Mongo SpEL 等。

5. `shiro`
   适合理解“框架安全边界不一致”这种 Web 安全问题，启动成本也低。

6. `dubbo`
   适合理解 Hessian2、Dubbo 协议以及一个相对有工程价值的“安全加固 demo”。

### 2.2 不要一上来就做的事

不要一上来就把整个仓库当成一个完整产品去运行。原因有几个：

- 根目录是 Maven 聚合工程，但仓库里还有很多不在聚合里的资料目录。
- 一些 PoC 写死了 `localhost`、`127.0.0.1`、固定端口、甚至作者本机绝对路径。
- 多处示例默认按 JDK 8 编写，JDK 9+ 可能需要 `--add-opens` 或兼容性调整。
- 仓库里有不少 `target/` 产物已经被提交，阅读时应优先看 `src/` 和 README。

### 2.3 根 `pom.xml` 的定位

根 `pom.xml` 是一个聚合器，列出的核心模块包括：

- `common`
- `common-collections`
- `fastjson`
- `jackson`
- `padding-oracle-cbc`
- `security-manager`
- `xxe`
- `dubbo`
- `rmi`
- `tomcat`
- `spring`
- `cas`
- `feature`
- `ShardingSphere-UI`
- `shiro`
- `nexus`
- `apache-poi`
- `java-compile`

高价值理解点：

- 它说明“主线是 Java 安全研究代码”，不是那些资料型目录。
- `common` 是多数可运行 PoC 的基础依赖。
- 实操时更推荐“按模块构建”，不要默认一次性把全仓都编过。

## 3. 常用 API 和入口类

这里的“常用 API”分三类理解最清楚：

1. 仓库内部的复用工具类
2. 研究对象本身的关键 Java API
3. 本地靶场/示例服务暴露出来的 HTTP 接口

### 3.1 仓库内部最常用的工具类

#### `common` 模块

最值得先熟悉的是下面这些类：

| 类/方法 | 作用 | 你什么时候会用到 |
| --- | --- | --- |
| `com.security.bug.common.server.HTTPServer.run(...)` | 起一个极简 HTTP 文件服务，并打印请求 | 需要本地提供 XML/YAML/类文件等实验资源时 |
| `com.security.bug.common.server.LdapServer.run(...)` | 起 LDAP 服务 | 研究 JNDI/LDAP 类加载或引用解析类问题时 |
| `com.security.bug.common.server.RmiServer.run()` | 起 RMI Registry | 研究 RMI/JNDI/RMI Registry 交互时 |
| `com.security.bug.common.utils.HttpUtil.get/post` | 发简单 HTTP 请求 | 本地 PoC 里驱动目标 Web 端点时 |
| `com.security.bug.common.utils.Reflections.*` | 反射读写私有字段、无构造实例化 | 构造 gadget 或 patch 对象内部状态时 |
| `com.security.bug.common.utils.TemplatesUtil.createTemplatesImpl(...)` | 构造 `TemplatesImpl` 风格对象 | 理解大量 Java 反序列化链时很常见 |
| `com.security.bug.common.utils.SerializeUtil` | 序列化/反序列化辅助 | 做序列化实验时 |

对这个仓库来说，`common` 不是“锦上添花”，而是很多 PoC 能不能直接复用的基础设施。

### 3.2 各研究模块里最常见的 Java API

#### Fastjson

你最常见到的是：

- `JSON.parseObject(...)`
- `JSONObject jsonObject = JSON.parseObject(...)`
- `Feature.SupportNonPublicField`

这类代码主要出现在 `fastjson/src/main/java/...`。它们是“输入 JSON -> 触发解析/反序列化行为”的核心入口。

#### Jackson

你最常见到的是：

- `new ObjectMapper()`
- `mapper.enableDefaultTyping(...)`
- `mapper.readValue(json, Object.class)`

这些调用构成了 Jackson 模块的主轴。你只要抓住 `ObjectMapper` 和 `readValue`，阅读速度就会快很多。

#### Dubbo / Hessian2

你最常见到的是：

- `Hessian2Output`
- `Hessian2ObjectOutput`
- 自定义 `Serialization`
- 自定义 `Hessian2Input/ObjectInput`

这里的重点不在 HTTP，而在“Dubbo 如何序列化/反序列化对象”。

#### Spring

你最常见到的是：

- `HttpPost` / `HttpGet` 驱动本地实验接口
- `UriComponentsBuilder.fromUriString(...)`
- `@Query(...)` 和 Spring Data Repository
- `@RestController`、`@RequestMapping`

这里同时包含两类研究：

- 对 Spring 自身端点和行为边界的研究
- 对业务代码常见误用方式的研究

#### Java 动态编译

`java-compile` 目录主要围绕：

- `JavaCompiler`
- `ToolProvider.getSystemJavaCompiler()`
- Javassist 的 `ClassPool`、`CtClass`

它对理解“运行时生成/装载类”的风险和用法很有帮助。

## 4. 这个仓库会和哪些服务端 API / 协议交互

严格说，这个仓库没有一个统一的“服务端 API 清单”，因为它不是单服务应用，而是一组研究样例。更准确的理解方式是：

### 4.1 它最常交互的是这几类协议

1. **HTTP / HTTPS**
   用于驱动 Spring、CAS、Shiro、Nexus 这类 Web 应用，或者本地托管实验资源。

2. **LDAP**
   常由 `LdapServer` 提供本地实验服务。

3. **RMI / JRMP**
   常由 `RmiServer` 或某些 PoC 自己构造远程引用。

4. **Dubbo / Hessian2**
   用于 Dubbo 相关模块。

5. **DNS / URL 解析**
   某些 SSRF / URL 处理 / DNS 触发型样例会用到。

6. **数据库连接协议**
   例如 H2、MySQL、HikariCP 相关样例。

### 4.2 本仓库里最常见的 HTTP 端点类别

以下是你在源码和 README 中经常能看到的“本地实验接口”类别：

| 类别 | 常见路径 | 所在模块 |
| --- | --- | --- |
| Spring Boot Actuator 配置端点 | `/env`、`/actuator/env`、`/refresh`、`/actuator/restart` | `spring/spring-boot-actuator-bug` |
| Jolokia/JMX 入口 | `/jolokia/exec/...` | `spring/spring-boot-actuator-bug` |
| CAS 登录流 | `/cas/login` | `cas` |
| Shiro 登录与受保护路由 | `/login`、`/bypass/...` | `shiro` |
| Spring Data MongoDB Demo | `/demo` | `spring/spring-data-mongodb-spel-CVE-2022-22980` |
| OAuth 重定向示例 | `/oauth` | `spring/spring-uricomponentsbuilder*` |
| Spring Session Redis Demo | `/cache` | `spring/spring-session-redis-sync` |
| Nexus 管理 REST 接口研究 | `/service/rest/...` | `nexus` README/笔记 |

### 4.3 本地辅助服务默认端口

源码里常见的默认值包括：

- HTTP 文件服务：`8080`、`23222`
- RMI：`43657`
- LDAP：`43658`
- Dubbo / ZooKeeper 示例：常见 `2181`

高价值提醒：

- 很多 PoC 默认只适合作者本地环境，真正跑之前通常都要先改目标地址、端口、资源路径。
- 如果你只是为了理解项目，优先理解“交互类型”，不要急着逐个试请求。

## 5. 高 ROI 的使用方式

下面这几种用法，投入产出比最高。

### 5.1 把它当“Java 安全研究导航仓库”

这是最稳妥、ROI 最高的用法。

推荐顺序：

1. 先看根 README，确认总图。
2. 再看 `common`，知道基础设施是什么。
3. 然后按专题读 `fastjson -> jackson -> spring -> shiro -> dubbo -> cas`。

为什么 ROI 高：

- 你会先建立“问题分类图”，而不是淹没在 PoC 细节里。
- 很多模块其实共享同一套底层概念，例如反射、JNDI、类加载、模板类链。

### 5.2 把 `common` 当成实验底座

如果你后面会自己写 PoC、写检测器、写复现实验，最值得复用的是 `common`。

原因：

- `HttpUtil` 够轻，适合快速驱动本地 HTTP 接口。
- `HTTPServer`、`LdapServer`、`RmiServer` 让你不用重复搭最小服务。
- `Reflections`、`TemplatesUtil` 能显著降低做 Java 对象构造实验的成本。

### 5.3 优先跑“低依赖、低环境成本”的模块

最推荐先跑：

1. `shiro`
   原因：本质是小型 Spring Boot Web 样例，反馈快，容易理解。

2. `spring/spring-uricomponentsbuilder*`
   原因：可以快速理解 URI 解析边界问题，且代码短。

3. `spring/spring-data-mongodb-spel-CVE-2022-22980`
   原因：很适合理解“Repository 查询表达式”和业务参数之间的关系。

4. `fastjson`
   原因：最容易看出“输入 JSON -> 解析 -> 触发对象行为”的主链。

5. `jackson`
   原因：和 Fastjson 对照学习价值很高。

### 5.4 把 Dubbo 安全加固 demo 当作“工程化收益”入口

`dubbo/dubbo-hessian2-safe-reinforcement` 是个很值得看的地方。

它的价值不是“再学一个 PoC”，而是：

- 你可以看到如何自定义 Dubbo 序列化实现。
- 你可以看到“研究代码”如何转成“加固代码”。
- 这部分内容更接近实际工程收益。

### 5.5 把 `java-compile` 当作理解运行时类生成的桥梁

如果你已经能看懂基础反序列化代码，但总觉得“为什么很多链都和动态类/字节码有关”，那就去看 `java-compile`。

它的 ROI 高在于：

- 能补齐你对 `JavaCompiler`、Javassist、类加载的认知。
- 之后再回看 `TemplatesUtil`、内存马、动态注入类代码，会快很多。

## 6. 推荐学习路径

下面给一个我认为最省时间的顺序。

### 路线 A：想先搞懂整个仓库

1. `README.md`
2. `common/README.md`
3. `fastjson/README.md`
4. `jackson/README.md`
5. `spring/README.md`
6. `shiro/README.md`
7. `dubbo/README.md`
8. `cas/README.md`
9. `java-compile/README.md`

### 路线 B：想先做源码阅读

1. `common/src/main/java/com/security/bug/common/server/*`
2. `common/src/main/java/com/security/bug/common/utils/*`
3. `fastjson/src/main/java/...`
4. `jackson/src/main/java/...`
5. `spring/.../controller`、`repository`

### 路线 C：想先看“更接近实际工程”的东西

1. `spring/spring-uricomponentsbuilder*`
2. `spring/spring-data-mongodb-spel-CVE-2022-22980`
3. `shiro`
4. `dubbo/dubbo-hessian2-safe-reinforcement`

## 7. 一个可执行的上手教程

下面这个流程的目标不是“打通所有模块”，而是 **30 到 90 分钟内建立仓库控制感**。

### Step 1：准备环境

建议环境：

- JDK 8
- Maven 3.x
- 一个完全隔离的本地实验环境

为什么优先 JDK 8：

- 许多样例依赖 JDK 内部类或旧版行为。
- JDK 9+ 经常会遇到模块访问限制。

### Step 2：先安装 `common`

先做这个，而不是全仓编译：

```bash
cd common
mvn clean install -DskipTests
```

这是很多模块的基础依赖。

### Step 3：选一个低成本模块试读 + 编译

推荐三个起点，三选一：

#### 选项 A：Shiro

适合你先理解“这是一个能跑起来的 Web demo”。

```bash
cd shiro/auth-bypass-shiro-1-7-1
mvn clean package -DskipTests
```

你重点看：

- `config/ShiroConfig.java`
- `controller/LoginController.java`
- `controller/BypassTestController.java`

#### 选项 B：Spring URI 解析

适合你快速建立“控制器 + 输入参数 + URL 解析边界”的阅读感。

```bash
cd spring/spring-uricomponentsbuilder
mvn clean package -DskipTests
```

你重点看：

- `controller/OAuthController.java`
- 白名单校验逻辑
- `UriComponentsBuilder.fromUriString(...)`

#### 选项 C：Fastjson

适合你快速进入“JSON 输入驱动对象行为”的安全研究上下文。

```bash
cd fastjson
mvn clean compile -DskipTests
```

你重点看：

- `rce/`
- `ssrf/`
- `dns/`
- `file/`

### Step 4：建立“公共套路”心智模型

当你读了 2 到 3 个模块后，把代码抽象成下面几种套路：

1. 输入是 JSON/XML/URL/HTTP 参数
2. 中间经过框架 API 解析、绑定、反序列化、路由匹配或配置刷新
3. 最终触发外部资源访问、对象构造、类加载、模板执行或协议交互

一旦你用这个模型看仓库，阅读速度会明显提升。

### Step 5：回头再看 `common`

这时再回看 `common`，你会更容易明白每个工具类在整个仓库里的作用：

- 为什么要有最小 HTTP 文件服务
- 为什么要内置 LDAP/RMI 服务
- 为什么 `Reflections` 和 `TemplatesUtil` 这么常见

### Step 6：进入高收益专题

我建议按这个顺序：

1. `fastjson`
2. `jackson`
3. `spring`
4. `shiro`
5. `dubbo`
6. `cas`
7. `java-compile`

原因：

- 前两者建立反序列化基础
- 中间两个建立 Web 入口和业务边界感
- 后两个进入协议和老系统专题
- 最后用动态编译补足底层能力理解

## 8. 几个非常值得提前知道的坑

### 8.1 很多样例写死了本地配置

仓库中经常能看到：

- `http://localhost:...`
- `127.0.0.1:...`
- 固定 LDAP/RMI 端口
- 作者机器上的绝对路径
- 某些 macOS 专用的本地程序路径

所以你在本机运行 PoC 前，第一件事通常不是“直接执行”，而是：

1. 改地址
2. 改端口
3. 改资源路径
4. 看是否依赖 JDK 8

### 8.2 不要默认全仓可一键构建

这个仓库更像“研究工作台”，不是工业化 CI 项目。

更合理的方式是：

- 先构建 `common`
- 再逐个构建目标模块
- 有报错就只在那个模块里解决

### 8.3 先看源码，少看 `target/`

仓库里已经提交了不少编译产物。理解项目时请优先：

- 看 `src/main/java`
- 看 README
- 看 `pom.xml`

不要被 `target/` 里的 class 文件干扰。

### 8.4 真正有工程价值的不只是 PoC

这仓库最值得长期保留的，不是“某一个样例能不能触发”，而是：

- 你如何识别危险 API
- 你如何判断框架边界
- 你如何把研究代码变成防御思路

从这个角度看，`dubbo-hessian2-safe-reinforcement`、`java-compile`、`common` 的长期价值反而更高。

## 9. 我的结论：如果你时间有限，先这么用

如果你只有半天时间，我建议这样分配：

1. 30 分钟看 `README`、`common`、`fastjson`、`jackson`
2. 30 分钟看 `spring` 和 `shiro`
3. 30 分钟看 `dubbo` 的加固 demo
4. 最后把你常用的辅助类记住：
   `HttpUtil`、`HTTPServer`、`LdapServer`、`RmiServer`、`Reflections`、`TemplatesUtil`

如果你只有 1 小时，我建议只做两件事：

1. 搞懂 `common`
2. 选 `spring-uricomponentsbuilder` 或 `shiro` 跑一个最小 demo

这两步的 ROI 最高，因为它们能最快把“仓库结构感”和“可运行感”建立起来。

## 10. 后续你可以怎么继续

如果你接下来要继续整理这个仓库，我建议优先做下面三件事：

1. 给每个模块补一个统一模板的 README
   包括：目标、依赖、入口类、默认端口、需要修改的硬编码配置。

2. 清理硬编码路径
   把绝对路径、固定地址改成命令行参数或配置文件。

3. 做一份模块索引表
   把“模块名 -> 漏洞类型 -> 关键 API -> 是否可直接运行 -> 默认端口/协议”整理出来。

这三件事的维护收益非常高。

