# RCE 远程代码执行漏洞研究

本目录整理了通过各类手段（反序列化、表达式注入、模板注入、命令注入等）导致的远程代码执行 (RCE) 漏洞分析。

## 核心漏洞列表

| ID | 受影响组件 | 漏洞类型 |
| :--- | :--- | :--- |
| [GHSL-2020-028](./GHSL_2020_028_Netflix_Titus中的服务器端模板注入漏洞_c0dd7455.md) | Netflix Titus | 服务器端模板注入 (SSTI) |
| [GHSL-2020-029](./GHSL_2020_029_Apache_Syncope的服务器端模板注入漏洞_CVE_20_8a8aee5e.md) | Apache Syncope | 服务器端模板注入 |
| [GHSL-2020-109](./GHSL_2020_109_Codecov中的命令注入漏洞_3c46b107.md) | Codecov | 命令注入 |
| [GHSL-2020-131](./GHSL_2020_131_Mongo_express中的远程代码执行漏洞_CVE_2020_aad0dd66.md) | Mongo-express | JS 沙盒绕过 |
| [GHSL-2022-085](./GHSL_2022_085_Java_反序列化漏洞导致_RCE_在_pac4j_core_中_73fe7e21.md) | pac4j-core | Java 反序列化 |
| [GHSL-2023-229/230](./GHSL_2023_229_GHSL_2023_230_Apache_Kafka_UI_中的远程代_5a3c49fb.md) | Kafka UI | 远程代码执行 |
| [GHSL-2024-051](./GHSL_2024_051_Misskey中的GitHub_Actions表达式注入漏洞_4e3996d9.md) | Misskey | GH Actions 注入 |
| [GHSL-2024-127/129](./GHSL_2024_127_GHSL_2024_129_OpenC3_COSMOS_中的远程代码执_e0b08dc0.md) | OpenC3 COSMOS | 远程代码执行 |

*(注：本目录共包含 50 篇相关报告，详见目录内文件)*
