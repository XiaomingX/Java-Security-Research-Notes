# 通用工具库 (Common)

## 项目简述
本项目提供了一系列通用的安全研究工具类和辅助函数，被其他子项目广泛使用。

## 核心组件

### 1. 服务端工具
- **HTTPServer**: 简单的 HTTP 服务器，用于托管恶意文件
- **LdapServer**: LDAP 服务器，用于 JNDI 注入攻击
- **RmiServer**: RMI 服务器，用于 RMI 反序列化攻击

### 2. 工具类
- **Reflections**: 反射工具类，简化反射操作
- **Gadgets**: Gadget 链构造工具
- **TemplatesUtil**: TemplatesImpl 工具类
- **HttpUtil**: HTTP 请求工具

### 3. 内存马相关
- **TomcatShellInject**: Tomcat 内存马注入
- **TomcatEchoInject**: Tomcat 回显注入
- **ListenerShell**: Listener 型内存马
- **WebShell**: 通用 WebShell 实现

### 4. 表达式注入
- **ThymeleafSpelExp**: Thymeleaf SpEL 表达式注入

## 使用方法

### 作为依赖使用
其他子项目通过 Maven 依赖引用：
```xml
<dependency>
    <groupId>com.xyh</groupId>
    <artifactId>common</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

### 安装到本地仓库
```bash
cd common
mvn clean install
```

### 使用示例

#### 启动 HTTP 服务器
```java
HTTPServer.filePath = "/path/to/evil.yml";
HTTPServer.PORT = 8080;
HTTPServer.run(null);
```

#### 使用反射工具
```java
Object obj = Reflections.getFieldValue(target, "fieldName");
Reflections.setFieldValue(target, "fieldName", newValue);
```

#### 构造 TemplatesImpl
```java
Object templates = TemplatesUtil.createTemplatesImpl("calc");
```

## 项目结构
```
common/
├── src/main/java/
│   ├── com/security/bug/common/
│   │   ├── server/      # 服务端工具
│   │   └── utils/       # 工具类
│   ├── TomcatShellInject.java
│   ├── ListenerShell.java
│   └── ...
```

## 注意事项
1. 本模块是其他研究项目的基础依赖
2. 修改后需要重新 `mvn install` 才能被其他项目使用
3. 包含多个内存马实现，仅用于研究目的

## 编译安装
```bash
mvn clean install
```

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
