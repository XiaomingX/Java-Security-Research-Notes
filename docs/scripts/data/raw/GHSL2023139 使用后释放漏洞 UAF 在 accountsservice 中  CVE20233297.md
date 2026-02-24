# GHSL-2023-139: 使用后释放漏洞 (UAF) 在 accountsservice 中 - CVE-2023-3297

## 概述

- **漏洞类型**: 使用后释放 (Use After Free, UAF)
- **影响软件**: accountsservice
- **受影响版本**: 22.08.8-1ubuntu7 (Ubuntu 22.04 LTS 和 23.04)

## 漏洞描述

一个未授权的本地攻击者可以通过向 accounts-daemon 进程发送 D-Bus 消息来触发该 UAF 漏洞。

### D-Bus 协议

- D-Bus 服务器在接收到方法调用后，应该返回 `METHOD_RETURN` 或 `ERROR` 消息，但不能同时返回这两种。
- 在 accountsservice 中，多处实现不当，导致同时返回这两种消息。

### 漏洞细节

以 `user_change_language_authorized_cb` 为例：

1. 当 `user_HOME_available` 返回错误时，会调用 `throw_error` 发送 `ERROR` 消息。
2. 然后，又发送了一个正常的 `METHOD_RETURN`。
3. 这导致了错误 (UAF)，因为 `throw_error` 和 `accounts_user_complete_set_language` 都减少了 `context` 的引用计数。
4. 因此，`context` 被释放后，接下来的访问将出错。

攻击者可以通过删除自己主目录中的所有文件，使 `user_HOME_available` 失败，从而触发该漏洞。此外，其他地方的 `throw_error` 使用不当也可能导致类似问题。

### 环境差异

- **Ubuntu 23.04**: 通过特定命令会导致 `accounts-daemon` 崩溃，出现 SIGSEGV 错误。
- **Ubuntu 22.04 LTS**: 相应命令不会有明显的影响。
- **原因**: GLib 内存分配的变化使得不同版本的内存释放行为不同，导致 UAF 结果的差异。

## 安全影响

虽然利用这个漏洞的难度较大，但它可能允许一个本地未授权的攻击者获得 root 权限。

## 联系信息

该漏洞由 GHSL 团队成员 @kevinbackhouse 发现并报告。如需进一步交流，请通过 securitylab@github.com 与 GHSL 团队联系，并在通信中引用 GHSL-2023-139。