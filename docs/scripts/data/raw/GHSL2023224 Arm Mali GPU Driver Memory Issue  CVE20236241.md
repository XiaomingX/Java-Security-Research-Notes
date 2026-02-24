# GHSL-2023-224: Arm Mali GPU Driver Memory Issue - CVE-2023-6241

## 概述
在Arm Mali GPU驱动中，已释放的GPU内存仍然可以被访问。

## 影响设备
- 测试设备: Pixel 8（使用11月补丁）

## 技术细节
- **漏洞配置**: MALI_USE_CSF
- **内存分配**:
  - 当分配JIT内存时，如果使用了之前释放的内存，`kbase_jit_grow` 会被调用来增长内存。
  - 在增长内存的过程中，`kbase_gpu_vm_lock` 和 `mem_partials_lock` 会暂时被释放。
  
- **攻击场景**:
  - 在释放锁的期间，发生的GPU页面故障可以通过 `page_fault_try_alloc` 调用，导致JIT内存被改变。
  - 这会导致已提交页面的数量发生变化，从而导致分配页面和增长GPU映射时出现不一致。

## 潜在风险
- 此漏洞可能让不受信任的应用程序执行任意内核代码。
- 此漏洞在启用内存标记扩展（MTE）的设备上也可被利用。

## 举报信息
- 此问题由GHSL团队成员@m-y-mo（Man Yue Mo）发现并报告。

如需联系GHSL团队，请发送邮件至 securitylab@github.com，并在交流中包含GHSL-2023-224的参考信息。