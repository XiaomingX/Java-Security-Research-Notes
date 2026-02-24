# GHSL-2022-009: CKEditor 4 HTML内容清理绕过漏洞（CVE-2022-24728）

在CKEditor 4中，HTML内容的清理功能存在漏洞，允许执行JavaScript代码。此漏洞类似于CVE-2021-41165，并使用了相同的攻击方式。

## CKEditor 4简介

- **版本**: 4.17.1
- **功能**: CKEditor 4有一个“源代码”按钮，用户可以在所见即所得（WYSIWYG）编辑和原始HTML编辑模式之间切换。当用户从原始HTML模式切换回所见即所得模式时，CKEditor 4会尝试清理HTML，以阻止插入可执行的JavaScript代码。

## 漏洞细节

尽管CKEditor 4对清理逻辑进行了改进，但仍然可以绕过安全检查。攻击者可以通过以下步骤实现：

1. **使用特殊字符串**: 输入字符串“cke_temp(comment)”，这会触发特定的正则表达式，
   - 这可以阻止CKEditor 4将`<script>`元素包装在`{cke_protected}`注释中。
   
2. **添加特定属性**: 使用`data-cke-filter`属性，触发CKEditor 4的早期返回逻辑。

## 漏洞利用步骤

1. 在浏览器中打开`ckeditor4/samples/index.html`。
2. 点击“源代码”按钮。
3. 用以下原始HTML替换现有内容：
   ```html
   <script>alert('This is a test');</script>
   ```
4. 再次点击“源代码”按钮。
5. 如果一切正常，你将看到一个警告弹窗。

## 安全影响

此漏洞使攻击者能够绕过CKEditor 4的清理逻辑，从而注入并执行JavaScript代码，可能导致安全风险。

## 报告信息

该漏洞由GHSL团队成员@kevinbackhouse发现。感谢@wbowling（William Bowling）提供关于CVE-2021-41165的额外技术细节。

如需联系GHSL团队，请发送电子邮件至securitylab@github.com，并在相关通信中引用GHSL-2022-009。