# GHSL-2022-008: OWASP 企业安全 API (ESAPI) 的路径遍历漏洞 - CVE-2022-23457

## 漏洞描述
在 `getValidDirectoryPath` 方法中，父目录的兄弟目录被错误地当作子目录处理。

## OWASP 企业安全 API (ESAPI)
- 当前版本：v2.2.3.1（这是“传统”2.x 版本的最新版本，因为 ESAPI 3.x 仍在初期开发中，尚未发布）

## 技术细节
- `parent` 参数：`getValidDirectoryPath` 方法的第三个参数，用于验证输入路径是否在指定的父目录内。
- 对于路径检查的逻辑来说，如果 `parent.getCanonicalPath()` 结果没有以斜杠结束，将允许部分路径遍历。

### 示例
考虑以下代码示例：
```java
"/usr/outnot".startsWith("/usr/out")
```
- 在这段代码中，虽然 `outnot` 并不在 `out` 目录下，但路径检查仍然通过了。

### 斜杠处理的问题
- 在不同情况下，根目录的斜杠可能会被去掉。例如：
  - `println(new File("/var/"))` 输出: `/var`
  - `println(new File("/var", "/"))` 输出: `/var/`
  - `println(new File("/var", "/").getCanonicalPath())` 输出: `/var`

## 漏洞影响
这个漏洞允许攻击者突破预期的目录限制。

## 报告信息
这个问题是由 GHSL 团队成员 @JarLob (Jaroslav Lobačevski) 发现并报告的。如需联系 GHSL 团队，可以发送邮件至 securitylab@github.com，在任何与此问题相关的交流中，请包含 GHSL-2022-008 的引用。