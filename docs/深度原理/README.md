# 深度原理 (Deep Principles)

本目录包含针对操作系统底层、硬件架构以及复杂协议漏洞的深度分析。

## 核心研究报告

### 🖥️ 操作系统安全 (Windows & macOS)
- [Windows COM 对象漏洞简单介绍与实际案例](./Windows_COM_Vulnerability.md)
- [Windows OLE 零点击漏洞 (CVE-2025-21298) 简单解读](./Windows_OLE_Zero_Click_CVE_2025_21298.md)
- [Windows UI 自动化框架漏洞](./Windows_UI_Automation_Framework_Vulnerability.md)
- [macOS diskarbitrationd 符号链接验证漏洞 (CVE-2024-44175)](./macOS_diskarbitrationd_Symlink_CVE_2024_44175.md)
- [macOS PackageKit 安装器脚本缓解机制](./macOS_PackageKit_Installer_Script_Mitigation.md)

### 🧩 硬件与架构安全
- [AMD 处理器的安全加密虚拟化 (SEV-SNP) 漏洞 (CVE-2024-56161)](./AMD_SEV_SNP_Microcode_Injection_CVE_2024_56161.md)
- [AMD 处理器的微代码注入风险详情](./AMD_SEV_SEP_Microcode_Injection_Detail.md)

### 🌐 云原生与基础设施
- [Prometheus 安全风险调研](./Prometheus_Security_Risks.md)
- [Grafana SQL 表达式 DuckDB 注入 (CVE-2024-9264)](./Grafana_DuckDB_SQL_Injection_CVE_2024_9264.md)
- [AWS S3 存储桶供应链风险](./AWS_S3_Supply_Chain_Risk.md)
- [OpenWrt 恶意固件注入风险](./OpenWrt_Firmware_Injection.md)

### 📱 移动端安全
- [Android Zygote 命令注入漏洞 (CVE-2024-31317)](./Android_Zygote_Command_Injection_CVE_2024_31317.md)
- [Android MediaTek JPEG 解码器漏洞](./Android_MediaTek_JPEG_Decoder_Vulnerability.md)
- [iOS 移动应用 OAuth 攻击 (URL Scheme 劫持)](./iOS_OAuth_URL_Scheme_Hijacking.md)
- [Android 安全开发实践指南](./Android_Security_Best_Practices.md)

### 🛠️ 框架与库安全
- [XStream 反序列化安全概览](./XStream_Security_Overview.md)
- [Mutation XSS (mXSS) 深度解析](./Mutation_XSS_Detailed.md)
- [Java 反序列化漏洞精简版说明](./Java_Deserialization_Vulnerability_Simplified.md)
- [Steam CEF 框架安全分析](./Steam_CEF_Framework_Exploitation.md)

### 📦 供应链与 AI 安全
- [Go 模块供应链攻击说明](./Go_Module_Supply_Chain_Attack.md)
- [RubyGems.org 安全审计总结](./RubyGems_Security_Audit_Summary.md)
- [ChatGPT Time Bandit 漏洞解析](./ChatGPT_Time_Bandit_Vulnerability.md)
- [WordPress IP2Location 插件存储型 XSS](./WordPress_IP2Location_XSS.md)
