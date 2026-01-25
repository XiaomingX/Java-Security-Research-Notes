# CAS (Apereo Central Authentication Service) 安全研究

## 项目简述
本项目研究了 Apereo CAS 认证系统中的多个安全漏洞，包括 Padding Oracle 攻击和反序列化漏洞。

## 核心原理

### 1. Padding Oracle CBC 攻击
- **漏洞原理**: CAS 使用 CBC 模式加密 TGT (Ticket Granting Ticket)，若服务端在解密失败时返回不同的错误信息，攻击者可利用 Padding Oracle 攻击逐字节破解密文。
- **影响版本**: CAS 4.1.x - 4.2.x
- **利用方式**: 通过不断尝试不同的密文，根据服务端返回判断 padding 是否正确，最终还原出明文或伪造有效票据。

### 2. 反序列化漏洞
- **漏洞原理**: CAS 在处理 TGT 时使用 Java 原生序列化，若攻击者能控制序列化数据，可注入恶意 gadget 链触发 RCE。
- **影响版本**: 多个版本
- **利用链**: 主要使用 Commons Collections、Spring 等常见 gadget 链。

## 目录结构
```
cas/
├── 4.1.x-4.1.6/           # CAS 4.1.0 - 4.1.6 版本漏洞研究
├── 4.1.7-4.2.x/           # CAS 4.1.7 - 4.2.x 版本漏洞研究
├── 5.x/                   # CAS 5.x 版本研究
└── CAS4PaddingOracleCBC/  # Padding Oracle 攻击工具
```

## 使用方法

### 编译项目
```bash
cd cas/4.1.x-4.1.6
mvn clean compile
```

### 运行 Padding Oracle 攻击
```bash
cd CAS4PaddingOracleCBC
mvn clean package
java -jar target/cas-padding-oracle.jar <target_url> <encrypted_ticket>
```

### 运行反序列化攻击
```bash
cd 4.1.x-4.1.6
mvn exec:java -Dexec.mainClass="com.security.bug.cas.AttackDemo"
```

## 防御建议
1. **升级版本**: 升级到最新的 CAS 版本
2. **禁用不安全的加密模式**: 使用 GCM 等认证加密模式替代 CBC
3. **限制反序列化**: 使用白名单机制限制可反序列化的类
4. **统一错误信息**: 避免在解密失败时返回不同的错误信息

## 参考资料
- [CVE-2016-4465](https://nvd.nist.gov/vuln/detail/CVE-2016-4465)
- [Apereo CAS Security Advisories](https://apereo.github.io/cas/development/planning/Security-Guide.html)

## 免责声明
本项目仅用于安全研究和教育目的，请勿用于非法用途。
