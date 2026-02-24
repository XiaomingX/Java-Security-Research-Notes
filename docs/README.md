# 漏洞研究文档库

本目录整理了各类安全漏洞的研究笔记与技术公告，主要涵盖 Web 安全、AI 框架安全及底层内存安全等领域。

## 漏洞分类索引

### 🔍 核心研究 (Featured Research)
| 类别 | 描述 | 篇目 |
| :--- | :--- | :--- |
| 🛡️ [RCE](./RCE) | 远程代码执行漏洞，包含模板注入、命令注入等。 | 50 |
| 🧠 [深度原理](./深度原理) | 操作系统 (Windows/macOS)、内核及底层机制解析。 | 26 |
| 📦 [常用SDK漏洞](./常用SDK漏洞) | Auth0, Spring SDK, GitHub Actions 等库漏洞。 | 11 |
| 🤖 [AI Security](./AI_Security) | PyTorch, Keras 等 AI 框架安全分析。 | 4 |

### 🛠️ 漏洞分类索引 (Vulnerability Categories)
| 类别 | 描述 | 篇目 |
| :--- | :--- | :--- |
| 📜 [XSS](./XSS) | 跨站脚本攻击 (反射型/存储型)。 | 14 |
| 📂 [File Read/Write](./File_Read_Write) | 任意文件读取与写入漏洞。 | 13 |
| 🕵️ [Information Disclosure](./Information_Disclosure) | 敏感信息泄露。 | 12 |
| 🔗 [SSRF](./SSRF) | 服务器端请求伪造。 | 5 |
| 🌩️ [Miscellaneous](./Miscellaneous) | CSRF, DoS, Open Redirect, SPEL 等。 | 6 |
| 🧠 [Memory Safety](./UAF) | 包含 [UAF](./UAF) 等底层内存漏洞。 | 3 |
| ⚡ [ReDoS](./ReDoS) | 正则表达式拒绝服务攻击。 | 3 |
| 💉 [SQL Injection](./SQL_Injection) | SQL 注入漏洞分析。 | 2 |
| 🔑 [Auth Bypass](./Auth_Bypass) | 身份验证与权限绕过。 | 1 |

### 📚 基础与背景 (Basics & General)
| 类别 | 描述 |
| :--- | :--- |
| 🌱 [安全基础](./安全基础) | 网络安全基础知识、行业观察与软技能。 |
| 🍂 [Spring](./Spring_Deserialization) | Spring 框架相关的反序列化专题。 |


---

## 自动化工具
相关自动化收集与处理脚本已移至 [scripts/](./scripts) 目录。