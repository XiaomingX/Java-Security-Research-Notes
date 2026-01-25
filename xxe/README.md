# XML 外部实体注入 (XXE) 漏洞研究

## 项目简述
本项目系统性研究了 Java 中各种 XML 解析器的 XXE 漏洞及其防御方法。

## 核心原理
1. **XXE 漏洞**: 当 XML 解析器处理包含外部实体引用的 XML 文档时，若未禁用外部实体解析，攻击者可以：
   - 读取服务器本地文件
   - 发起 SSRF 攻击
   - 造成拒绝服务 (DoS)
2. **常见解析器**:
   - **DOM**: DocumentBuilderFactory
   - **SAX**: SAXParserFactory, XMLReader
   - **JDOM**: SAXBuilder
   - **DOM4J**: SAXReader
   - **JAXB**: Unmarshaller
   - **其他**: TransformerFactory, SchemaFactory, Validator

## 防御方法
对于每种解析器，需要设置特定的安全特性来禁用外部实体：
```java
// 示例：DocumentBuilderFactory
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

## 如何验证
1. 编译项目: `mvn clean compile`
2. 运行各个测试类（如 `DocumentBuilderFactory_DOMTest`）
3. 观察是否能成功读取外部实体或触发 SSRF
