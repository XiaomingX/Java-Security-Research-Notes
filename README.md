# Java Security Research Notes

## 项目概述
本项目是一个综合性的 Java 安全漏洞研究资源库，涵盖了多个知名组件和框架的安全漏洞研究、POC 代码和利用技术。项目内容包括但不限于：
- **RCE (远程代码执行)**: 反序列化、表达式注入、模板注入等
- **SSRF (服务端请求伪造)**: XXE、URL 重定向等
- **信息泄露**: 配置泄露、路径遍历等
- **认证绕过**: 权限控制缺陷、会话管理问题等

## 主要研究领域

### 反序列化漏洞
- **[Common Collections](common-collections/)**: Apache Commons Collections gadget 链研究
- **[Fastjson](fastjson/)**: Fastjson AutoType 绕过技术
- **[Jackson](jackson/)**: Jackson Default Typing 利用
- **[Dubbo](dubbo/)**: Hessian2 反序列化攻击
- **[RMI](rmi/)**: Java RMI 反序列化漏洞

### Web 框架安全
- **[CAS](cas/)**: Apereo CAS 认证系统漏洞
- **[Shiro](shiro/)**: Apache Shiro 认证绕过
- **[Spring](spring/)**: Spring Boot Actuator、Spring Cloud 漏洞
- **[Tomcat](tomcat/)**: Tomcat Session 集群同步漏洞

### 其他安全研究
- **[XXE](xxe/)**: XML 外部实体注入
- **[JSP WebShell](jsp-webshell/)**: 各种免杀 WebShell 技术
- **[Ysoserial](ysoserial/)**: Java 反序列化利用工具

## 项目结构
```
Java-Security-Research-Notes/
├── cas/                    # CAS 认证系统漏洞
├── common/                 # 通用工具类
├── common-collections/     # Commons Collections 研究
├── dubbo/                  # Dubbo 反序列化
├── fastjson/              # Fastjson 漏洞研究
├── jackson/               # Jackson 反序列化
├── jsp-webshell/          # JSP WebShell 技术
├── rmi/                   # RMI 安全研究
├── shiro/                 # Shiro 认证绕过
├── spring/                # Spring 系列漏洞
├── tomcat/                # Tomcat 安全研究
├── xxe/                   # XXE 漏洞研究
└── ysoserial/             # 反序列化工具
```

## 使用说明

### 环境要求
- JDK 8 或更高版本
- Maven 3.x
- 相关漏洞组件的依赖库

### 编译项目
```bash
# 编译所有项目
mvn clean install

# 编译特定子项目
cd [子项目目录]
mvn clean compile
```

### 运行 POC
```bash
# 示例：运行 Fastjson POC
cd fastjson
mvn exec:java -Dexec.mainClass="com.security.bug.fastjson.file.FileWriteBypassAutoType1_2_68"
```

## 免责声明
⚠️ **重要提示**：
- 本项目仅用于安全研究和教育目的
- 所有 POC 代码仅应在授权的测试环境中使用
- 未经授权对他人系统进行测试是违法行为
- 使用者需自行承担使用本项目代码的一切后果

## 贡献指南
欢迎提交 Issue 和 Pull Request 来改进本项目。贡献时请遵循以下原则：
- 代码需要有清晰的注释和文档
- 新增 POC 需要包含漏洞原理说明
- 遵循现有的代码风格和目录结构

## 许可证
本项目采用 Apache License 2.0 许可证。详见 [LICENSE](LICENSE) 文件。

## 参考资源
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Java Security Manager](https://docs.oracle.com/javase/tutorial/essential/environment/security.html)
- [Common Vulnerabilities and Exposures (CVE)](https://cve.mitre.org/)

---
**注**: 本项目持续更新中，欢迎关注和参与贡献。
