# Apache Shiro 权限绕过漏洞研究

## 项目简述
本项目包含了 Apache Shiro 在多个版本中存在的权限绕过 (Authentication Bypass) 漏洞的研究和 POC 环境。

## 核心原理
1. **URL 归一化差异**: Shiro 和底层容器或框架（如 Spring Web）对 URL 中的特殊字符（如 `;`、`..`、`/`、`%2e`）处理逻辑不一致，导致路径匹配结果出现偏差。
2. **主要绕过技术**:
   - **CVE-2020-1957**: 利用 `/..;` 绕过认证。
   - **CVE-2020-11989**: 利用原本用于路径参数的 `;` 进行绕过。
   - **CVE-2020-13933**: 利用未正确解码的 URL 字符（如 `%2e`）绕过认证。
   - **Spring 集成差异**: 在 Spring Boot 环境下，这种不一致性尤为突出。

## 目录结构
- `auth-bypass-shiro-1-4-1`: Shiro 1.4.1 绕过环境。
- `auth-bypass-shiro-1-5-1`: Shiro 1.5.1 绕过环境。
- `auth-bypass-shiro-1-5-3`: Shiro 1.5.3 绕过环境。
- `auth-bypass-shiro-1-7-1`: Shiro 1.7.1 绕过环境。
- `auth-bypass-shiro-1-8-0`: Shiro 1.8.0 绕过环境。

## 如何验证
1. 进入具体版本目录。
2. 启动 Spring Boot 应用: `mvn spring-boot:run`
3. 使用浏览器或 CURL 访问带有绕过特征的 URL（详见各 POC Controller 内部注释）。
