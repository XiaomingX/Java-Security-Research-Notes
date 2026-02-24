Prometheus 是一个流行的开源监控和告警工具，但如果配置不当，会造成严重的安全风险。研究表明，互联网上暴露的数十万个 Prometheus 实例存在信息泄露、拒绝服务 (DoS) 和远程代码执行 (RCE) 的风险[2][5][8].

**技术知识点：**

*   **未授权访问风险**：默认情况下，Prometheus 未启用身份验证，攻击者可以未经授权访问 Prometheus 服务器，直接查询内部数据，从而窃取敏感信息，例如凭据、密码和 API 密钥[1][2][5][7][8]。
*   **信息泄露**：通过未授权访问，攻击者可以获取 Prometheus 配置文件，其中可能包含数据库密码等敏感信息[2][5][7][8]。 此外，/metrics 端点可以泄露内部 API 端点、子域名以及 Docker 注册表和镜像等信息[2][5][7][8]。
*   **拒绝服务 (DoS) 攻击**： 攻击者可以利用 /debug/pprof 等端点发起 DoS 攻击，通过大量请求消耗服务器资源，导致服务器崩溃[2][5][8]。
*   **远程代码执行 (RCE)**： 某些配置不当或漏洞可能允许攻击者远程执行恶意代码，从而完全控制系统[2][5][8]。
*   **供应链威胁**： 攻击者可能利用 "RepoJacking" 技术，冒充 Prometheus 官方仓库，发布恶意exporter，诱骗用户下载和部署，最终实现远程代码执行[8]。

**实际应用例子：**

假设一家公司使用 Prometheus 监控其 Web 服务器的性能。 如果 Prometheus 服务器未进行身份验证，则攻击者可以：

1.  **窃取数据库密码**： 访问 Prometheus 配置文件，获取数据库的用户名和密码。
2.  **发起 DoS 攻击**： 通过向 /debug/pprof/heap 端点发送大量请求，使 Prometheus 服务器崩溃，导致监控中断。
3.  **植入恶意代码**： 通过 "RepoJacking" 攻击，诱骗管理员安装恶意exporter，从而在 Web 服务器上执行恶意代码。

**防范措施：**

1.  **启用身份验证**： 对 Prometheus 服务器和 exporter 启用适当的身份验证机制，例如 TLS 和基本身份验证[1][7][8]。
2.  **限制公网暴露**： 尽量避免将 Prometheus 服务器暴露在公网上[1][7][8]。 如果必须暴露，请使用防火墙或其他安全措施进行保护。
3.  **监控 /debug/pprof 端点**： 监控 /debug/pprof 端点，检测是否存在异常活动[2][5][8]。
4.  **防范 RepoJacking 攻击**： 仔细检查 Prometheus 官方文档中列出的exporter，避免下载和部署恶意版本[8]。
5.  **及时更新**： 将 Prometheus 升级到最新版本，以修复已知的安全漏洞[7].

通过采取这些措施，可以大大降低 Prometheus 服务器的安全风险，确保监控数据的安全性和可靠性。

Citations:
[1] https://avd.aliyun.com/detail?id=AVD-2021-883383
[2] https://cybersrcc.com/2024/12/18/over-300k-prometheus-instances-exposed-credentials-and-api-keys-leaking-online/
[3] https://blog.csdn.net/Julialove102123/article/details/141336646
[4] https://cloud.baidu.com/article/2830182
[5] https://www.techtarget.com/searchsecurity/news/366617178/Aqua-Security-warns-of-significant-risks-in-Prometheus-stack
[6] https://www.cnblogs.com/apachecn/p/18461355
[7] https://blog.csdn.net/yua7190/article/details/132721145
[8] https://thehackernews.com/2024/12/296000-prometheus-instances-exposed.html