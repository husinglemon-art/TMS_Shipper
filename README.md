# TMS_Shipper

产品正式名：`TMS_Shipper`

面向产品经理的需求资产仓库，用于沉淀需求访谈、竞品研究、PRD 初稿、终稿审计和主文档归档。

当前定位：模板工程，用于产品方案试验和 demo 演示。

当前状态：仅保留模板骨架，不保留正式试跑版本样例。

快速入口：

- 想了解仓库结构与分层：看 `README.md`
- 想知道日常怎么开版本、写文档、合并主档：看 `PM_Usage_Guide.md`

## 项目定位

- 这是一个 **PM 专用项目仓库**，不是生产代码仓库。
- 仓库核心目标是让需求工作按照统一流程产出、评审、归档、沉淀。
- 当前重点是文档资产管理、版本化迭代记录、主文档维护和原型资产留存。

## 目录结构

```text
TMS_Shipper/
├─ 00_Playbook/
├─ 01_Master_Documents/
├─ 02_Iteration_Workspace/
├─ 03_Prototype_Assets/
└─ README.md
```

### `00_Playbook/`

项目规则与方法论底座。

- `00_Rule/`: 全局规则、执行门禁、协作原则
- `Agent_Roles/`: 不同角色视角的职责定义
- `Agent_Skills/`: 文档生成、审计、排版等技能模板
- `Phase_Pipeline/`: 从需求访谈到归档的阶段流程
- `PRD_Standard/`: PRD 编写标准
- `PRD_Check_Standard/`: PRD 审计标准
- `Quality_Standards.md`: 质量红线
- `Project_Identity.json`: 项目标识与归档配置

### `01_Master_Documents/`

全局主档目录，用于沉淀跨版本的正式文档。

- `PRD_Master.md`: 产品主 PRD
- `Product_Architecture.md`: 产品架构与 Mermaid 图

说明：
除指定的主档合并阶段外，不应直接在这里做临时性需求试验。

### `02_Iteration_Workspace/`

版本化需求工作区。每个版本目录代表一次完整需求闭环。

当前默认保留：

- `_Template/`: 新版本模板

说明：
这里是日常工作的主战场，所有版本增量应先在这里完成，再决定是否合并进入主档。

### `03_Prototype_Assets/`

原型资产目录，用于保存非生产级的展示材料。

适合放入：

- 原型截图
- 页面流转图
- Figma、墨刀、v0 等外部链接说明
- 评审演示材料
- 历史方案归档

说明：
该目录不要求承载可部署代码工程。

## 推荐工作流

按以下顺序使用本仓库：

1. 在 `02_Iteration_Workspace/` 下创建新版本目录，例如 `v1.1/`
2. 产出 `01_Question_Input.md`，完成需求访谈和边界确认
3. 产出 `02_Competitor_Research.md`，完成竞品与差异化分析
4. 产出 `03_PRD_Initial.md`，形成结构化需求蓝图
5. 在 `03_Prototype_Assets/` 中补充原型相关材料
6. 产出 `05_PRD_Final.md` 和 `Audit_Reports/`
7. 将稳定结论合并到 `01_Master_Documents/`

## 文件命名规则

- 版本目录使用：`v1.0`、`v1.1`、`v2.0`
- 迭代文件按阶段编号排序：`01_`、`02_`、`03_`、`05_`
- 主档文件使用稳定命名，避免频繁改名
- 原型资产文件名应体现页面或模块用途，避免使用 `test`、`demo1` 这类模糊命名

## 使用边界

- 本仓库默认用于产品需求与原型资产管理
- 不以生产代码交付为核心目标
- 如果未来需要代码演示，应明确区分“展示原型”和“可交付系统”

## 当前状态

- 已完成目录轻量重构
- 已统一主档目录、角色、skill 和标准层命名
- 已保留主档与迭代模板骨架
- 当前适合直接复制模板开始新版本
