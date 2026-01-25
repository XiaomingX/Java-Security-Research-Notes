/*
 * [业务问题]: Apache Shiro 身份认证绕过漏洞验证 (CVE-2020-1957)。
 * [实现逻辑]: 演示由于 Shiro 与 Spring Web 对 URL 归一化处理不一致导致的绕过，利用 "/aaaaa/..;/bypass" 等路径特征在 Shiro 层匹配到 anon 权限，而在 Spring 层转发至受保护的接口。
 */
package com.security.bug.shiro.bypass.auth.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * Shiro 认证绕过漏洞测试接口。
 */
@RestController
public class BypassTestController {

    /**
     * @return
     */
    @RequestMapping(value = "/bypass", method = RequestMethod.GET)
    public String bypass() {
        return "bypass1";
    }
}
