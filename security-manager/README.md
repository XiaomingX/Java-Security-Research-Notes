# Java Security Manager 研究

## 项目简述
本项目研究了 Java Security Manager 的绕过技术和安全机制。

## Security Manager 简介
Java Security Manager 是 Java 提供的一种安全机制，用于限制代码的权限，防止恶意代码执行危险操作。

## 核心概念

### 1. 权限控制
Security Manager 通过策略文件定义不同代码源的权限：
- **文件访问权限**: FilePermission
- **网络访问权限**: SocketPermission
- **运行时权限**: RuntimePermission
- **属性访问权限**: PropertyPermission

### 2. 常见限制
- 禁止执行外部命令
- 禁止读写敏感文件
- 禁止创建类加载器
- 禁止修改系统属性

## 绕过技术

### 1. 反射绕过
通过反射访问受保护的方法和字段，绕过访问控制。

### 2. 利用白名单类
某些受信任的类可能存在漏洞，可被利用来执行危险操作。

### 3. 类加载器绕过
通过自定义类加载器加载不受限制的代码。

## 使用示例

### 启用 Security Manager
```bash
java -Djava.security.manager -Djava.security.policy=security.policy YourClass
```

### 策略文件示例
```
grant {
    permission java.io.FilePermission "/tmp/*", "read,write";
    permission java.net.SocketPermission "localhost:1024-", "listen,connect";
};
```

## 编译运行
```bash
cd security-manager
mvn clean compile
java -Djava.security.manager -jar target/security-manager.jar
```

## 安全建议
1. **谨慎配置策略**: 遵循最小权限原则
2. **定期审计**: 检查策略文件配置
3. **使用容器化**: 在容器环境中运行不受信任的代码
4. **注意**: Java 17+ 已弃用 Security Manager

## 参考资料
- [Java Security Manager](https://docs.oracle.com/javase/tutorial/essential/environment/security.html)
- [JEP 411: Deprecate the Security Manager for Removal](https://openjdk.org/jeps/411)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
