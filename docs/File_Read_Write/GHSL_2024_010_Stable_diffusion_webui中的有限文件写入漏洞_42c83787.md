# GHSL-2024-010: Stable-diffusion-webui中的有限文件写入漏洞 - CVE-2024-31462

## 漏洞概述

Stable-diffusion-webui 1.7.0 在 Windows 系统上存在一个有限文件写入漏洞。

## 技术细节

- **影响版本**: Stable-diffusion-webui 1.7.0
- **发现工具**: 此漏洞是通过 CodeQL 检测到的。

### 漏洞来源

1. **代码位置**: 问题出现在线 `modules/ui_extensions.py` 文件的 `create_ui` 方法（Backup/Restore选项卡）。
2. **用户输入**: 用户输入被存储在 `config_save_name` 变量中。
3. **文件路径创建**: 这个变量在 `save_config_state` 方法中用于生成文件路径。
4. **文件写入**: 最终在一个特定的行被打开以进行写入，允许在服务器上的任何位置写入 json 文件。

### 安全风险

该漏洞允许攻击者在服务器上随意写入 json 文件。
