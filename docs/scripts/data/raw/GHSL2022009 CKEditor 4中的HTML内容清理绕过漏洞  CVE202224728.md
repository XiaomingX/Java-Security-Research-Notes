# GHSL-2022-009: CKEditor 4中的HTML内容清理绕过漏洞 - CVE-2022-24728

CKEditor 4的HTML内容清理功能存在一个绕过漏洞，可以在浏览器中执行JavaScript代码。该漏洞与CVE-2021-41165非常相似，使用了相同的攻击方式。

## CKEditor 4简介

- **版本**: 4.17.1
- **功能**: CKEditor 4有一个“源代码”按钮，用户可以在所见即所得（WYSIWYG）编辑和原始HTML编辑模式之间切换。

## 漏洞原理

1. **切换模式**:
   - 用户切换到源代码模式，编辑原始HTML，然后重新切换回WYSIWYG模式。
   - CKEditor会尝试清理HTML，防止插入可执行的JavaScript代码。

2. **绕过清理**:
   - 虽然CKEditor增强了清理逻辑，但仍然可以通过特定的HTML输入绕过清理。这包括：
     - **包含字符串**: 使用"cke_temp(comment)"来触发特定的正则表达式，从而防止CKEditor将<script>元素包装成{cke_protected}注释。
     - **使用data-cke-filter属性**: 该属性触发早期返回，阻止正常的清理过程。
   
## 漏洞测试步骤

1. 在浏览器中打开`ckeditor4/samples/index.html`。
2. 点击“源代码”按钮。
3. 将原始HTML替换为特定的HTML代码。
4. 再次点击“源代码”按钮。
5. 你应该会看到一个警告弹窗，表明JavaScript代码成功执行。

## 影响

此漏洞使攻击者能够绕过HTML清理，注入并执行JavaScript代码。

## 报告信息

- **发现者**: GHSL团队成员 @kevinbackhouse (Kevin Backhouse)
- **感谢**: @wbowling (William Bowling) 提供了有价值的技术细节。

如需进一步信息，请联系GHSL团队，邮箱: securitylab@github.com，并在邮件中提及GHSL-2022-009。