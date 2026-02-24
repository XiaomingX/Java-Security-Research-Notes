好的，这是对文章的重新描述，重点介绍技术知识点，使其更易于理解，并扩展了相应的内容，增加了贴近实际的应用例子和相应的演示代码，以便中国读者更好地理解：

## 苹果如何缓解安装器脚本中的漏洞

安全研究领域中，漏洞一直是一个热门话题，因为它们可能产生巨大的影响。然而，像苹果这样的公司为防止特定漏洞甚至整个漏洞利用系列而采取的策略和方法，通常较少受到关注。但事实上，工程设计高影响的缓解措施通常比发现单个漏洞更具挑战性。

本文将介绍苹果公司最近为缓解一类安装器脚本漏洞所做的努力。我们将涵盖以下内容：

*   为什么苹果签名的安装器是攻击者的绝佳目标；
*   过去此类漏洞的高级概述；以及
*   深入了解苹果如何尝试通过 PackageKit 私有框架中的新设计来缓解这些漏洞。

### 为什么系统安装器功能强大

在 macOS 中，两个守护进程处理软件包安装器的安装：`installd` 和 `system_installd`。第一个在安装第三方软件包时调用，第二个用于苹果签名的软件包。我们将重点关注 `system_installd`，因为它更常被滥用。

检查其代码签名将有助于我们理解为什么它是一个有趣的目标。运行以下命令：

```bash
codesign -dv --entitlements - /System/Library/PrivateFrameworks/PackageKit.framework/Versions/A/Resources/system_installd
```

将生成关于该安装器的大量输出。其中一个关键是：

```
[Key]com.apple.rootless.install.heritable
[Value]
  [Bool] true
```

`com.apple.rootless.install.heritable` 授权非常强大。它不仅允许进程访问受系统完整性保护 (SIP) 保护的系统区域，而且其子进程也继承该权限。对于安装器而言，这意味着任何嵌入的安装器脚本（通常是 bash 或 perl）都将以这些特殊权限运行。

如果此类脚本存在可利用的漏洞，或者我们可以以任何方式破坏安装过程，攻击者就可以绕过 SIP。因此，苹果签名的安装器历来是滥用的目标。

### SIP 绕过漏洞

针对软件包安装过程有两种主要方法。

第一种方法是在 PackageKit 框架中找到漏洞，并破坏安装过程以运行攻击者的代码；覆盖嵌入在安装软件包中的脚本是一种常用技术。另一种方法是找到安装脚本本身的逻辑错误，并利用它来绕过 SIP。

以下是一些采用这两种方法的漏洞示例。（如果您对 SIP 绕过的早期历史感兴趣，请查看 Howard Oakley 的 [为什么 Catalina 具有只读系统卷](https://eclecticlight.co/2019/10/19/why-catalina-has-got-a-read-only-system-volume/)。）

*   **CVE-2019-8561:** 此漏洞允许攻击者在系统验证其代码签名后交换安装软件包；因此，系统将安装提供的软件包而不是原始软件包。由于原始软件包是苹果签名的二进制文件，因此 `system_installd` 进程将安装它，从而允许攻击者绕过 SIP。苹果的修复方法是改进软件包的验证。
*   **CVE-2020–9854: Unauthd Chain:** 此漏洞利用链利用了三个漏洞：其中一个是 SIP 绕过，它利用了编写错误的安装脚本。该脚本在安装后执行一个二进制文件，该文件通常存在于 macOS 系统中受 SIP 保护的位置。但是，如果我们在挂载的映像或外部驱动器上安装软件包，安装器可以从我们提供的文件系统中执行该二进制文件，因此它将以 SIP 绕过权限运行。苹果的修复方法是确保如果我们在非系统卷上安装软件包，则调用 `installd`（它没有那么危险的授权）而不是 `system_installd`。
*   **Mickey Jin's CVEs:** Mickey Jin 发现了许多漏洞，包括绕过 CVE-2019-8561 修复程序的漏洞，以及绕过 unauthd 补丁程序的修复程序的三个新漏洞。他还发现了 CVE-2022-22583 和 CVE-2022-32800，其中脚本被提取到不受 SIP 保护的位置，允许攻击者用自己的脚本替换它们。
*   **CVE-2021-30892: Shrootless:** 如果安装器脚本由 zsh 运行，则该过程将读取环境文件 `/etc/zshenv`；如果恶意行为者将脚本放入此文件中，它将被执行。同样，由于该过程最终是 `system_installd` 的子进程，因此它可用于写入受 SIP 保护的位置。苹果通过限制在进程具有 SIP 绕过权限的情况下使用 zshenv 来修复此问题。
*   **CVE-2023-23533:** 此问题与安装器脚本错误有关：后安装操作脚本中的不安全文件复制可用于将文件复制到受 SIP 保护的区域。
*   **CVE-2023-42860:** 此漏洞存在于与之前的 CVE-2023-23533 相同的脚本中，即 `link_shared_support.bash`，该脚本可以在 OS 安装 InstallAssistant.pkg 软件包中找到。以下命令容易受到竞争条件攻击，并且它允许攻击者完全绕过 SIP：

```bash
/bin/ln -fFh "${PACKAGE_PATH}" "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
```

由于该命令以 rootless 身份运行，因此即使对于受 SIP 保护的文件，它也可以创建硬链接。如果我们用指向 SIP 保护位置中文件的符号链接替换 PKG 文件（即 `/Users/user/InstallAssistant_13.0_22A380.pkg`），则创建的硬链接将指向原始 SIP 保护的路径。由于 SIP 保护基于文件系统路径，因此一旦创建了该硬链接，我们就可以修改受保护的文件，因为其路径不再受 SIP 保护。

该漏洞还有一个额外的转折，这是由于安装器脚本的最后一行：

```bash
/usr/bin/chflags -h norestricted "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
```

此命令使文件不受限制（即，没有 SIP 保护），这意味着我们可以直接修改该文件；我们甚至不需要硬链接。

### 苹果的新缓解措施

现在我们已经回顾了一些过去的系统安装器漏洞利用，我们可以看看苹果引入的一项新缓解措施，它应该普遍解决其中一些漏洞。

软件包内部而不是安装器框架本身中的漏洞的问题在于，即使我们修复了软件包，攻击者仍然可以使用旧版本。这是可能的，因为软件包的签名仍然有效，因此可以在任何系统上执行。因此，缓解此类漏洞通常并不容易。

具有强大授权的常规苹果签名应用程序也存在类似问题。由于其代码签名有效，因此可以在新版本的操作系统上重复使用这些应用程序，并且攻击者可以利用它们来获得对其授权的访问权限。这可以通过在 Apple Silicon 上使用信任缓存以及启动和环境约束来解决。

为了解决安装器脚本的问题，苹果在 PackageKit 中引入了一项新的缓解措施，该措施应防止此类漏洞，并允许开发人员在操作系统级别轻松修补此类错误。该缓解措施包括两个部分：安装脚本操作和安装脚本突变。

安装脚本操作在 `InstallScriptActions.plist` 中配置（位于 `/System/Library/PrivateFrameworks/PackageKit.framework/Resources/` 中）。其中包括：

```xml
<dict>
    <key>ScriptTypes</key>
    <array>
        <string>postinstall</string>
    </array>
    <key>RelativePath</key>
    <string>postinstall_actions/link_shared_support.bash</string>
    <key>DropSIP</key>
    <true/>
    <key>PerformMutation</key>
    <string>LinkSharedSupport</string>
    <key>ComponentPackageIdentifiersRegex</key>
    <array>
        <string>^com\.apple\.pkg\.InstallAssistant\S*$</string>
    </array>
</dict>
```

本节定义了如果在软件包中找到特定脚本，系统应该执行的操作。让我们从下到上查看其键。

*   `ComponentPackageIdentifiersRegex` 标识软件包。在上面的示例中，它是所有 InstallAssistant\* 安装器的 ID，我们在上面展示了该漏洞利用。
*   `PerformMutation` 指定应该发生的脚本突变的名称。我们将在稍后更详细地讨论这一点。
*   `DropSIP` 指定在运行脚本之前是否应该删除 CS\_INSTALLER 代码签名标志。此标志本质上转换为 `com.apple.rootless.install` 授权。（这是唯一的，因为授权通常不映射到代码签名位标志）。如果删除此标志，安装器将无法再绕过 SIP，这是考虑到最近的漏洞而采取的重要步骤。
*   `RelativePath` 指的是软件包中的实际脚本，同样，在之前的示例中，这是易受攻击的 `link_shared_support.bash`。
*   `ScriptTypes` 指的是脚本的类型，例如 pre- 或 post-install 或 pre- 或 post-flight。

本质上，我们在这里拥有一个嵌入在操作系统中的属性列表，它强制对某些苹果安装器进行特殊处理。大多数情况都是关于删除 SIP，因此攻击者无法使用这些安装器进行利用，即使他们拥有易受攻击的安装器。

苹果还引入了安装脚本突变。这允许 PackageKit 替换预定义脚本的内容。要替换的相关正则表达式可以在文件 `InstallScriptMutations.plist` 中找到（在 `/System/Library/PrivateFrameworks/PackageKit.framework/Resources/` 中）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>

    <key>LinkSharedSupport</key>
    <dict>
        <key>PreReplacementCaptures</key>
        <array>
            <string>^SHARED_SUPPORT_PATH\=.*$</string>
        </array>
        <key>ReplacementContent</key>
        <string>#!/bin/bash
SHARED_SUPPORT_PATH=&quot;${3}Applications/%%%IA_NAME%%%/Contents/SharedSupport&quot;
/bin/mkdir -m 755 -p &quot;${SHARED_SUPPORT_PATH}&quot;
echo &quot;Copying ${PACKAGE_PATH} into ${SHARED_SUPPORT_PATH}&quot;
/bin/cp -fc &quot;${PACKAGE_PATH}&quot; &quot;${SHARED_SUPPORT_PATH}/SharedSupport.dmg&quot; ||
/bin/cp -f &quot;${PACKAGE_PATH}&quot; &quot;${SHARED_SUPPORT_PATH}/SharedSupport.dmg&quot;</string>
        <key>PostReplacementChanges</key>
        <array>
            <dict>
                <key>RegexMatch</key>
                <string>^SHARED_SUPPORT_PATH\=.*$</string>
                <key>PreMutationCaptureIndex</key>
                <integer>0</integer>
            </dict>
        </array>
    </dict>

    <key>LinkPackage</key>
    <dict>
        <key>PreReplacementCaptures</key>
        <array>
            <string>^SHARED_SUPPORT_PATH\=.*$</string>
        </array>
        <key>ReplacementContent</key>
        <string>#!/bin/bash
SHARED_SUPPORT_PATH=&quot;${3}Applications/%%%IA_NAME%%%/Contents/SharedSupport&quot;
/bin/mkdir -m 755 -p &quot;${SHARED_SUPPORT_PATH}&quot;
/bin/chmod 0755 &quot;${SHARED_SUPPORT_PATH}&quot;
echo &quot;Copying ${PACKAGE_PATH} into ${SHARED_SUPPORT_PATH}&quot;
/bin/cp -fc &quot;${PACKAGE_PATH}&quot; &quot;${SHARED_SUPPORT_PATH}/InstallESD.dmg&quot; ||
/bin/cp -f &quot;${PACKAGE_PATH}&quot; &quot;${SHARED_SUPPORT_PATH}/InstallESD.dmg&quot;</string>
        <key>PostReplacementChanges</key>
        <array>
            <dict>
                <key>RegexMatch</key>
                <string>^SHARED_SUPPORT_PATH\=.*$</string>
                <key>PreMutationCaptureIndex</key>
                <integer>0</integer>
            </dict>
        </array>
    </dict>

</dict>
</plist>
```

此属性列表包含两个条目：`LinkSharedSupport` 和 `LinkPackage`。第一个键是从先前讨论的 `InstallScriptActions.plist` 中引用的，并且我们之前检查的条目引用了 `LinkSharedSupport`。这两个条目都包含基本相同的数据。

最有趣的部分是 `ReplacementContent` 和 `RegexMatch` 下的数据。本质上，第一个是新内容，第二个是用于匹配的正则表达式。在不深入研究正则表达式黑魔法的情况下，这基本上会将原始 `link_shared_support.bash` 脚本转换：

```bash
#!/bin/bash
...
SHARED_SUPPORT_PATH="${3}Applications/Install macOS Ventura.app/Contents/SharedSupport"
/bin/mkdir -p "${SHARED_SUPPORT_PATH}"
/bin/chmod 0755 "${SHARED_SUPPORT_PATH}"
SOURCE_DEVICE=$(/usr/bin/stat -n -f '%d' "${PACKAGE_PATH}")
TARGET_DEVICE=$(/usr/bin/stat -n -f '%d' "${SHARED_SUPPORT_PATH}")
if [ ${SOURCE_DEVICE} -eq ${TARGET_DEVICE} ]; then
    echo "Linking ${PACKAGE_PATH} into ${SHARED_SUPPORT_PATH}"
    /bin/ln -fFh "${PACKAGE_PATH}" "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
    /bin/chmod 0644 "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
    /usr/sbin/chown -R root:wheel "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
else
    echo "${PACKAGE_PATH} on different device than ${SHARED_SUPPORT_PATH} ... copying"
    /bin/cp "${PACKAGE_PATH}" "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
fi

/usr/bin/chflags -h norestricted "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
```

进入：

```bash
#!/bin/bash
SHARED_SUPPORT_PATH="${3}Applications/Install macOS 14 beta.app/Contents/SharedSupport"
/bin/mkdir -m 755 -p "${SHARED_SUPPORT_PATH}"
echo "Copying ${PACKAGE_PATH} into ${SHARED_SUPPORT_PATH}"
/bin/cp -fc "${PACKAGE_PATH}" "${SHARED_SUPPORT_PATH}/SharedSupport.dmg" ||
/bin/cp -f "${PACKAGE_PATH}" "${SHARED_SUPPORT_PATH}/SharedSupport.dmg"
```

生成的安装器不仅会删除安装的 SIP，还会从脚本中删除两个易受攻击的代码条目，然后再执行。

### 结论

经过多年来人们利用安装器脚本绕过 SIP，苹果在 PackageKit 中引入了一个易于扩展的配置，该配置允许他们在脚本文件执行之前修改其内容，并指定是否应禁用 SIP。

这是一种很好的方法，因为缓解措施位于操作系统内部，并且可以通过将条目添加到配置文件中来轻松修补未来的漏洞。

这种方法确实有一个缺点：如果出现一个新的安装器，或者存在一个以前未考虑的旧安装器，攻击者可以再次利用它们来绕过 SIP。但是，如果苹果希望允许这些脚本写入受 SIP 保护的位置，那么这可能是他们可以提出的最佳解决方案之一，而不会因为一项禁止所有脚本的通用规则而导致合法的安装失败。

希望这个解释对您有所帮助！

Citations:
[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/4014460/98f14c23-72d1-45df-b944-88f2792b280b/paste.txt