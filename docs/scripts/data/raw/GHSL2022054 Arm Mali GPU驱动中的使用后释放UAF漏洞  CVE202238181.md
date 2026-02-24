# GHSL-2022-054: Arm Mali GPU驱动中的使用后释放（UAF）漏洞 - CVE-2022-38181

## 概述

- **漏洞类型**: 使用后释放（Use-after-free, UAF）
- **受影响设备**: Pixel 6 和 Pixel 6 Pro
- **影响组件**: Arm Mali GPU驱动

## 技术背景

这个漏洞出现在Arm Mali GPU驱动中，具体来说，涉及到内存管理的部分。

### 关键点

1. **内存回收机制**:
   - 当系统面临内存不足时，内核会尝试释放内存以便重新分配。
   - 方法 `kbase_mem_evictable_reclaim_scan_objects` 负责扫描并释放内存中的对象。

2. **内存释放过程**:
   - 当大内存分配失败时，内核可能调用 `kbase_mem_evictable_reclaim_scan_objects`。
   - 该方法会从 `kbase_context` 的 `evict_list` 中释放内存。

3. **后续处理**:
   - 随后调用 `kbase_jit_backing_lost` 以将释放的内存加入到 `jit_destroy_head` 列表。

4. **引用问题**:
   - 新的内存区域可能通过 `kbase_jit_allocate` 被再次分配，并且在 `kbase_context::jit_alloc` 中保持引用。
   - 在该区域被释放时，引用未被移除，导致可能出现使用后释放的情况，从而引发安全问题。

## 联系信息

- **报告人**: GHSL团队成员 @m-y-mo (Man Yue Mo)
- **联系邮箱**: [securitylab@github.com](mailto:securitylab@github.com)
- 在交流中请提及GHSL-2022-054以便处理相关问题。

## Android安全团队的回复

- Android安全团队经过复审，认为这是设备特定问题，而非Android平台的安全漏洞。他们已将此报告转发给ARM进行调查和修复。
- 如果有额外信息需要反馈，请联系Android安全团队。

如需进一步了解本漏洞或获取帮助，请联系设备厂商的客户支持。