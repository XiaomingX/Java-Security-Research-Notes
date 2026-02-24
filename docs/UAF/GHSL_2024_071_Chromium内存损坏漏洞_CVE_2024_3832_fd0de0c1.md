# GHSL-2024-071: Chromium内存损坏漏洞 - CVE-2024-3832

在受影响版本的Chrome浏览器中，访问恶意网站可能导致Chrome渲染器中的对象损坏。

## 受影响的版本
- Chromium版本：123.0.6312.58

## 问题描述
- 为了防止之前的问题（如CVE-2021-30561），引入了一些机制，但这些机制不够有效。
- 在`InstallConditionalFeatures`中，引入了一项检查，确保WebAssembly对象在添加属性之前没有相关属性。

## 技术细节
1. **WebAssembly检查**：检查涉及全局WebAssembly对象（1和2），但在使用`InstallSuspenderConstructor`安装属性时，检查的是`context->wasm_webassembly_object()`（3），这可能与全局WebAssembly对象不相同。
   
2. **属性设置冲突**：
   - 首先在WebAssembly对象上设置Suspender属性，然后将全局WebAssembly更改为其他对象。
   - 这时，属性名称检查将针对新分配的WebAssembly对象进行，而属性将被添加到已有Suspender对象的`context->wasm_assembly_object()`中。

3. **后果**：这会导致一个损坏的对象，出现重复的Suspender属性。

4. **影响**：该问题也会影响`InstallTypeReflection`函数，当在函数中安装属性时可能出现问题。

## 安全建议
- 由于这个问题可能导致Chrome渲染器的内存损坏，建议用户尽快更新到修复版本的浏览器。

## 举报信息
- 此问题由GHSL团队成员@ m-y-mo（Man Yue Mo）发现并报告。
- 如需进一步信息，请联系GHSL团队：securitylab@github.com，并在相关通信中提及GHSL-2024-071。