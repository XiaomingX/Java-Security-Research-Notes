# ThreatMapper - 云原生的运行时威胁管理和攻击路径分析工具

![Deepfence Logo](images/readme/deepfence-logo.png)

[![GitHub license](https://img.shields.io/github/license/deepfence/ThreatMapper)](https://github.com/deepfence/ThreatMapper/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/deepfence/ThreatMapper)](https://github.com/deepfence/ThreatMapper/stargazers)
[![Hacktoberfest](https://img.shields.io/github/hacktoberfest/2022/deepfence/ThreatMapper)](https://github.com/deepfence/ThreatMapper/issues)
[![GitHub issues](https://img.shields.io/github/issues/deepfence/ThreatMapper)](https://github.com/deepfence/ThreatMapper/issues)
[![Documentation](https://img.shields.io/badge/documentation-read-green)](https://community.deepfence.io/threatmapper/docs/v2.4/)
[![Demo](https://img.shields.io/badge/threatmapper-demo-green)](https://community.deepfence.io/threatmapper/docs/v2.4/demo)
[![Docker pulls](https://img.shields.io/docker/pulls/deepfenceio/deepfence_agent_ce)](https://hub.docker.com/r/deepfenceio/deepfence_agent_ce)
[![Slack](https://img.shields.io/badge/slack-@deepfence-blue.svg?logo=slack)](https://join.slack.com/t/deepfence-community/shared_invite/zt-podmzle9-5X~qYx8wMaLt9bGWwkSdgQ)
[![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fdeepfence%2FThreatMapper)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fdeepfence%2FThreatMapper)

## 🎉 宣布 ThreatMapper v2

_ThreatMapper v1.x 版本已不再支持，请升级到最新版本。_

Deepfence ThreatMapper 可以在生产环境中寻找威胁，并根据威胁的风险级别进行排序。它可以发现存在漏洞的软件组件、暴露的密钥和偏离安全实践的情况。ThreatMapper 使用基于代理的检测和无代理的监控相结合，为威胁检测提供最广泛的覆盖范围。

通过 ThreatMapper 的 **ThreatGraph** 可视化工具，用户可以识别出对应用程序安全性构成最大威胁的问题，并优先进行防护或修复。

* [了解更多关于 ThreatMapper 的信息](https://community.deepfence.io/threatmapper/docs/v2.4/)。
* [查看 ThreatMapper 运行的现场演示](https://community.deepfence.io/threatmapper/docs/v2.4/demo)。

## 何时使用 ThreatMapper

ThreatMapper 可以帮助延续您在开发过程中采取的良好“左移”安全实践，持续监控应用程序是否存在新的软件漏洞，同时也监控主机和云端配置是否符合行业基准。

ThreatMapper 适用于云端、Kubernetes、无服务器（如 Fargate）和本地平台的生产工作负载和基础设施的安全可观测性。

## 部署规划

ThreatMapper 由两个主要组件组成：

* **ThreatMapper 管理控制台** 是一个容器化应用，可以部署在单台 Docker 主机或 Kubernetes 集群中。
* ThreatMapper 使用无代理的 **云扫描任务** 和基于代理的 **传感器代理** 来监控运行中的基础设施。

### 管理控制台

首先需要在合适的 Docker 主机或 Kubernetes 集群中[部署管理控制台](https://community.deepfence.io/threatmapper/docs/v2.4/console/)。例如，在 Docker 上运行以下命令：

```shell
# ThreatMapper 管理控制台的 Docker 安装流程

wget https://github.com/deepfence/ThreatMapper/raw/release-2.4/deployment-scripts/docker-compose.yml
docker-compose -f docker-compose.yml up --detach
```

管理控制台运行起来后，可以[注册管理员账户并获取 API 密钥](https://community.deepfence.io/threatmapper/docs/v2.4/console/initial-configuration)。

### 云扫描任务

ThreatMapper 的[云扫描任务](https://community.deepfence.io/threatmapper/docs/v2.4/cloudscanner/)负责通过查询云提供商的 API 来收集配置并识别不符合标准的情况。

任务通过 Terraform 模块部署。ThreatMapper 管理控制台将提供基本配置，可以通过 Terraform 部署，或者参考高级配置来微调部署（[AWS](https://community.deepfence.io/threatmapper/docs/cloudscanner/aws)、[Azure](https://community.deepfence.io/threatmapper/docs/cloudscanner/azure)、[GCP](https://community.deepfence.io/threatmapper/docs/cloudscanner/gcp)）。

### 传感器代理

在生产或开发平台上安装[传感器代理](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/)。传感器将向管理控制台报告它们发现的服务，提供遥测数据并生成软件依赖关系的清单。

ThreatMapper 传感器代理支持以下平台：

* [Kubernetes](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/kubernetes/): 使用 Helm Chart 部署在 Kubernetes 集群中。
* [Docker](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/docker/): 部署为轻量级容器。
* [Amazon ECS](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/aws-ecs): 作为守护服务部署，使用任务定义。
* [AWS Fargate](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/aws-fargate): 部署为边车容器，使用任务定义。
* [裸机或虚拟机](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/linux-host/): 部署于轻量级 Docker 运行时中。

例如，在 Docker 主机上运行以下命令启动 ThreatMapper 传感器：

```shell
docker run -dit \
    --cpus=".2" \
    --name=deepfence-agent \
    --restart on-failure \
    --pid=host \
    --net=host \
    --log-driver json-file \
    --log-opt max-size=50m \
    --privileged=true \
    -v /sys/kernel/debug:/sys/kernel/debug:rw \
    -v /var/log/fenced \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /:/fenced/mnt/host/:ro \
    -e USER_DEFINED_TAGS="" \
    -e MGMT_CONSOLE_URL="---CONSOLE-IP---" \
    -e MGMT_CONSOLE_PORT="443" \
    -e DEEPFENCE_KEY="---DEEPFENCE-API-KEY---" \
    -e http_proxy="" \
    -e https_proxy="" \
    -e no_proxy="" \
    quay.io/deepfenceio/deepfence_agent_ce:2.4.0
```

对于 Kubernetes 平台，可以使用 [Helm Chart](https://community.deepfence.io/threatmapper/docs/v2.4/sensors/kubernetes/) 进行安装。

## 后续步骤

访问 [Deepfence ThreatMapper 文档](https://community.deepfence.io/threatmapper/docs/v2.4/)，了解如何开始使用和配置 ThreatMapper。

## 联系我们

感谢您使用 ThreatMapper，欢迎加入 [ThreatMapper 社区](COMMUNITY.md)。

* [Deepfence 社区网站](https://community.deepfence.io)
* [<img src="https://img.shields.io/badge/slack-@deepfence-brightgreen.svg?logo=slack">](https://join.slack.com/t/deepfence-community/shared_invite/zt-podmzle9-5X~qYx8wMaLt9bGWwkSdgQ) 如有问题需要帮助，可以在 Slack 上找到 Deepfence 团队
* [![GitHub issues](https://img.shields.io/github/issues/deepfence/ThreatMapper)](https://github.com/deepfence/ThreatMapper/issues) 有功能需求或发现漏洞，请提出 Issue
* [![Documentation](https://img.shields.io/badge/documentation-read-green)](https://community.deepfence.io/threatmapper/docs/v2.4/) 阅读 [Deepfence ThreatMapper 文档](https://community.deepfence.io/threatmapper/docs/v2.4/)
* 发现安全问题？请发送至 [productsecurity *at* deepfence *dot* io](SECURITY.md)
* 了解更多信息，请访问 [deepfence.io](https://deepfence.io)

## 获取 ThreatStryker 企业版

ThreatStryker 是 ThreatMapper 的企业版，包含更多适合企业安全团队的功能。ThreatStryker 可以作为云服务或本地部署。

<a href="https://deepfence.io/view-enterprise-sandbox" target="_blank"><img src="./images/threatstryker.png">

## 安全与支持

关于 ThreatMapper 项目的安全问题，请联系 [productsecurity *at* deepfence *dot* io](SECURITY.md)。

如有需要请提交 GitHub Issues，并加入 Deepfence 社区的 [Slack 频道](https://join.slack.com/t/deepfence-community/shared_invite/zt-podmzle9-5X~qYx8wMaLt9bGWwkSdgQ)。

## 许可证

Deepfence ThreatMapper 项目（此仓库）使用 [Apache2 许可证](https://www.apache.org/licenses/LICENSE-2.0) 提供。

[贡献](CONTRIBUTING.md) 也按照 [GitHub 的 inbound=outbound 策略](https://docs.github.com/en/github/site-policy/github-terms-of-service#6-contributions-under-repository-license) 以 Apache2 许可证接受。
