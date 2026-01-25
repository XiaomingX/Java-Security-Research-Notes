# Apache POI 安全研究

## 项目简述
本项目研究了 Apache POI 库中的安全漏洞，主要关注 XXE (XML External Entity) 注入漏洞。

## 核心漏洞

### CVE-2014-3529 - XXE 漏洞
- **漏洞描述**: Apache POI 在解析 Office 文档（如 .xlsx, .docx）时，未正确禁用外部实体解析，导致 XXE 漏洞。
- **影响版本**: Apache POI < 3.10.1
- **危害**: 
  - 读取服务器本地文件
  - 发起 SSRF 攻击
  - 拒绝服务 (DoS)

## 漏洞原理
Office Open XML 格式文档本质上是 ZIP 压缩包，内部包含多个 XML 文件。当 POI 解析这些 XML 文件时，如果未禁用外部实体，攻击者可在 XML 中注入恶意实体引用。

## 利用示例
```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>
```

## 防御方法
```java
// 禁用外部实体解析
XMLInputFactory factory = XMLInputFactory.newInstance();
factory.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
factory.setProperty(XMLInputFactory.SUPPORT_DTD, false);
```

## 使用方法
```bash
cd apache-poi/cve-2014-3529
mvn clean compile
mvn exec:java -Dexec.mainClass="com.security.bug.poi.XXETest"
```

## 参考资料
- [CVE-2014-3529](https://nvd.nist.gov/vuln/detail/CVE-2014-3529)
- [Apache POI Security](https://poi.apache.org/help/index.html)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
