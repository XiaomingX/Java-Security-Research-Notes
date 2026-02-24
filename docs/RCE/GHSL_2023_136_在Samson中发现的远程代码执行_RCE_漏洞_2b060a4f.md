# GHSL-2023-136: 在Samson中发现的远程代码执行(RCE)漏洞

## 漏洞简介

在Samson的Kubernetes::RoleVerificationsController中，程序错误地处理了用户输入的数据，这导致了远程代码执行(RCE)。

## 技术细节

- **版本**：Samson v3382
- **问题来源**：用户提供的"role"参数进入了Kubernetes::RoleVerificationsController。
- **处理流程**：
  1. "role"参数流入RoleConfigFile初始化器。
  2. 随后进入Kubernetes::Util.parse_file方法，里面的不安全反序列化发生了。
  
- **具体问题**：使用`YAML.load_stream`方法来处理不受信任的数据是不安全的，因为它允许实例化任意类，这可能导致远程代码执行(RCE)。

## 影响

这个漏洞可能使攻击者能够在服务器上执行任意代码，造成严重的安全风险。
