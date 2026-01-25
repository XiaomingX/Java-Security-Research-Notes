package com.security.bug.tomcat.sync.session.payload;

/**
 */
public interface Payload {
    Object getObject(String... command) throws Exception;
}
