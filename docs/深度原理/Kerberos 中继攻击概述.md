## Kerberos 中继攻击简介

最近，Kerberos 中继攻击越来越受到关注，这是因为越来越多的 Active Directory 环境加强了安全防护，限制了 NTLM 认证，从而阻止了常见的 NTLM 中继攻击。

虽然 Kerberos 中继攻击相比 NTLM 中继攻击有一些挑战和限制，但它仍然有效，并且可能导致高危的权限提升。Kerberos 中继攻击的研究主要源于 James Forshaw 在 2021 年发表的成果。到目前为止，研究人员已经发布了两种 Kerberos 中继攻击方式：基于 DNS 的 Kerberos 中继和基于 SMB 的 Kerberos 中继。

本文将介绍第三种 Kerberos 中继攻击方式，它同样由 James Forshaw 发现：通过多播欺骗实现基于 HTTP 的 Kerberos 中继。这种方法有别于 DNS/SMB 中继，在某些情况下，当其他两种方式无法利用时，可以使用这种方法。

### 什么是 Kerberos 中继攻击？

简单来说，Kerberos 中继攻击是指攻击者截获合法的 Kerberos 认证请求（AP-REQ），然后利用这个请求冒充受害者访问目标服务。

**理解 AP-REQ**

在 Kerberos 认证流程中，AP-REQ 是最后一个请求，也是决定用户是否能访问服务的关键。AP-REQ 包含两个要素：

*   **服务票据 (ST)**：使用目标服务的密钥加密，包含用户信息、目标 SPN 和会话密钥。
*   **认证器 (Authenticator)**：使用与 ST 关联的会话密钥加密的数据块。

当服务收到 AP-REQ 时，它会解密 ST，提取会话密钥，并验证认证器。如果验证成功，则允许访问服务。

**中继攻击的原理**

Kerberos 协议本身并没有阻止 AP-REQ 中继攻击的机制。如果攻击者能够截获有效的 AP-REQ，就可以用它来认证目标服务，冒充合法用户。

**攻击的条件**

1.  **目标服务不强制要求完整性校验**：类似于 NTLM 中继攻击，AP-REQ 中继只有在目标服务不强制要求完整性校验（例如通过签名）时才有效。
2.  **控制 AP-REQ 的目标 SPN**：AP-REQ 包含一个 ST，它使用目标主机在 SPN 中指定的密钥加密。攻击者需要想办法让受害者构造一个包含 ST 的 AP-REQ，这个 ST 使用攻击者想要中继的目标主机的密钥加密。
3.  **重定向 AP-REQ**：攻击者需要让受害者将 AP-REQ 发送到攻击者的机器，而不是合法的目标主机。

### 两种已知的 Kerberos 中继攻击方式

1.  **基于 DNS 的 Kerberos 中继**：利用 Active Directory 中 DNS 安全动态更新的工作方式。
2.  **基于 SMB 的 Kerberos 中继**：利用 SMB 客户端在请求 ST 时构造 SPN 的方式。

## 基于 HTTP 的 Kerberos 中继：多播欺骗

James Forshaw 在 2021 年的研究中提到了一种新的 Kerberos 中继方式，即通过多播欺骗实现基于 HTTP 的 Kerberos 中继。

### 理论基础

当 Web 服务器要求 Kerberos 认证时，HTTP 客户端不会使用目标 URL 来确定 SPN，而是使用 DNS 响应的应答名称（Answer Name）。正常情况下，这两个应该是一致的。但如果攻击者能够篡改 DNS 响应，就可以构造一个包含中继目标的应答名称，并将记录指向攻击者的机器。这样，HTTP 客户端会请求中继目标的 ST，构造 AP-REQ，但将其发送到攻击者的机器。

**利用 LLMNR 协议**

LLMNR 是一种多播名称解析协议。Windows 客户端首先尝试通过标准 DNS 解析主机名，如果失败，则会回退到 LLMNR。由于 LLMNR 是多播协议，攻击者可以向多播范围内的任何客户端提供名称解析响应，前提是这些客户端无法通过标准 DNS 解析主机名。

**攻击步骤**

1.  攻击者在多播范围内设置 LLMNR 欺骗器。
2.  HTTP 客户端无法解析主机名。这可能是因为拼写错误、配置错误，或者攻击者通过 WebDav 强制认证触发。
3.  LLMNR 欺骗器指示主机名解析到攻击者的机器。在 LLMNR 响应中，应答名称与查询不同，对应于任意中继目标。
4.  受害者在攻击者的 Web 服务器上执行请求，该请求需要 Kerberos 认证。
5.  受害者请求中继目标的 SPN 的 ST。然后，它将生成的 AP-REQ 发送到攻击者的 Web 服务器。
6.  攻击者提取 AP-REQ，并将其中继到中继目标的服务。

### 实施方法

可以使用 Responder 工具进行多播欺骗。通过 `-N` 参数，可以指定 LLMNR 响应中返回的任意应答名称。至于 AP-REQ 的中继部分，可以使用 krbrelayx 工具。

**示例**

假设攻击者位于 `corp.com` 域中，其 Linux 机器 (192.168.123.16) 与 `ad01-wks1` 机器 (192.168.123.18) 位于同一多播范围内。域中有一台 PKI 服务器 `ad01-pki` (192.168.125.10)，启用了 Web 注册端点，但禁用了 NTLM 认证。攻击者未经过身份验证。现在，我们可以通过 HTTP 中继 Kerberos 认证来执行 ESC8 攻击。

**1. 机会性地响应失败的名称解析**

首先，攻击者使用 `-N` 标志运行 Responder，指示 LLMNR 响应应返回与 `ad01-pki` 对应的应答名称。

```bash
python3 Responder.py -I eth0 -N ad01-pki
```

现在，假设 `ad01-wks1` 机器上的 HTTP 客户端无法解析主机名。Responder 会向客户端提供一个被篡改的 LLMNR 响应，其中包含 `ad01-pki` 应答名称。

接下来，HTTP 客户端将被重定向到攻击者的机器，并在该机器上运行 krbrelayx 实例。客户端会请求 `HTTP/ad01-pki` 的 ST，并将相应的 AP-REQ 发送到我们的 Web 服务器，然后我们将中继该 AP-REQ 以在 PKI 上获取证书。

```bash
sudo python3 krbrelayx.py --target 'http://ad01-pki.corp.com/certsrv/' -ip 192.168.123.16 --adcs --template User -debug
```

**2. WebDav 认证强制**

同样的利用场景也适用于 WebDav 认证强制。这允许攻击者在多播范围内定位特定主机，而无需依赖拼写错误或配置错误，但需要身份验证和活动的 WebClient 服务。可以使用 PetitPotam 工具来触发从 `ad01-wks1` 机器到不存在的主机名 `IDONOTEXIST` 的 WebDav 请求。Responder 会返回一个 LLMNR 响应，欺骗应答名称，而 krbrelayx 会处理中继部分。

## 应用场景和局限性

**优势**

*   无需身份验证即可执行（通过标准多播欺骗）。
*   可以替代基于 DNS 的 Kerberos 中继。

**局限性**

*   受害者必须位于攻击者的多播范围内，并且必须启用 LLMNR。
*   其他本地名称解析协议（如 mDNS 和 NBTNS）无法用于实施攻击。
*   目标服务必须是不支持签名和密封的服务（例如 HTTP 服务）。

## 防御措施

*   禁用 LLMNR（如果不需要）。
*   在 Active Directory 服务级别实施反中继机制。
*   对于 HTTP 服务，强制使用 TLS 并启用 Extended Protection for Authentication。
