![Fix Shell](https://cdn.fix.security/assets/fixinventory/fixinventory-search-multiple.gif)

[![最新版本](https://img.shields.io/github/v/tag/someengineering/fixinventory?label=latest)](https://github.com/someengineering/fixinventory/tags/)
[![构建状态](https://img.shields.io/github/actions/workflow/status/someengineering/fixinventory/docker-build.yml)](https://github.com/someengineering/fixinventory/commits/main)
[![文档](https://img.shields.io/badge/docs-latest-<COLOR>.svg)](https://inventory.fix.security/docs)
[![Discord](https://img.shields.io/discord/778029408132923432?label=discord)](https://discord.gg/fixsecurity)
[![已知漏洞](https://img.shields.io/snyk/vulnerabilities/github/someengineering/fixinventory/requirements.txt)](https://app.snyk.io/org/some-engineering-inc./projects)
[![代码覆盖率](https://codecov.io/gh/someengineering/fixinventory/graph/badge.svg?token=ZEZW5JAR5J)](https://codecov.io/gh/someengineering/fixinventory)

Fix Inventory 可以检测云基础设施中的合规性和安全风险。

我们为云和安全工程师开发了 Fix Inventory，这是 Orca Security、Prisma Cloud 和 Wiz 等商业云安全工具的开源替代品。

请查看我们的[快速入门指南](https://inventory.fix.security/docs/getting-started/)，了解如何快速上手。

## 💡 为什么选择 Fix Inventory？

Fix Inventory 专为云原生基础设施而设计，支持 300 多种云服务：

- [AWS](https://github.com/someengineering/fixinventory/blob/main/plugins/aws)
- [GCP](https://github.com/someengineering/fixinventory/blob/main/plugins/gcp)
- [Azure](https://github.com/someengineering/fixinventory/tree/main/plugins/azure)
- [DigitalOcean](https://github.com/someengineering/fixinventory/blob/main/plugins/digitalocean)
- [Hetzner](https://github.com/someengineering/fixinventory/tree/main/plugins/hetzner)
- [Kubernetes](https://github.com/someengineering/fixinventory/tree/main/plugins/k8s)
- [GitHub](https://github.com/someengineering/fixinventory/tree/main/plugins/github)

工具通过三步工作：

1. **收集云账户资源的元数据**
2. **对资源进行标准化**
3. **扫描数据查找安全风险**

此外，Fix Inventory 还可以将数据导出，以便集成到警报和修复工作流中。

## 🍀 Fix Inventory 的不同之处？

云原生基础设施中，开发活动和自动化更新带来的错误配置是难以避免的，关键在于能多快发现并解决最严重的风险。

Fix Inventory 使用跨云平台的图形数据模型，来分析云资源之间的隐藏依赖关系，从而快速了解风险：

- **随处部署**：可以在本地或云端部署，也提供 SaaS 版本。
- **高性能**：可以跨多个云账户工作，支持并行收集数据，优化性能。
- **依赖与访问图**：存储资源之间的依赖关系，支持复杂查询，帮助理解风险。
- **多云抽象**：使用统一的数据模型，让策略能在所有云环境中生效。
- **资源生命周期跟踪**：每小时拍摄一次快照，跟踪资源的配置变化。

## 🛠️ 使用场景

- **云安全态势管理**：监控并实施安全策略，查找错误配置并修复。
- **AI 安全态势管理**：自动发现使用中的 AI 服务及其连接的数据源。
- **云合规性管理**：运行标准合规框架的自动化合规评估。
- **云资产盘点**：收集、标准化资源配置数据，防止影子 IT。
- **Kubernetes 安全**：从容器到 Kubernetes 对象、节点、集群，全方位安全管理。
- **安全数据整合**：将多个云提供商的安全数据集成到一个地方。
- **策略即代码**：通过脚本将策略应用到多云环境中，确保配置和可靠性。

## 💖 社区

Fix Inventory 是一个由 Some Engineering 开发的开源项目。如有任何问题，可加入 [我们的 Discord 服务器](https://discord.gg/fixsecurity)：

- 获取帮助
- 反馈问题
- 学习如何写查询
- 使用依赖与访问图

## 🙏 贡献

如有小改动，可直接在 [GitHub 上提 issue](https://github.com/someengineering/fixinventory/issues/new)。大的改动请先提 issue 讨论。遵循我们的[贡献指南](https://inventory.fix.security/development)开始贡献。

## 🎟 许可协议

请查看 [LICENSE](LICENSE) 获取详情。