# GHSL-2023-238_GHSL-2023-244: Ngrinder的未认证远程代码执行（RCE）及其他漏洞

## 概述
Ngrinder是Naver开发的一个Web应用程序，在其版本v3.5.8中发现了多个漏洞，包括未认证的远程代码执行和不当访问控制。

## 关键漏洞
1. **未认证远程代码执行（RCE）**
   - 漏洞使攻击者可以通过特定API请求将Ngrinder连接到其控制的恶意JMX/RMI服务器，运行任意命令。
   - 受影响的API: `/monitor/api/state?ip={ip}`
   - 攻击者传入恶意服务器的IP地址并触发命令执行（例如创建文件 `/tmp/pwnedGroovy.txt`）。

2. **YAML不安全反序列化**
   - 接口`/script/api/github/validate`允许用户提交不安全的YAML数据，导致RCE。
   - 用户提供的YAML数据最终流入`SnakeYAML`的`loadAll`方法。

3. **未认证的反序列化**
   - Ngrinder默认在端口`16001`上监听未经认证的Java对象，从而允许攻击者利用`ObjectInputStream`的反序列化漏洞上传恶意载荷。

4. **远程拒绝服务（DoS）**
   - `/check/healthcheck_slow`端点允许用户设定任意延迟，攻击者可通过大量请求耗尽服务器线程。

5. **恶意Webhook配置**
   - 攻击者可使用未经过访问检查的API创建或更新Webhook配置，可能获取系统内部信息或数据。

6. **信息泄露**
   - Ngrinder允许未认证用户查看Webhook请求的结果，缺乏对执行结果的访问控制。
   - 特定的性能报告接口也不需要认证，任何人都可查看报告。

## 防护措施
- **及时更新**：保持Ngrinder及其依赖项（例如Apache Tomcat）的最新版本。
- **访问控制**：确保所有敏感的API都进行了适当的访问控制。
- **监控与审计**：监控API的使用情况，并对未授权的请求进行日志审计。

## 联系信息
如有问题或需报告漏洞，请联系GHSL团队： `securitylab@github.com`，并提及相关的GHSL编号。