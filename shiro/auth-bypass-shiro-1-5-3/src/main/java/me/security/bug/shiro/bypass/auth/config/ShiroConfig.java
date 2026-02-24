/*
 * [业务问题]: Shiro 1.5.3 认证绕过漏洞配置。
 * [实现逻辑]: 配置 Shiro 过滤器链，演示路径匹配缺陷导致的认证绕过。
 */
package me.security.bug.shiro.bypass.auth.config;

import java.util.LinkedHashMap;
import java.util.Map;
import me.security.bug.shiro.bypass.auth.realm.MyRealm;
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
        map.put("/bypass/*", "authc");
        bean.setFilterChainDefinitionMap(map);
        return bean;
    }
}
