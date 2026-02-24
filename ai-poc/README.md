# AI POC - 生成式 AI 原型验证项目

## 项目概述

本项目是一个综合性的生成式 AI 原型验证（Proof of Concept）项目，专注于探索和实现基于大语言模型（LLM）的文档智能问答系统。项目采用 RAG（检索增强生成）架构，结合向量检索和语义搜索技术，实现对大规模文档的智能查询和问答。

## 核心技术栈

### Python 生态
- **OpenAI API** (0.27.6) - GPT 模型调用
- **LangChain** (0.0.158) - LLM 应用开发框架
- **ChromaDB** (0.3.21) - 向量数据库
- **Haystack** - 文档检索和问答框架
- **FAISS** - Facebook AI 相似性搜索库

### .NET 生态
- **Azure Functions** - 无服务器计算
- **Azure Cognitive Search** - 企业级搜索服务
- **Redis** - 缓存和数据存储

### 开发环境
- **Jupyter Notebook** - 交互式开发和实验
- **VS Code Dev Container** - 容器化开发环境

## 项目结构

```
ai-poc/
├── LangChain/              # LangChain 框架实验
│   ├── agent.ipynb         # Agent 代理实现
│   ├── agent_custom_tool.ipynb  # 自定义工具集成
│   ├── chains.ipynb        # 链式调用示例
│   └── Single_Source.ipynb # 单一数据源问答
├── Haystack/               # Haystack 框架实验
│   └── QA-Demo/            # 问答系统演示
├── Microsoft/              # Azure 服务集成
│   └── Untitled.ipynb      # Azure OpenAI 实验
├── dotnet/                 # .NET 实现
│   ├── CognitiveSearch/    # Azure 认知搜索
│   ├── Domain/             # 领域模型
│   ├── GenerativeAi.Functions/  # Azure Functions
│   └── Redis/              # Redis 集成
├── src/                    # 核心实现
│   ├── ingestion.ipynb     # 数据摄取流程
│   └── question.ipynb      # 问答实现
├── Understanding-Python/   # Python 学习资源
├── doc/                    # 项目文档
├── requirements.txt        # Python 依赖
└── README.md              # 本文件
```

## 核心功能

### 1. RAG（检索增强生成）架构

**数据摄取流程（Ingestion）：**
1. 文档解析：将 PDF/Word 等文档转换为纯文本
2. 文本分块：按章节、段落或语义单元分割
3. 向量化：使用 Embedding 模型生成向量表示
4. 存储：将向量和元数据存入向量数据库

**问答流程（Question Answering）：**
1. 问题向量化：将用户问题转换为向量
2. 相似度检索：从向量数据库中检索最相关的文本块
3. 上下文构建：将检索结果组装为 LLM 的上下文
4. 答案生成：LLM 基于上下文生成准确答案

### 2. 多框架对比实验

- **LangChain**：灵活的 LLM 应用开发框架，支持 Agent、Chain、Memory 等高级特性
- **Haystack**：专注于文档检索和问答的端到端框架
- **Azure Cognitive Search**：企业级云原生搜索解决方案

### 3. 向量数据库集成

- **ChromaDB**：轻量级向量数据库，适合快速原型验证
- **FAISS**：高性能向量相似度搜索库
- **Azure Cognitive Search**：支持向量检索的云服务

## 快速开始

### 环境要求

- Python 3.8+
- .NET 6.0+ (可选，用于 Azure Functions)
- Azure 订阅 (可选，用于云服务)

### 安装依赖

⚠️ **注意**：当前 `requirements.txt` 中的依赖版本已过时，建议升级到最新版本。

```bash
# 使用 pip（不推荐，依赖版本过时）
pip install -r requirements.txt

# 推荐：使用 uv 管理依赖（需先创建 pyproject.toml）
# 参考 .prompt/technical_architecture.md 中的迁移指南
```

### 配置 API 密钥

创建 `.env` 文件并配置以下环境变量：

```bash
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Azure OpenAI (可选)
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Google Search (可选)
SERPAPI_API_KEY=your_serpapi_key
```

### 运行示例

#### 1. LangChain 单一数据源问答

```bash
jupyter notebook LangChain/Single_Source.ipynb
```

#### 2. 数据摄取流程

```bash
jupyter notebook src/ingestion.ipynb
```

#### 3. 问答系统

```bash
jupyter notebook src/question.ipynb
```

## 技术亮点

### 1. 智能文档检索

突破传统关键词搜索（Ctrl+F）的局限，通过语义理解实现：
- 同义词识别
- 上下文理解
- 跨段落推理

### 2. 上下文窗口优化

解决 LLM token 限制问题：
- 动态文本分块
- 相关性排序
- 上下文压缩

### 3. 多模态支持

- PDF 文档解析
- 表格数据提取
- 图片 OCR（通过 Azure Form Recognizer）

## 应用场景

### 1. 企业知识库问答
- 员工手册查询
- 技术文档检索
- 政策法规解读

### 2. 医疗领域
- 药品说明书查询
- 临床指南检索
- 病例分析辅助

### 3. 法律合规
- 合同条款检索
- 法律法规查询
- 案例分析

### 4. 学术研究
- 论文文献检索
- 研究方法查询
- 数据集发现

## 已知问题与改进计划

### 高优先级（Critical）

- [ ] **依赖版本过时**：OpenAI 0.27.6 → 1.x，LangChain 0.0.158 → 0.3.x
  - 参考：`.prompt/technical_architecture.md` 中的迁移方案
  - 预计工作量：2-3 天

- [ ] **缺少依赖管理**：未使用 `pyproject.toml` + `uv`
  - 违反全局工程标准
  - 需要创建 `pyproject.toml` 并迁移依赖

### 中优先级

- [ ] **技术栈定位不清**：Python 和 .NET 实现并存，缺乏说明
- [ ] **缺少单元测试**：所有代码均为 Notebook，无自动化测试
- [ ] **文档不完整**：缺少 API 文档和使用指南

### 低优先级

- [ ] **性能优化**：向量检索速度、批处理优化
- [ ] **UI 界面**：开发 Web 界面替代 Notebook
- [ ] **多语言支持**：增强中文语义理解能力

## 学习资源

详见 [resources.md](resources.md) 和 [knowledge_share.md](knowledge_share.md)，包含：

- Azure OpenAI 教程
- 向量数据库原理
- Transformer 模型解析
- RAG 架构最佳实践
- Prompt Engineering 技巧

## 安全与隐私

⚠️ **重要提示**：

1. **数据隐私**：不要将敏感数据上传到公共 LLM API
2. **答案准确性**：LLM 可能产生幻觉（Hallucination），答案需人工验证
3. **API 密钥**：不要将 API 密钥提交到版本控制
4. **成本控制**：注意 API 调用成本，设置使用限额

## 贡献指南

欢迎提交 Issue 和 Pull Request。贡献时请遵循：

1. 代码需符合 PEP 8 规范（Python）或 .NET 编码规范
2. 添加必要的注释和文档
3. 更新相关的 Notebook 示例
4. 测试代码在本地环境可正常运行

## 许可证

本项目采用 [LICENSE](LICENSE) 中指定的许可证。

## 联系方式

- 项目维护者：参考 Git 提交历史
- 问题反馈：通过 GitHub Issues
- 技术讨论：参考 `knowledge_share.md` 中的 Slack 频道

---

**最后更新**：2026-02-24  
**项目状态**：原型验证阶段（POC）  
**下一步计划**：依赖升级 → 生产化改造 → 性能优化
