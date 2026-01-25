# Spring 系列安全研究

## 项目简述
本项目深入研究了 Spring 生态系统中的多种安全漏洞，特别是 Spring Boot Actuator 和 Spring Cloud Context 中的配置注入漏洞。

## 核心原理
1. **Actuator 配置注入**: 通过 `/env` 端点注入恶意配置项，配合 `/refresh` 端点触发动态刷新，从而触发底层的反序列化或类加载漏洞。
2. **主要绕过技术**:
   - **SnakeYAML**: 在 Spring Cloud 环境下利用 YAML 反序列化触发 RCE。
   - **XStream**: 结合 Eureka Client 触发 XML 反序列化绕过。
   - **HikariCP**: 通过注入数据库连接池配置触发 RCE。
3. **Spring Data SpEL**: 研究 SpEL (Spring Expression Language) 在数据库查询（如 MongoDB）中的注入问题。

## 目录结构
- `spring-boot-actuator-bug`: 涵盖 1.x 到 2.x 版本的多种 Actuator 利用方式。
- `spring-cloud-config-server-CVE-2019-3799`: Spring Cloud Config 路径遍历研究。
- `spring-data-mongodb-spel-CVE-2022-22980`: Spring Data MongoDB SpEL 注入研究。
- `spring-uricomponentsbuilder`: Spring URL 处理中的安全边界研究。

## 如何验证
1. 编译项目: `mvn clean compile`
2. 启动受漏洞影响的 Spring Boot 应用。
3. 运行相应的攻击 POC 类进行验证。
