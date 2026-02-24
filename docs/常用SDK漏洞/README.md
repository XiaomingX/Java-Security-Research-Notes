# 常用 SDK 漏洞 (Common SDK Vulnerabilities)

本目录记录了流行软件开发工具包 (SDK) 和核心库中的已知漏洞分析及修复建议。

## 漏洞研究报告

### 🔐 身份验证与授权 (Auth0 & OAuth)
- [Auth0 认证绕过漏洞深度分析](./Auth0_Authentication_Bypass_Analysis.md)
- [Auth0 安全事件回顾：JWT 漏洞的反复打击](./Auth0_JWT_Vulnerabilities_History.md)

### ☁️ 云与企业应用 (Spring, Apache, ServiceNow)
- [Spring Cloud Function 表达式注入 (CVE-2022-22963)](./Spring_Cloud_Function_RCE_CVE_2022_22963.md)
- [Apache OFBiz 预认证远程代码执行 (CVE-2024-38856)](./Apache_OFBiz_Pre_Auth_RCE_CVE_2024_38856.md)
- [ServiceNow 远程代码执行 (CVE-2024-4879) 详解](./ServiceNow_RCE_CVE_2024_4879_Analysis.md)
- [Ivanti Connect Secure 远程代码执行 (CVE-2025-0282)](./Ivanti_Connect_Secure_RCE_CVE_2025_0282.md)

### 🛠️ 开发工具与 CI/CD (GitHub, Active Directory)
- [GitHub Actions 安全性探索](./GitHub_Actions_Security_Exploration.md)
- [GitHub Enterprise SAML 身份验证绕过研究](./GitHub_Enterprise_SAML_Bypass_Research.md)
- [Active Directory 域服务权限提升 (CVE-2025-21293)](./Active_Directory_Privilege_Escalation_CVE_2025_21293.md)

### 📦 核心类库 (Jackson, Vue)
- [Jackson 多态反序列化漏洞评分标准导读](./Jackson_Polymorphic_Deserialization_CVE_Criteria.md)
- [Vue 2 中的 ReDoS 漏洞 (CVE-2024-9506)](./Vue2_ReDoS_CVE_2024_9506.md)
