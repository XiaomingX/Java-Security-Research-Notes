# Skills: Spring 安全笔记增强工具

## Skill 1: 自动生成业务溯源注释
针对输入的 Java 文件，必须在顶部生成如下格式的注释：
/*
 * [业务问题]: 描述该代码解决的具体业务需求或功能点。
 * [实现逻辑]: 简述核心代码逻辑、调用链路或使用的关键技术栈。
 */

## Skill 2: 漏洞深度分析
当识别到漏洞时，按以下格式在代码下方或独立文档中输出：
- **漏洞类型**: (例: SSRF / SQL Injection)
- **触发路径**: (描述 RequestMapping 到 Sink 点的调用链)
- **修复建议**: (给出安全编码建议，如使用 Safe Object 或 Filter)

## Skill 3: Maven 依赖审计
分析 `pom.xml`，识别过时的或存在已知 CVE 的组件，并建议升级版本。

## Skill 4: 代码风格对齐
- 确保符合 Spring Boot 启动类、Controller、Service、Repository 的分层规范。
- 自动补全必要的注解（如 @Slf4j, @RequiredArgsConstructor 等）。
