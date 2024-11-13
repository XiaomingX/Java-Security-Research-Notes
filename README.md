## 项目概述

此项目用于个人研究和复现一些安全漏洞，涵盖了部分知名组件的漏洞利用代码，记录了RCE（远程代码执行）、SSRF（服务端请求伪造）、信息泄露等安全问题。此项目内容主要用于个人学习和技术记录，不包含高级技术，仅作为技术笔记和公开文档。

## 模块列表

### fastjson

此模块记录了部分fastjson库的利用gadget，尤其是涉及远程代码执行（RCE）和服务端请求伪造（SSRF）的案例。

- **RCE相关**
  - `com.threedr3am.bug.fastjson.rce.FastjsonSerialize(TemplatesImpl)`：fastjson版本 <= 1.2.24，需启用`Feature.SupportNonPublicField`
  - `com.threedr3am.bug.fastjson.rce.NoNeedAutoTypePoc`：fastjson版本 < 1.2.48，默认配置支持RCE
  - 更多示例...

- **SSRF相关**
  - `com.threedr3am.bug.fastjson.ssrf.ApacheCxfSSRFPoc(WadlGenerator)`：fastjson版本 <= 1.2.66，需启用`AutoType`
  - 更多示例...

- **其他漏洞类型**
  - DNS域名解析、拒绝服务（DoS）、信息泄露等

### jackson

该模块包含Jackson库的RCE和SSRF漏洞利用示例，帮助研究人员了解常见漏洞模式。

- **RCE相关**
  - `com.threedr3am.bug.jackson.rce.AnterosPoc`
  - 更多示例...

### dubbo

记录了与dubbo相关的漏洞利用和安全加固案例。

- **dubbo漏洞利用**
  - `com.threedr3am.bug.dubbo.RomePoc`：依赖于rome
  - 更多示例...

- **dubbo hessian2安全加固**
  - 使用黑名单策略禁用部分gadget

### padding-oracle-cbc

Java实现的padding-oracle-cbc攻击实验代码。

### xxe

记录了多种XML解析组件的XXE（XML外部实体注入）漏洞及其修复代码。

### commons-collections

初学反序列化时的代码记录，用于学习和了解反序列化漏洞。

### security-manager

Java Security Manager绕过的一些实验代码。

### rmi

涉及rmi服务及其利用的示例代码。

### tomcat

与tomcat相关的漏洞记录，包括ajp协议漏洞：

- **AJP协议漏洞**
  - `com.threedr3am.bug.tomcat.ajp`：任意文件读取及RCE漏洞（CVE-2020-1938）

### cas

记录了CAS的反序列化漏洞，包括版本要求和利用条件。

### spring

记录了Spring框架中的一些漏洞复现代码，涵盖了actuator、cloud-config-server等常见模块的安全问题。

### apache-poi

记录了与apache-poi库Excel解析相关的安全问题。

### feature

攻击数据特征分析，探索使用正则表达式等方法检测常见攻击特征的可行性。

### java-compile

Java动态编译和字节码操作的代码示例。

### nexus

Maven Nexus组件的RCE和认证绕过漏洞记录。

### ShardingSphere-UI

ShardingSphere-UI中的漏洞复现代码。

- **CVE-2020-1947**：YAML反序列化RCE漏洞

### shiro

记录了Apache Shiro中的认证绕过漏洞：

- **认证绕过漏洞**
  - 支持到1.5.3版本的认证绕过示例


# 备注
 - 项目初版继承自threedr3am，继续发展中.