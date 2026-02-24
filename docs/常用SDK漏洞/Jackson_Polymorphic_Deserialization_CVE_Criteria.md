---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ Jackson Polymorphic Deserialization CVE Criteria Tatu Saloranta edited this page on Mar 7, 2022 · 10 revisions What qualifies for a CVE report for Polymorphic Deserialization This page outlines the criteria used for accepting problem described "On Jackson CVEs: Don't Panic!" -- that of possible security problems if: Service accepts JSON content from untrusted senders AND Service enables "Default Typing" feature (or uses equivalent @JsonTypeInfo with base type of java.lang.Object) AND Service has one of 3rd libraries with "gadget" Java classes AND Jackson version is 2.9.x or lower then there may be a security issue to address by an addition to the class block list. When such issues are reported, new checks have been added to Jackson versions 2.9 (later versions have separate prevention mechanism that does not rely on blocks) to prevent deserialization of these reported "gadget" types. Problem with maintenance of block list Originally reports covered widely-used Java libraries (like EHCache or Spring Web or Hibernate) and there were even one or two types found were include in (some versions of) JDK. These could be expected to be security vulnerabilities for multiple projects and as such worth blocking. But maintaining these blocks and handling CVE id request, allocation and version releases has its cost -- and because Jackson 2.10 and later are not considered vulnerable in same sense, over time effort to keep adding to the block list has exceeded value for maintainers. For context, the current block list (Jackson-databind 2.9.10.6) contains about 90 specific classes across 30-40 libraries. Why Jackson 2.10+ not considered vulnerable The question of whether polymorphic deserialization gadgets should be considered for ANY Jackson versions is a tricky question since these attacks do NOT work against default configuration of ObjectMapper: developers must explicitly enable "Default Typing" (or use specific annotations on value classes to enable it). As such, strictly speaking these attacks should not truly qualify -- they may or may not apply, depending on specific usage of Jackson. This is unlikely most other CVEs where applicability is of "yes/no" style based on version. However: given that originally some of these issues were accepted (they are security concerns for some subset of users, after all), it became necessary to consider WHY they were accepted. Reasoning the project ended up with is as follows: While vulnerability requires users to take specific action, methods that enable behavior did not mention security concern -- so users/developers were likely to be unaware of security consequences With that in mind, Jackson 2.10 was change substantially so that there are new method for enabling so-called Safe Default Typing, which requires "Allow List" approach to outline acceptable subtypes; instead of former global "Deny List" (aka "black list"). Allow lists are by their nature a safer approach; and in this case user is then responsible for specifying safe set of subtypes allowed. In addition to the new safe approach, all old Unsafe methods were changed to: Include Javadocs that explain why use of these methods is a potential security risk Be deprecated in Jackson 2.x; to be removed from Jackson 3.0. This combination of changes allowed the change in acceptance (or lack thereof) of CVEs against Polymorphic Deserialization for different Jackson versions. New criteria (from Sep 15, 2020): Notability Starting on September 15, 2020, new blocks will only be added (and CVE ID allocated) for "gadget" types that are "Notable", which means inclusion in either: JDK version 1.8 (Java 8) or later (all valid types accepted, blocks added) Publicly available, "popular enough" artifact: Must be listed on MvnRepository.com Is depended on by at least 20 libraries (not including other components of the same framework, if part of larger set of artifacts) Some of existing blocks do not fulfill this criteria but blocks that been added previously will not be removed simply due to lack of popularity (or accessibility). One particular class of no-longer-accepted cases includes that of Application Server classes only available as part of AS installations -- unless they are accessible as artifacts via Maven Central (or similar publicly accessible and indexed Maven repos). End of Jackson 2.9 support (31 Dec, 2020) Due to availability of new minor versions (2.10.5 and 2.11.2 available as of Sep 2, 2020), no new releases of Jackson 2.9 are planned to be released, not even micro-patches, after end of 2020. The last planned micro-patch release was 2.9.10.8, released 06-Jan-2021. While it is still possible that an exception could be made for some critical issue but there are no plans for regular addition to the block list beyond 2.9.10.8. Criteria for possible extension (from January 01, 2021) Although no systematic additions are considered beyond end of 2020, it is possible that specifically notable cases could be addressed. The minimum level that must be satisfied is that gadget type is included in: JDK version 1.8 (Java 8) or later Publicly available, very popular artifact: Must be listed on MvnRepository.com Is depended on by at certain number of libraries (not including other components of the same framework, if part of larger set of artifacts) Until 31st Mar 2021: 200 libraries Until 30rd Jun 2021: 500 libraries Until 30rd Sep 2021: 1000 libraries Until 31st Dec 2021: 2000 libraries While additions may be accepted as per above criteria, Jackson team will not be filing for CVE IDs nor accept them against versions 2.10 and above. Submitters are free to report these to Mitre, against existing 2.9 and earlier relevant versions. End of accepting CVEs for Polymorphic Deserialization After end of 2021 (31st Dec, 2021), "Default Typing" style CVEs are no longer accepted regardless of what gadget types are used
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
Jackson Polymorphic Deserialization CVE Criteria
Tatu Saloranta edited this page on Mar 7, 2022 · 10 revisions
What qualifies for a CVE report for Polymorphic Deserialization
This page outlines the criteria used for accepting problem described "On Jackson CVEs: Don't Panic!" -- that of possible security problems if:

Service accepts JSON content from untrusted senders AND
Service enables "Default Typing" feature (or uses equivalent @JsonTypeInfo with base type of java.lang.Object) AND
Service has one of 3rd libraries with "gadget" Java classes AND
Jackson version is 2.9.x or lower
then there may be a security issue to address by an addition to the class block list.

When such issues are reported, new checks have been added to Jackson versions 2.9 (later versions have separate prevention mechanism that does not rely on blocks) to prevent deserialization of these reported "gadget" types.

Problem with maintenance of block list
Originally reports covered widely-used Java libraries (like EHCache or Spring Web or Hibernate) and there were even one or two types found were include in (some versions of) JDK. These could be expected to be security vulnerabilities for multiple projects and as such worth blocking.

But maintaining these blocks and handling CVE id request, allocation and version releases has its cost -- and because Jackson 2.10 and later are not considered vulnerable in same sense, over time effort to keep adding to the block list has exceeded value for maintainers. For context, the current block list (Jackson-databind 2.9.10.6) contains about 90 specific classes across 30-40 libraries.

Why Jackson 2.10+ not considered vulnerable
The question of whether polymorphic deserialization gadgets should be considered for ANY Jackson versions is a tricky question since these attacks do NOT work against default configuration of ObjectMapper: developers must explicitly enable "Default Typing" (or use specific annotations on value classes to enable it). As such, strictly speaking these attacks should not truly qualify -- they may or may not apply, depending on specific usage of Jackson. This is unlikely most other CVEs where applicability is of "yes/no" style based on version.

However: given that originally some of these issues were accepted (they are security concerns for some subset of users, after all), it became necessary to consider WHY they were accepted. Reasoning the project ended up with is as follows:

While vulnerability requires users to take specific action, methods that enable behavior did not mention security concern -- so users/developers were likely to be unaware of security consequences
With that in mind, Jackson 2.10 was change substantially so that there are new method for enabling so-called Safe Default Typing, which requires "Allow List" approach to outline acceptable subtypes; instead of former global "Deny List" (aka "black list"). Allow lists are by their nature a safer approach; and in this case user is then responsible for specifying safe set of subtypes allowed. In addition to the new safe approach, all old Unsafe methods were changed to:

Include Javadocs that explain why use of these methods is a potential security risk
Be deprecated in Jackson 2.x; to be removed from Jackson 3.0.
This combination of changes allowed the change in acceptance (or lack thereof) of CVEs against Polymorphic Deserialization for different Jackson versions.

New criteria (from Sep 15, 2020): Notability
Starting on September 15, 2020, new blocks will only be added (and CVE ID allocated) for "gadget" types that are "Notable", which means inclusion in either:

JDK version 1.8 (Java 8) or later (all valid types accepted, blocks added)
Publicly available, "popular enough" artifact:
Must be listed on MvnRepository.com
Is depended on by at least 20 libraries (not including other components of the same framework, if part of larger set of artifacts)
Some of existing blocks do not fulfill this criteria but blocks that been added previously will not be removed simply due to lack of popularity (or accessibility).

One particular class of no-longer-accepted cases includes that of Application Server classes only available as part of AS installations -- unless they are accessible as artifacts via Maven Central (or similar publicly accessible and indexed Maven repos).

End of Jackson 2.9 support (31 Dec, 2020)
Due to availability of new minor versions (2.10.5 and 2.11.2 available as of Sep 2, 2020), no new releases of Jackson 2.9 are planned to be released, not even micro-patches, after end of 2020.

The last planned micro-patch release was 2.9.10.8, released 06-Jan-2021. While it is still possible that an exception could be made for some critical issue but there are no plans for regular addition to the block list beyond 2.9.10.8.

Criteria for possible extension (from January 01, 2021)
Although no systematic additions are considered beyond end of 2020, it is possible that specifically notable cases could be addressed. The minimum level that must be satisfied is that gadget type is included in:

JDK version 1.8 (Java 8) or later
Publicly available, very popular artifact:
Must be listed on MvnRepository.com
Is depended on by at certain number of libraries (not including other components of the same framework, if part of larger set of artifacts)
Until 31st Mar 2021: 200 libraries
Until 30rd Jun 2021: 500 libraries
Until 30rd Sep 2021: 1000 libraries
Until 31st Dec 2021: 2000 libraries
While additions may be accepted as per above criteria, Jackson team will not be filing for CVE IDs nor accept them against versions 2.10 and above. Submitters are free to report these to Mitre, against existing 2.9 and earlier relevant versions.

End of accepting CVEs for Polymorphic Deserialization
After end of 2021 (31st Dec, 2021), "Default Typing" style CVEs are no longer accepted regardless of what gadget types are used.

---

**Assistant:** 好的，我将用最简单的表达方式，重写并扩展您提供的内容，重点介绍技术知识点，并提供实际应用例子和代码，帮助中国开发者更好地理解。
## Jackson多态反序列化漏洞 (CVE) 标准详解
### 什么是Jackson多态反序列化？
Jackson是一个流行的Java库，用于在Java对象和JSON数据之间进行转换。*多态反序列化*是指Jackson能够根据JSON数据中的类型信息，将JSON数据转换为不同的Java对象类型。
例如，假设我们有一个`Animal`接口，以及`Dog`和`Cat`两个实现类。JSON数据可能包含一个`type`字段，指示应该将数据反序列化为`Dog`对象还是`Cat`对象。
### 为什么多态反序列化可能导致安全问题？
如果Jackson启用了*默认类型* (Default Typing) 功能，并且接收来自不可信来源的JSON数据，那么攻击者可能通过构造恶意的JSON数据，指定一个恶意的Java类进行反序列化，从而执行任意代码。这种恶意的Java类通常被称为 "gadget"。
### 漏洞产生的条件：
- **接收不可信的JSON数据**: 你的服务需要接收来自不可信任的来源的JSON数据。
- **启用"Default Typing"**: Jackson的"Default Typing"功能被启用，或者使用了等效的`@JsonTypeInfo`注解，且基类型为`java.lang.Object`。
- **存在"gadget"类**: 你的项目中或者依赖的第三方库中存在可利用的 "gadget" Java类。
- **Jackson版本较低**: 使用的Jackson版本是2.9.x或更低。
### 简单理解：
可以把Default Typing想象成一扇门，它允许Jackson自动根据JSON数据中的类型信息创建对象。如果这扇门没有安全措施，坏人就可以通过它创建任意对象，包括那些可以用来执行恶意代码的对象。
### 实际案例：
假设你的应用程序允许用户上传包含序列化对象的JSON文件。如果Jackson配置不当，攻击者可以创建一个包含恶意类信息的JSON文件，当你的应用程序尝试反序列化这个文件时，恶意代码就会被执行。
### 代码示例 (存在漏洞的配置):
javaObjectMapper mapper = new ObjectMapper();
// 启用Default Typing，存在安全风险
mapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
String jsonInput = "[\"org.example.EvilGadget\", {}]"; // 恶意JSON数据
Object obj = mapper.readValue(jsonInput, Object.class); // 反序列化
在这个例子中，`org.example.EvilGadget` 是一个恶意的Java类，当它被反序列化时，会执行恶意代码。
### 如何防范？
- **不要轻易启用"Default Typing"**: 除非绝对必要，否则不要启用Jackson的"Default Typing"功能。
- **使用白名单**: 如果必须使用多态反序列化，使用*白名单*来限制允许反序列化的类。
- **升级Jackson版本**: 升级到Jackson 2.10或更高版本。这些版本提供了更安全的默认类型处理方式。
- **代码安全审计**: 定期进行代码安全审计，检查是否存在潜在的漏洞。
### Jackson 2.10+ 的改进
Jackson 2.10及更高版本通过引入*安全默认类型* (Safe Default Typing) 的概念，以及使用*允许列表* (Allow List) 来解决这个问题。
- **安全默认类型**:  需要明确指定允许反序列化的子类型，而不是像以前那样使用全局的*拒绝列表* (Deny List，也称为黑名单)。
- **允许列表**:  只允许反序列化明确指定的类，从而避免了反序列化恶意类的风险。
- **废弃不安全的方法**:  所有不安全的方法都已被标记为`@Deprecated`，并将在Jackson 3.0中移除。
### 代码示例 (安全的配置):
javaObjectMapper mapper = new ObjectMapper();
// 使用 TypeIdResolverBuilder
// 注册允许的子类型
// 替代不安全的 enableDefaultTyping
### CVE报告的标准
对于Jackson 2.9及更低版本，如果满足以下条件，可能会被认为是安全漏洞，并分配CVE编号：
- 漏洞利用的 "gadget" 类型是*显著的* (Notable)。
包含在JDK 1.8 (Java 8) 或更高版本中。
- 或者，是一个公开可用的、足够流行的artifact。
必须在MvnRepository.com上列出。
- 被至少20个library依赖（不包括同一框架的其他组件）。
### 数值指标
- Jackson 2.9.10.6的黑名单包含大约90个类，来自30-40个不同的库。
- 截至2021年12月31日，Jackson不再接受 "Default Typing" 类型的CVE报告。
### 总结
Jackson多态反序列化漏洞是一个潜在的安全风险，但通过合理的配置和安全措施，可以有效地防范。始终关注Jackson的安全更新，并遵循最佳安全实践，以确保你的应用程序安全。