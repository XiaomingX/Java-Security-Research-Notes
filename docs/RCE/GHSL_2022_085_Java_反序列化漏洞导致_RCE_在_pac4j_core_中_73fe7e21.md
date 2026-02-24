# GHSL-2022-085: Java 反序列化漏洞导致 RCE 在 pac4j-core 中 - CVE-2023-25581

## 漏洞概述

在 pac4j-core 版本 4 之前的版本中，存在一个 Java 反序列化漏洞。这个漏洞影响到存储外部控制值的 `UserProfile` 类的属性。攻击者可以通过提供一个带有特殊前缀 `{#sb64}` 和 Base64 编码的序列化 Java 对象的属性来利用这个漏洞。

## 技术细节

- **受影响版本**: pac4j-core v3.8.3
- **关键方法**: `org.pac4j.core.profile.InternalAttributeHandler#restore`

### 漏洞成因

- **属性处理**: `InternalAttributeHandler#prepare` 方法支持多种属性类型，例如 String, Boolean, Data 和 URI。当存储任意类型的对象时，会使用 Java 序列化和 `ObjectInputStream`，并添加 `{#sb64}` 前缀。
- **恢复属性**: 当恢复属性时，`InternalAttributeHandler#restore` 方法会检查前缀并构建相应类型。但是对于字符串属性，`prepare` 方法没有检查字符串值是否已经以 `{#sb64}` 开头。这使得攻击者可以通过存储外部控制的字符串（如用户名或邮箱）来引发任意 Java 类的反序列化。

### 示例攻击

假设将用户的用户名存储为属性，可以使用如下值触发反序列化漏洞：
```
{#sb64}rO0ABXN...serizalized_object_in_base64...
```

## 后果

此漏洞可能导致远程代码执行（RCE）。虽然已有一个 `RestrictedObjectInputStream` 限制可以反序列化的类，但仍然允许大量 Java 包，这可能被多种攻击手法利用。

## 报告与联系

此问题由 GHSL 团队成员 @artsploit（Michael Stepankin）发现并报告。如需进一步信息，请联系 GHSL 团队: securitylab@github.com，并在通信中提及 GHSL-2022-085。