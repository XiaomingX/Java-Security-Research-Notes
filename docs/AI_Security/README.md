# AI Security 漏洞研究

本目录专注于人工智能框架（如 PyTorch, Keras, TensorFlow 等）及其生态系统中的安全边界与已知漏洞分析。

## 📅 重点研究报告

| ID | 描述 |
| :--- | :--- |
| [GHSL-2024-045](../RCE/GHSL_2024_045_GHSL_2024_047_命令注入和有限文件写入漏洞_CVE_20_d40e878f.md) | Fish Audio Bert-VITS2 中的命令注入与有限文件写入。 |
| [GHSL-2024-019](../RCE/GHSL_2024_019_GHSL_2024_024_Kohya_ss安全漏洞概述_479496_8c58d551.md) | Kohya_ss 框架中的多个安全漏洞分析。 |
| [Keras RCE](./Keras_RCE_CVE_2024_5452.md) | Keras `Lambda` 层导致的反序列化代码执行 (CVE-2024-5452)。 |
| [PyTorch-Ignite RCE](./PyTorch_Ignite_RCE_CVE_2024_31583.md) | PyTorch-Ignite 中的远程代码执行风险 (CVE-2024-31583)。 |
| [Gradio File Read](./Gradio_Arbitrary_File_Read_CVE_2024_5480.md) | Gradio 组件引发的任意文件读取漏洞 (CVE-2024-5480)。 |

---
> [!TIP]
> 随着 LLM 的普及，提示注入 (Prompt Injection) 和供应链攻击 (Supply Chain Attack) 正成为 AI 安全的新前沿。
