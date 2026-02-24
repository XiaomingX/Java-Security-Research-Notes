# GHSL-2022-008: OWASP 企业安全 API (ESAPI) 中的路径遍历漏洞 - CVE-2022-23457

## 概述
在 OWASP 企业安全 API (ESAPI) 的 `getValidDirectoryPath` 函数中，存在一个漏洞，该漏洞错误地将根目录的兄弟目录视为其子目录。

## 技术背景

### OWASP 企业安全 API (ESAPI)
- 版本：v2.2.3.1（这是“传统” 2.x 版本的最新版本，ESAPI 3.x 仍在早期开发阶段，尚未发布。）
  
### `getValidDirectoryPath` 的参数
- `parent` [1]：该函数的第三个参数，用于验证输入路径 [2] 是否在指定的父目录 [3] 内。

### 漏洞细节
- 当 `parent.getCanonicalPath()` 返回的路径未以斜杠结尾时，可能会导致部分路径遍历漏洞。
- 示例：`"/usr/outnot".startsWith("/usr/out")` 通过检查，尽管 `outnot` 实际上不在 `out` 目录下。
- 斜杠可能在不同地方被移除：
  - 在 Linux 上，`println(new File("/var/"))` 返回 `/var`。
  - `println(new File("/var", "/"))` 返回 `/var/`。
  - `println(new File("/var", "/").getCanonicalPath())` 返回 `/var`。
  
### 影响
- 这个漏洞允许用户跳出预期的目录，可能导致安全问题。

## 报告者
- 此问题由 GHSL 团队成员 @JarLob (Jaroslav Lobačevski) 发现并报告。

## 联系方式
如需更多信息，请联系 GHSL 团队：securitylab@github.com，并在相关沟通中提及 GHSL-2022-008。