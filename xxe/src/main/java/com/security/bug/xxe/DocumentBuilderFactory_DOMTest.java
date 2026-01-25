/*
 * [业务问题]: XML 外部实体注入 (XXE) 漏洞演示 - DOM 解析方式。
 * [实现逻辑]: 演示使用 DocumentBuilderFactory 进行 XML 解析时，若未正确配置安全特性，可能导致 XXE 漏洞，允许读取本地文件或发起 SSRF 攻击。
 */
package com.security.bug.xxe;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * XXE 漏洞演示 - DOM 方式 (DocumentBuilderFactory)。
 */
public class DocumentBuilderFactory_DOMTest {

  public static void main(String[] args)
      throws IOException, ParserConfigurationException, SAXException {
    DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();

    // todo 存在xxe漏洞
    DocumentBuilder builder = dbf.newDocumentBuilder();

    String FEATURE = null;
    FEATURE = "http://javax.xml.XMLConstants/feature/secure-processing";
    dbf.setFeature(FEATURE, true);
    FEATURE = "http://apache.org/xml/features/disallow-doctype-decl";
    dbf.setFeature(FEATURE, true);
    FEATURE = "http://xml.org/sax/features/external-parameter-entities";
    dbf.setFeature(FEATURE, false);
    FEATURE = "http://xml.org/sax/features/external-general-entities";
    dbf.setFeature(FEATURE, false);
    FEATURE = "http://apache.org/xml/features/nonvalidating/load-external-dtd";
    dbf.setFeature(FEATURE, false);
    dbf.setXIncludeAware(false);
    dbf.setExpandEntityReferences(false);

    // todo 修复需要把这行代码放在此处 DocumentBuilder builder = dbf.newDocumentBuilder();
    // DocumentBuilder builder = dbf.newDocumentBuilder();

    ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(Payloads.FEEDBACK.getBytes());
    Document d = builder.parse(byteArrayInputStream);
    System.out.println(d.getDocumentElement().getTextContent());
  }
}
