# GHSL-2022-054: Arm Mali GPU驱动中的使用后释放（Use-after-free，UAF）漏洞 - CVE-2022-38181

## 简介

这是一个影响Pixel 6和Pixel 6 Pro的漏洞，位于Arm Mali GPU驱动中。

## 技术背景

- **受影响设备**: Pixel 6
- **漏洞描述**: 在内存紧张时，内核会尝试释放一些内存，以便能够分配更多页面。这一过程涉及到一个叫做`kbase_mem_evictable_reclaim_scan_objects`的方法。

### 漏洞发生过程

1. **内存压力**: 当可用内存不足时，内核会调用已注册的回收器来尝试释放内存。
2. **内存回收**: `kbase_mem_evictable_reclaim_scan_objects`方法会释放与某个内存区域相关的后备页面。
3. **释放后区域**: 紧接着会调用`kbase_jit_backing_lost`来处理释放的内存区域。
4. **引用保持**: 一个新的内存区域（`kbase_va_region`）可以通过`kbase_jit_allocate`进行分配，并在`kbase_context::jit_alloc`中保持引用。 
5. **引发漏洞**: 当原本已经释放的内存区域仍然持有引用时，后续使用这个区域会造成“使用后释放”的问题。
