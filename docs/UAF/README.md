# Memory Safety (UAF) 内存安全研究

本目录主要关注 C/C++ 编写的底层驱动或系统组件中的 "使用后释放" (Use After Free) 漏洞。

## 漏洞研究报告

| ID | 核心目标 | 描述 |
| :--- | :--- | :--- |
| [GHSL-2022-054](./GHSL_2022_054_Arm_Mali_GPU驱动中的使用后释放_Use_after_fre_ba761254.md) | Arm Mali GPU | 驱动层面的 UAF 漏洞 (CVE-2022-38181)。 |
| [GHSL-2023-139](./GHSL_2023_139_使用后释放漏洞_CVE_2023_3297_在_accountss_c74a2583.md) | accountsservice | Linux 系统服务中的 UAF 风险 (CVE-2023-3297)。 |
| [GHSL-2024-071](./GHSL_2024_071_Chromium内存损坏漏洞_CVE_2024_3832_fd0de0c1.md) | Chromium | 浏览器内核中的内存损坏/UAF。 |
