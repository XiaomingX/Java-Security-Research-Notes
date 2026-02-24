OpenWrt 漏洞允许攻击者注入恶意固件镜像

最近，Flatt Security 公司的安全研究员 RyotaK 揭示了 OpenWrt 固件升级系统中的一个严重漏洞。该漏洞结合了截断的 SHA-256 碰撞和命令注入技术，可能会危及整个 OpenWrt 供应链[1][7]。

该漏洞是在“sysupgrade.openwrt.org”服务中发现的，该服务允许用户构建和下载自定义固件镜像[1]. RyotaK 发现该服务容易受到两个关键问题的影响[7]：

*   **命令注入**：研究人员发现该服务处理用户提供的软件包列表的方式存在缺陷，允许在构建环境中执行任意命令[1][7]。例如，恶意用户可以将恶意代码注入到软件包名称中，当系统构建固件时，这些代码就会被执行[1].

    ```bash
    # 示例：恶意软件包名称
    package_name = "; rm -rf / ;" # 这会删除系统上的所有文件！
    ```

    实际应用中，攻击者可以利用这个漏洞在路由器上安装后门程序、窃取用户数据或者将路由器变成僵尸网络的一部分[1].
*   **SHA-256 碰撞**：一个更隐蔽的问题在于缓存机制。该服务使用软件包列表的截断的 SHA-256 哈希值（仅 12 个字符）作为缓存键[1][7]。这种截断大大减少了哈希空间，使得碰撞成为可能[1][7]。这意味着，不同的软件包列表可能会生成相同的哈希值，从而导致系统错误地使用缓存的固件镜像[1].

    ```python
    import hashlib
    
    # 示例：SHA-256 碰撞
    package_list_1 = "package1,package2,package3"
    package_list_2 = "package4,package5,package6"
    
    hash_1 = hashlib.sha256(package_list_1.encode()).hexdigest()[:12]
    hash_2 = hashlib.sha256(package_list_2.encode()).hexdigest()[:12]
    
    print(f"Hash 1: {hash_1}")
    print(f"Hash 2: {hash_2}")
    
    # 在实际情况下，攻击者会找到两个不同的软件包列表，它们的 SHA-256 哈希值的前 12 个字符相同。
    ```

    攻击者可以预先构建一个包含恶意代码的固件镜像，并找到一个与之哈希值相同的合法软件包列表。当用户请求构建该合法软件包列表的固件时，系统会错误地返回攻击者预先构建的恶意镜像[1][7]。

**技术分析**

通过结合这些漏洞，攻击者可以强制服务器向请求合法软件包组合的用户返回恶意固件[1]. 这种攻击向量对 OpenWrt 的分发系统的完整性构成了严重威胁[1].

发现过程涉及复杂的技术，包括使用修改后的 Hashcat 工具进行 GPU 加速的哈希破解[7]. RyotaK 成功地在一个小时内使用 RTX 4090 显卡生成了碰撞，证明了攻击的实用性[7].

在负责任地披露漏洞后，OpenWrt 团队迅速采取行动。他们暂时停止了“sysupgrade.openwrt.org”服务，调查了该问题，并在三个小时内部署了修复程序[1]. 该团队还发布了公开声明，敦促用户检查其设备是否存在潜在的 compromised[1].

这一事件凸显了在保护软件供应链方面持续存在的挑战，即使对于像 OpenWrt 这样完善的开源项目也是如此[1]. 它强调了严格安全审计的重要性以及与用户交互式构建系统相关的潜在风险[1]. 这一发现强调了在安全关键型应用中采用强大哈希实践的必要性[1]. 随着物联网的持续扩展，OpenWrt 为众多路由器和嵌入式设备提供支持，此漏洞是对开发人员和用户保持警惕固件完整性和更新过程的警告[1].

Citations:
[1] https://www.securityweek.com/critical-openwrt-flaw-exposes-firmware-update-server-to-exploitation/
[2] https://blog.csdn.net/Julialove102123/article/details/141336646
[3] https://thehackernews.com/2024/12/critical-openwrt-vulnerability-exposes.html
[4] https://blog.csdn.net/qq_39439006/article/details/130796416
[5] https://www.helpnetsecurity.com/2024/12/09/openwrt-security-update-supply-chain-attack/
[6] https://www.cnblogs.com/apachecn/p/18461355
[7] https://socradar.io/openwrts-attended-sysupgrade-vulnerability/
[8] https://www.aminer.cn/ai-history