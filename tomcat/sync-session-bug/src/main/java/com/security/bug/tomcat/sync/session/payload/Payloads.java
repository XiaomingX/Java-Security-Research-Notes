package com.security.bug.tomcat.sync.session.payload;

/**
 */
public enum Payloads {
    URLDNS(URLDNS.class),
    Jdk7u21(Jdk7u21.class),
    Jdk8u20(Jdk8u20.class),
    ;

    private Class<? extends Payload> clazz;

    Payloads(
        Class<? extends Payload> clazz) {
        this.clazz = clazz;
    }

    public Class<? extends Payload> getClazz() {
        return clazz;
    }
}
