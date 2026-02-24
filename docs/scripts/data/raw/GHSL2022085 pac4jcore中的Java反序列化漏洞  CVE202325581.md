# GHSL-2022-085: pac4j-core中的Java反序列化漏洞 - CVE-2023-25581

## 概述
pac4j-core 版本4之前存在一个Java反序列化漏洞，可能导致远程代码执行（RCE）。这个漏洞影响那些在 `UserProfile` 类属性中存储外部控制值的系统。

## 漏洞细节
- **受影响版本**: pac4j-core 3.8.3及之前版本
- **关键点**: 在 `InternalAttributeHandler` 类的 `restore` 方法中, 反序列化了不受信的数据。
- **漏洞利用**:
  - `InternalAttributeHandler#prepare` 方法中使用了 Java 序列化并添加了特殊前缀 `{#sb64}`。
  - 当从属性恢复数据时，`InternalAttributeHandler#restore` 方法检查前缀并构造相应的类型。
  - 对于字符串属性，存在一个漏洞：`prepare` 方法未检查字符串值是否已经以 `{#sb64}` 开头。
  - 这使得外部控制的字符串可以伪装成合法的序列化对象，从而触发反序列化漏洞。
  
  **例如**: 如果用户名或电子邮件作为属性存储，可以使用类似 `{#sb64}rO0ABXN...序列化对象的Base64...` 的字符串进行攻击。

## 潜在影响
- 最严重的情况下，攻击者可以执行任意代码（RCE）。
- 尽管存在 `RestrictedObjectInputStream` 限制可反序列化的类，但仍然允许大量Java包，可能被利用。

## 发现与联系
这个问题由GHSL团队成员@artsploit（Michael Stepankin）发现并报告。如需与GHSL团队联系，请发送邮件至 `securitylab@github.com`，并在邮件中提到 GHSL-2022-085。