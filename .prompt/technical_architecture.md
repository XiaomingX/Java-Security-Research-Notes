# 技术架构文档 (Technical Architecture)

## 技术栈概览

### 当前技术栈分布
```
├── Java 生态 (主项目)
│   ├── Spring Boot / Spring Cloud
│   ├── Maven 构建系统
│   └── 各类安全组件（Shiro, CAS, Dubbo 等）
├── Python 生态 (ai-poc)
│   ├── Jupyter Notebooks
│   ├── LangChain / Haystack
│   └── OpenAI / Azure OpenAI
├── .NET 生态 (ai-poc/dotnet)
│   ├── Azure Functions
│   ├── Cognitive Search
│   └── Redis
└── Go 生态 (amass)
    └── OWASP Amass v4
```

## 过时技术识别与迁移计划

### [ ] 1. Python 依赖严重过时 (Critical)
**文件**：`ai-poc/requirements.txt`

**过时依赖**：
```python
openai==0.27.6          # 当前最新: 1.x (2024年重大重构)
langchain==0.0.158      # 当前最新: 0.3.x (API 大幅变化)
chromadb==0.3.21        # 当前最新: 0.5.x
ipykernel==6.4.1        # 当前最新: 6.29.x
```

**风险**：
- 安全漏洞风险（旧版本可能包含已知 CVE）
- API 不兼容（OpenAI 1.x 完全重写了客户端）
- 缺少新特性（如 LangChain 的 LCEL 表达式语言）

**迁移方案**：
```bash
# 建议使用 uv 管理依赖（符合全局标准）
[ ] 1. 创建 pyproject.toml
[ ] 2. 使用 uv pip compile 生成 uv.lock
[ ] 3. 更新依赖到最新稳定版本
[ ] 4. 测试并修复 API 变更
```

**预估工作量**：2-3 天（需要重写部分代码适配新 API）

### [ ] 2. Go 版本过时
**文件**：`amass/go.mod`
```go
go 1.19  // 当前最新: 1.23 (2024年发布)
```

**影响**：
- 缺少性能优化（Go 1.20+ 的 PGO 优化）
- 缺少新语法特性（如 range over func）
- 安全补丁缺失

**迁移方案**：
```bash
[ ] 1. 更新 go.mod 到 go 1.22 或 1.23
[ ] 2. 运行 go mod tidy
[ ] 3. 测试编译和运行
```

**预估工作量**：1 天（Go 向后兼容性好）

### [ ] 3. Apache POI 使用极度过时版本 (Security Risk)
**文件**：`apache-poi/cve-2014-3529/pom.xml`
```xml
<version>3.10-FINAL</version>  <!-- 2013年发布，当前最新: 5.3.x -->
```

**严重问题**：
- 该版本本身就是为了复现 CVE-2014-3529 漏洞
- 但项目中可能误用到其他地方，造成安全风险
- 缺少近 10 年的安全补丁

**处理方案**：
```bash
[ ] 1. 确认该依赖仅用于 CVE 复现，添加明确注释
[ ] 2. 隔离该模块，避免被其他项目依赖
[ ] 3. 在 README 中添加安全警告
[ ] 4. 考虑使用 Docker 容器隔离运行环境
```

### [ ] 4. 缺少依赖管理工具配置
**问题**：
- Python 项目未使用 `pyproject.toml` + `uv`（违反全局标准）
- Java 项目未配置 Dependabot 或 Renovate 自动更新依赖
- 缺少依赖安全扫描（如 Snyk, OWASP Dependency-Check）

**建议**：
```bash
[ ] 1. 为 ai-poc 添加 pyproject.toml
[ ] 2. 配置 GitHub Dependabot 自动检测过时依赖
[ ] 3. 集成 OWASP Dependency-Check 到 Maven 构建
[ ] 4. 添加 pre-commit hooks 检查依赖安全
```

### [ ] 5. .NET 项目架构不明确
**问题**：
- `ai-poc/dotnet` 包含 Azure Functions，但缺少部署配置
- 未说明与 Python 部分的关系（是替代方案？还是互补？）
- 缺少 CI/CD 配置

**建议**：
```bash
[ ] 1. 添加 .NET 项目的独立 README
[ ] 2. 说明技术选型理由（为什么同时有 Python 和 .NET）
[ ] 3. 添加 Azure 部署脚本或 Terraform 配置
[ ] 4. 考虑是否需要保留（如果不再使用，建议删除）
```

## 架构改进建议

### [ ] 1. 统一构建系统
**当前问题**：多种构建工具混用（Maven, pip, go mod, dotnet）

**建议方案**：
```bash
[ ] 1. 在根目录添加 Makefile 或 Taskfile，统一构建命令
[ ] 2. 示例：
    make build-java    # 构建所有 Java 项目
    make build-python  # 构建 Python 环境
    make build-go      # 构建 Go 工具
    make test-all      # 运行所有测试
```

### [ ] 2. 容器化隔离
**安全考虑**：漏洞 POC 不应在宿主机直接运行

**建议方案**：
```bash
[ ] 1. 为每个漏洞类型创建独立 Dockerfile
[ ] 2. 使用 Docker Compose 编排多个漏洞环境
[ ] 3. 添加网络隔离和资源限制
[ ] 4. 示例：
    docker-compose up shiro-cve-2016-4437
    docker-compose up fastjson-1.2.68
```

### [ ] 3. 代码规范统一
**当前问题**：缺少统一的代码风格和注释规范

**建议方案**：
```bash
[ ] 1. Java: 配置 Checkstyle + SpotBugs
[ ] 2. Python: 配置 ruff (替代 black + flake8 + isort)
[ ] 3. Go: 使用 golangci-lint
[ ] 4. 添加 .editorconfig 统一编辑器配置
```

### [ ] 4. 文档自动化
**利用现有 AI 能力**：

```bash
[ ] 1. 使用 ai-poc 的向量检索能力，构建"漏洞知识库"
[ ] 2. 自动从代码注释生成 API 文档
[ ] 3. 使用 LLM 自动生成漏洞原理说明
[ ] 4. 集成到 CI/CD，每次提交自动更新文档
```

## 技术债务清单

### 高优先级 (1-2 周内处理)
- [ ] 更新 Python 依赖到最新版本（安全风险）
- [ ] 为 Apache POI CVE 项目添加安全警告
- [ ] 添加 pyproject.toml 和 uv 配置
- [ ] 配置 Dependabot 自动检测过时依赖

### 中优先级 (1 月内处理)
- [ ] 更新 Go 版本到 1.22+
- [ ] 为 .NET 项目添加说明文档
- [ ] 统一构建系统（Makefile/Taskfile）
- [ ] 添加代码规范检查工具

### 低优先级 (长期优化)
- [ ] 容器化所有漏洞环境
- [ ] 构建漏洞知识库检索系统
- [ ] 集成 CI/CD 自动化测试
- [ ] 添加性能监控和日志系统

## 技术选型建议

### 推荐技术栈（符合全局标准）
```yaml
Python:
  包管理: uv
  配置文件: pyproject.toml
  锁文件: uv.lock
  代码检查: ruff + pyright

Java:
  构建工具: Maven
  代码检查: Checkstyle + SpotBugs
  依赖扫描: OWASP Dependency-Check

容器化:
  运行时: Docker + Docker Compose
  编排: 考虑 Kubernetes (如果需要大规模部署)

CI/CD:
  推荐: GitHub Actions
  备选: GitLab CI, Jenkins
```

## 架构演进路线图

### Phase 1: 技术债务清理 (1-2 月)
- 更新所有过时依赖
- 统一构建和开发环境
- 添加自动化检查工具

### Phase 2: 架构优化 (2-3 月)
- 容器化漏洞环境
- 构建知识库系统
- 集成 CI/CD

### Phase 3: 能力增强 (3-6 月)
- 开发 Web 界面
- 添加自动化测试
- 构建社区生态

---

**文档版本**：v1.0  
**最后更新**：2026-02-24  
**维护者**：技术团队  
**下次审查**：2026-03-24
