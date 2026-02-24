# GHSL-2023-224: Arm Mali GPU Driver Memory Vulnerability - CVE-2023-6241

## 简介
在Arm Mali GPU驱动程序中，释放的 GPU 内存仍然可以被访问，导致安全漏洞。该问题被测试于 Pixel 8 设备，使用的是11月的安全补丁。

## 技术细节

- **影响配置**: 此漏洞存在于 `MALI_USE_CSF` 配置中。
- **漏洞机制**: 
  - 在分配即时编译（JIT）内存时，如果重用了之前释放的内存，就会调用 `kbase_jit_grow` 函数来扩展内存。
  - 在扩展内存时，临时放弃了两把锁（`kbase_gpu_vm_lock` 和 `mem_partials_lock`）。
  - 这段时间，GPU 页故障可能会尝试分配内存，进而可能修改 JIT 内存区域。

- **影响**: 
  - 改变了已提交页面的数量，导致后续操作时的内存大小不一致。
  - 攻击者可利用此漏洞，允许不受信任的应用程序执行任意内核代码。
  - 即使启用了内存标记扩展（MTE），此漏洞仍然可以被利用。

## 报告与联系
此问题由GHSL团队成员@m-y-mo（Man Yue Mo）发现并报告。

如需进一步信息，请通过 email 联系 GHSL 团队: securitylab@github.com，并在邮件中提及 GHSL-2023-224。