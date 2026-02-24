# GHSL-2023-081_GHSL-2023-082: Tar Slip Vulnerabilities in Autolab

发现了两个 Tar Slip 漏洞，这些漏洞可能允许攻击者在系统文件中创建或替换文件，甚至执行它们。

## 漏洞概述
**影响版本**: Autolab v2.10.0

### 漏洞类型
1. **Install 评估功能的漏洞 (CVE-2023-32676)**
   - 攻击者需要具备讲师权限，并上传一个特制的 Tar 文件。
   - 攻击者可以利用该功能上传包含指向目标目录之外路径的文件（例如：`../../../../tmp/tarslipped1.sh`）。
   - 文件在提交后被解压缩到攻击者指定的位置。

   **关键代码**:
   ```python
   # 关键变量
   relative_pathname = full_name_from_archive
   ```

2. **MOSS 抄袭检测功能的漏洞 (CVE-2023-32317)**
   - 攻击者同样需要具备讲师权限，并可上传特制的 Tar 文件。
   - 攻击者可以上传包含超出目标路径的文件（例如：`../../../../tmp/tarslipped2.sh`）。
   - 文件在检测启动时被解压缩到攻击者指定的位置。

   **关键代码**:
   ```python
   # 关键变量
   destination = pathname_from_archive
   ```

## 漏洞后果
- 这些问题可能导致任意文件写入。
- 在某些情况下，可能导致远程代码执行（如果写入的文件可被执行）。

## 漏洞重现
- 攻击者可以创建含有漏洞的 Tar 文件，且文件路径指向系统的临时目录。
- 成功利用后，将在 `/tmp` 文件夹中看到 `tarslipped1.sh` 或 `tarslipped2.sh` 文件。
