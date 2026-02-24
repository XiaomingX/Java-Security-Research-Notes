# GHSL-2024-070: 在Chromium中存在远程代码执行漏洞 - CVE-2024-3833

在受影响的Chrome版本中，访问恶意网站可能会导致对象损坏，攻击者可以利用这一点在Chrome的渲染器中执行恶意代码。

### 受影响的Chromium版本
- **Chromium版本**: 123.0.6312.58

### 技术细节
1. **InstallConditionalFeatures**: 该功能会检查WebAssembly对象中是否存在Function属性，以防止对象中添加重复属性。
2. **InstallTypeReflection**: 该功能同样为其他对象添加属性，但没有进行重复性检查。这意味着：
   - 比如在`wasm_table_constructor`的原型中添加`type`属性时，没有检查该属性是否已存在。
   - 这导致了对象中出现重复属性的问题（例如：问题编号40056206）。

### 漏洞利用
攻击者可以利用上述问题，在Chrome的渲染器中获得远程代码执行权限（RCE）。

### 报告信息
该漏洞是由GHSL团队的成员@ m-y-mo（Man Yue Mo）发现和报告的。若需联系GHSL团队，请发送邮件至securitylab@github.com，并在通信中提及GHSL-2024-070。