# Information Disclosure 信息泄露研究

本目录整理了涉及敏感信息泄露、凭证泄露、DNS 重绑定及主机内存泄露等漏洞。

## 漏洞研究报告

| ID | 核心目标 | 漏洞类型 |
| :--- | :--- | :--- |
| [GHSL-2021-020](./GHSL_2021_020_HBS_文件泄露漏洞_CVE_2021_32822_3e9bd9de.md) | HBS | 文件泄露 (CVE-2021-32822) |
| [GHSL-2021-058](./GHSL_2021_058_虚拟化环境中主机内存泄露漏洞_CVE_2021_32847_49b0f7b5.md) | Hyperkit | 内存泄露 (CVE-2021-32847) |
| [GHSL-2021-1012](./GHSL_2021_1012_随机数生成不良的密钥对问题_CVE_2021_41117_663f1a6b.md) | Keypair | 密钥对安全性下降 |
| [GHSL-2022-031/032](./GHSL_2022_031_GHSL_2022_032_Nokogiri中的类型混淆导致内存泄漏或_65b17be0.md) | Nokogiri | 类型混淆导致泄露或 DoS |
| [GHSL-2022-061](./GHSL_2022_061_Bearer_Token_泄露问题_CVE_2022_39304_1754b3cc.md) | ghinstallation | Bearer Token 泄露 |
| [GHSL-2023-009](./GHSL_2023_009_LDAP认证中的凭证泄露问题_CVE_2023_28857_883fc140.md) | CAS/LDAP | 凭证泄露 (CVE-2023-28857) |
| [GHSL-2024-030](./GHSL_2024_030_潜在的秘密泄露漏洞在_docfx_的_Pull_Request_中_54d29777.md) | docfx | 秘密泄露风险 |
| [GHSL-2024-096](./GHSL_2024_096_DNS重绑定漏洞_CVE_2024_42364_48a6d8f1.md) | homepage | DNS 重绑定 (CVE-2024-42364) |
| [GHSL-2023-221](./GHSL_2023_221_Path_Traversal_Vulnerability_in_Dig_10e7c383.md) | Digdag | 路径遍历导致泄露 |
| [Flowise](./GHSL_2023_232_GHSL_2023_234_Flowise_安全漏洞概述_62648dd2.md) | Flowise | 漏洞概述 |
| [GitHub PR](./GHSL_2024_025_GHSL_2024_026_GitHub_Pull_Request可能_a48b6e2e.md) | AutoGen | 潜在秘密泄露 |
| [Codeium](./GHSL_2024_027_GHSL_2024_028_Codeium_Chrome_扩展的_AP_f1060593.md) | Codeium | API 滥用与隐私风险 |
