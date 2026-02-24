# GHSL-2023-205_GHSL-2023-206: Go2rtc的XSS和命令执行漏洞

## 概述

Go2rtc 存在跨站脚本（XSS）和任意命令执行漏洞，原因是未对用户输入进行清理。

### 相关漏洞

- **CVE-2024-29191**: XSS漏洞
- **CVE-2024-29192**: XSS漏洞
- **CVE-2024-29193**: 任意命令执行漏洞

## 技术细节

### XSS漏洞

- **触发条件**：
  - 在 `links.html` 页面中，使用 `src` GET 参数显示链接。
  - `src` 参数通过 `innerHTML` 直接插入，这可能导致DOM级别的XSS攻击。

- **示例Payload**：
  ```html
  foo">foo</a></li><img src="x" onerror="alert(document.location)"><!--
  ```

- **进一步影响**：
  - 在 `index.html` 页面，使用 API 拉取可用流，并通过 `innerHTML` 显示流的名称，存在相似的XSS风险。

### 任意命令执行漏洞

- **漏洞描述**：
  - `/api/config` 端点允许用户修改配置，未对请求做CSRF保护。
  - 攻击者可以利用此缺陷，通过添加自定义流实现任意命令执行。

### 利用方式

- **驱动攻击（Drive-by attack）**：
  - 设置一个服务器，托管特定的代码片段。
  - 当受害者访问该服务器时，其浏览器会向 Go2rtc 实例发起请求，可能导致XSS执行和任意命令执行。

## 发现和报告

- 这些问题是由 GHSL 团队成员 @jorgectf 和 @maclarel 发现并报告的。
