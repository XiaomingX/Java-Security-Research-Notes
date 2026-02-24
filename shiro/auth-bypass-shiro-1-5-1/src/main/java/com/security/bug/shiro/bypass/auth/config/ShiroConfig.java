/*
 * [业务问题]: Shiro 安全配置，包含易受攻击的路径匹配策略。
 * [实现逻辑]: 配置 Shiro 的过滤器链，演示如何通过特定路径匹配（如 "/aaaaa/**"）实现对受限路径的绕过。
 */
package com.security.bug.shiro.bypass.auth.config;

import com.security.bug.shiro.bypass.auth.realm.MyRealm;
import java.util.LinkedHashMap;
import java.util.Map;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Shiro 配置类。
 */
@Configuration
public class ShiroConfig {
    @Bean
    MyRealm myRealm() {
        return new MyRealm();
    }

    @Bean
    SecurityManager securityManager() {
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
        manager.setRealm(myRealm());
        return manager;
    }

    @Bean
    ShiroFilterFactoryBean shiroFilterFactoryBean() {
        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
        bean.setSecurityManager(securityManager());
        bean.setLoginUrl("/login");
        bean.setSuccessUrl("/index");
        bean.setUnauthorizedUrl("/unauthorizedurl");
        Map<String, String> map = new LinkedHashMap<>();
        map.put("/login", "anon");
        map.put("/aaaaa/**", "anon");
        map.put("/bypass", "authc");
        map.put("/bypass.*", "authc");
        map.put("/bypass/**", "authc");
        map.put("/**", "authc");
        bean.setFilterChainDefinitionMap(map);
        return bean;
    }
}
