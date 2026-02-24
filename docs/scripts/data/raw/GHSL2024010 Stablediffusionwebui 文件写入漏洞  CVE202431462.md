# GHSL-2024-010: Stable-diffusion-webui 文件写入漏洞 - CVE-2024-31462

## 概述
在 Stable-diffusion-webui 1.7.0 版本中，Windows 系统存在一个有限的文件写入漏洞。

## 技术细节
- **受影响的软件**: Stable-diffusion-webui 1.7.0
- **漏洞位置**: `modules/ui_extensions.py` 文件中的 `create_ui` 方法（备份/恢复标签）  
  - **代码行**:
    - 行 653: 接收用户输入并存储在 `config_save_name` 变量中。
    - 行 65: 在 `save_config_state` 方法中使用该变量创建文件路径。
    - 行 67: 打开文件进行写入。

## 漏洞影响
该漏洞允许攻击者在服务器上任意位置写入 JSON 文件，尤其是在 Windows 系统上。

## 发现与报告
- 该漏洞由 GHSL 团队成员 @sylwia-budzynska（Sylwia Budzynska）发现，并利用 CodeQL 的路径注入查询进行分析。

## 联系信息
如需更多信息或报告问题，请联系 GHSL 团队： 
- 邮箱: securitylab@github.com 
- 主题中请提及 GHSL-2024-010。