# GHSL-2023-154_GHSL-2023-156: memos API中的服务器端请求伪造 (SSRF) 和跨站脚本 (XSS) 漏洞 - CVE-2024-29028, CVE-2024-29029, CVE-2024-29030

## 概述

在 **memos** API 服务中发现了多个 **SSRF** 漏洞，这些漏洞允许用户（无论是未认证还是已认证）访问和读取内部网络信息。此外，一个SSRF漏洞导致了一个反射型 **XSS** 漏洞，攻击者可能会因此完全控制管理员账户。

## 技术基础知识

### 服务器端请求伪造（SSRF）

- SSRF 漏洞让攻击者能够通过特制请求访问服务器的内部网络。
- 这些漏洞可能导致信息泄露。

### 跨站脚本（XSS）

- XSS 漏洞允许攻击者注入恶意脚本，可能导致账户权限提升。
- 例如，攻击者可以使管理员账户的密码被更改。

## 详细说明

1. **未认证的 SSRF 漏洞**：
   - 路径：`/o/get/httpmeta`
     - 影响：未认证用户可以列举内部网络并接收部分HTML信息（以JSON格式）。
   - 路径：`/o/get/image`
     - 影响：未认证用户可以列举内部网络并获取图像，同时引发反射型 XSS 漏洞。

2. **已认证的 SSRF 漏洞**：
   - 路径：`/api/resource`
     - 影响：已认证用户可以列举内部网络。

## 漏洞验证示例

### SSRF 示例

- **访问未认证的端点**：
  ```bash
  curl http://0.0.0.0:5230/o/get/<endpoint>?url=<full url>
  ```

- **访问已认证的端点**：
  登录到memos -> 资源 -> 创建资源 -> 选择外部链接，输入完整URL以执行列举。确保请求中 `downloadToLocal` 的值为 `true`。

### XSS 示例

攻击者可以托管以下 **SVG** 文件。如果用户（管理员或普通用户）点击以下链接：
```plaintext
http://0.0.0.0:5230/o/get/image?url=<attacker controlled svg file url>
```
用户账户的密码将被更改为"password"，攻击者可以进行登录。

```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
```
