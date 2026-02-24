# GHSL-2023-136: Samson中的远程代码执行漏洞 (RCE)

## 漏洞描述
在Samson的Kubernetes::RoleVerificationsController中，用户能够控制的数据被反序列化，导致了远程代码执行（RCE）的风险。

## 影响版本
- Samson 版本：v3382

## 技术细节
1. **漏洞路径**：
   - 用户通过Kubernetes::RoleVerificationsController传入`role`参数。
   - 该参数流经RoleConfigFile初始化器，进入Kubernetes::Util.parse_file方法。
   - 在此方法中，对数据进行了不安全的反序列化。

2. **不安全的反序列化**：
   - 使用`YAML.load_stream`处理不受信任的数据是危险的，因为它允许实例化任意类，可能导致RCE。

## 漏洞后果
- 此漏洞可能被利用进行远程代码执行（RCE），攻击者可以执行任意代码。

## 报告与联系方式
- 此问题由GHSL团队成员@pwntester（Alvaro Muñoz）发现并报告。
- 如需更多信息，请联系GHSL团队：securitylab@github.com，并在邮件中提及GHSL-2023-136。