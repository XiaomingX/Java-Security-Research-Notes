# GHSL-2022-028: Codex-Team中的复制/粘贴跨站脚本攻击（XSS）

## 简介

在`codex-team/editor.js`中，当用户将特制内容复制并粘贴到编辑器时，存在跨站脚本攻击（XSS）的漏洞。

### 技术细节

- **受影响的版本**: Editor.js 2.24.2
- **问题描述**: `processHTML`方法将粘贴的内容直接传递给`wrapper`的`innerHTML`属性。这意味着恶意代码可以被注入和执行。
- **影响范围**: 使用editor.js的项目（如webiny/webiny-js、frappe/frappe和Jungwoo-An/react-editor-js）都可能受到此漏洞的影响。
