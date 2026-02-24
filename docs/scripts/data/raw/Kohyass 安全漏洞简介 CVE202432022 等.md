# Kohya_ss 安全漏洞简介 (CVE-2024-32022 等)

Kohya_ss v22.6.1 存在多个命令注入和路径注入的安全漏洞。以下是有关这些漏洞的详细信息：

## 漏洞类型

1. **命令注入**: 
   - 允许攻击者执行任意命令。

2. **路径注入**: 
   - 允许攻击者控制文件写入的路径。

## 受影响的功能

- **基本字幕 GUI** (`gradio_basic_caption_gui_tab`)
  - 使用用户输入 `images_dir` 等参数执行命令，有可能导致命令注入。

- **Git 字幕 GUI** (`gradio_git_caption_gui_tab`)
  - 使用用户输入 `train_data_dir` 等参数执行命令，存在命令注入风险。

- **分组图像 GUI** (`gradio_group_images_gui_tab`)
  - 使用用户输入 `group_size` 等参数执行命令，可能导致命令注入。

- **微调选项卡** (`finetune_tab`)
  - 使用用户输入 `caption_metadata_filename` 等参数执行命令，存在命令注入风险。

## 平台影响

- 这些问题主要影响 POSIX 系统，但 Windows 系统的特定行也受到影响，但由于不调用 shell，不容易利用。

## 文件写入漏洞

- **路径创建**: 
  - 函数 `add_pre_postfix` 使用用户输入创建路径，并将文件写入。然而，攻击者只能写入以某些文件扩展名（如 `.jpg`, `.jpeg`, `.png`, `.webp`）结尾的文件，这使得文件写入行为受到限制。

- **查找和替换**: 
  - 函数 `find_and_replace` 允许攻击者找到并替换系统上任何已知内容的文件内容，这可能影响配置文件的安全。

## 发现与报告

这些漏洞由 GHSL 团队成员 @sylwia-budzynska 发现，并通过 CodeQL 工具进行检测。  

如需更多信息，请联系 GHSL 团队：securitylab@github.com，并提及相关漏洞编号（例如 GHSL-2024-019 等）。