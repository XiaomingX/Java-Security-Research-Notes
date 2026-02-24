# GHSL-2023-229_GHSL-2023-230: Apache Kafka UI的远程代码执行漏洞

## 概述
Apache Kafka的用户界面（Kafka UI）存在两个远程代码执行（RCE）漏洞。这些漏洞可能允许恶意用户在未获得授权的情况下，在服务器上执行任意代码。

## 漏洞描述
1. **第一个漏洞**: 在消息过滤组件中，攻击者可以利用GROOVY_SCRIPT过滤器执行未受限制的Groovy脚本。  
   - 这个过滤器允许用户查看消息内容并执行任意代码，且没有安全沙箱保护。

   - **受影响的方法**: `com.provectus.kafka.ui.emitter.MessageFilters#groovyScriptFilter`

2. **第二个漏洞**: 通过Kafka UI连接到恶意的Java管理扩展（JMX）服务器，可以导致不安全的对象反序列化，进而执行任意代码。  
   - JMX基于远程方法调用（RMI）协议，容易受到反序列化攻击。

## 风险
- Kafka UI默认不启用身份验证，攻击者可以在没有有效账户的情况下发动攻击。如果启用了身份验证，攻击者仍需拥有有效账户。
  
## 攻击示例
- 攻击者可以通过发送特定的GET请求向应用程序发送恶意代码。
- 通过连接到伪造的JMX端口，攻击者可以返回恶意的序列化对象，从而触发代码执行。
  
## 技术细节
- 漏洞允许攻击者通过RMI请求设置系统属性`org.apache.commons.collections.enableUnsafeSerialization`为`true`。
- Kafka UI在尝试获取指标时会重新连接到JMX端口，导致另一个对象的反序列化，并最终执行恶意命令。

## 代码及进一步的阅读
- 如果想了解反序列化如何触发命令执行，可以查看以下类的源代码：
  - `Scala1.java`
  - `CommonsCollections7.java`
  
- 可在 `StreamRemoteCall.java#L271` 处设置断点以观察对象反序列化过程。

## 发现与报告
- 该漏洞由GHSL团队成员@artsploit（Michael Stepankin）发现并报告。
- 此外，Lars Thingstad（@Thingstad）和Daniel Christensen（@BobTheShoplifter）也独立发现了CVE-2023-52251，并在[此处](https://github.com/BobTheShoplifter/CVE-2023-52251-POC)发布了相关建议。

## 联系方式
如需进一步信息，请联系GHSL团队：securitylab@github.com，通信时请提及GHSL-2023-229或GHSL-2023-230。