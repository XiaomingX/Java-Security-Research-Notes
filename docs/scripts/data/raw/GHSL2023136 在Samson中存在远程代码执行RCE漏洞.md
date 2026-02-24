# GHSL-2023-136: 在Samson中存在远程代码执行（RCE）漏洞

### 概述
在Samson的Kubernetes::RoleVerificationsController中，用户可控的数据未经安全处理被反序列化，这导致了远程代码执行（RCE）的风险。

### 技术细节

- **版本**: Samson v3382
- **漏洞来源**: 用户控制的角色参数进入了Kubernetes::RoleVerificationsController。
- **数据流向**:
  - 角色参数传入 `RoleConfigFile` 的初始化程序。
  - 然后传递到 `Kubernetes::Util.parse_file` 方法，在该方法中数据被不安全地反序列化。
  
- **问题根源**:
  - 使用了 `YAML.load_stream` 方法来处理不可信的数据，这可能导致任意类的实例化，从而引发远程代码执行（RCE）。

### 风险
该漏洞可能使攻击者能够执行任意代码，给系统带来严重安全威胁。

### 报告
该问题由GHSL团队成员 @pwntester (Alvaro Muñoz) 发现并报告。如需联系GHSL团队，请发送电子邮件至 securitylab@github.com，并在任何关于此问题的沟通中引用 GHSL-2023-136。