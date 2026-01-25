# Ysoserial - Java 反序列化利用工具

## 项目简述
这是 ysoserial 工具的本地副本，用于生成各种 Java 反序列化 gadget 链的恶意载荷。

## 核心功能
Ysoserial 是一个用于生成 Java 反序列化攻击载荷的工具集，支持多种常见的 gadget 链：
- CommonsCollections (1-7)
- Spring (1-2)
- C3P0
- Hibernate
- JDK (7u21, 8u20)
- 等等...

## 使用方法
```bash
# 编译
mvn clean package -DskipTests

# 生成载荷
java -jar ysoserial.jar [payload_type] '[command]'

# 示例
java -jar ysoserial.jar CommonsCollections6 'calc.exe'
```

## 注意事项
- 这是一个外部工具的副本，主要用于安全研究和测试
- 仅在授权的测试环境中使用
- 详细文档请参考原项目: https://github.com/frohoff/ysoserial
