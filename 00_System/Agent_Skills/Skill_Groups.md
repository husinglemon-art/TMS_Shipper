# Skill Groups

## 1. Purpose

本文件用于对当前保留下来的核心 skill 做职责分组，方便后续：

- 快速理解每个 skill 的作用
- 判断哪些 skill 可以继续替换
- 判断哪些 skill 属于当前最小闭环必须保留

当前 skill 总数：`16`

## 2. Group Overview

当前 skill 分为 4 组：

1. 核心文档与表达
2. 研究与需求分析
3. 原型与交互表达
4. 主档治理与审计

---

## 3. Core Documentation and Expression

这组 skill 用于保证文档能被写出来、写清楚、写规范。

### Included Skills

- `Core_Documentation/Markdown_Standard.md`
  - 用途：统一 Markdown 排版与结构质量
- `Core_Documentation/HowTo.md`
  - 用途：输出操作说明、步骤说明、图文指引
- `Core_Documentation/Mermaid_Engine.md`
  - 用途：输出流程图、状态机、模块关系图

### Why Keep

- 这是所有 PRD、主档、指南的基础表达能力
- 删除后会直接影响文档质量和结构完整性

### Replacement Priority

- 低
- 建议保留为长期基础能力

---

## 4. Research and Requirement Analysis

这组 skill 用于定义问题、理解用户、构建需求结构和竞品研究。

### Included Skills

- `Research_Analysis/Company_Research.md`
  - 用途：竞品与公司研究
- `Research_Analysis/Problem_Statement.md`
  - 用途：问题定义与边界聚焦
- `Research_Analysis/Jobs_To_Be_Done.md`
  - 用途：用户任务与真实目标挖掘
- `Research_Analysis/User_Story_Enhanced.md`
  - 用途：把需求整理成结构化用户故事
- `Research_Analysis/User_Story_Mapping.md`
  - 用途：构建需求全景与版本拆分逻辑
- `Research_Analysis/Artifact_Context_Intake.md`
  - 用途：读取复杂原始材料并做结构化吸收

### Why Keep

- 这是需求访谈、问题梳理、版本拆解的核心方法层
- 直接支撑 `01_Question_Input.md`、`02_Competitor_Research.md`、`03_PRD_Initial.md`

### Replacement Priority

- 中
- 后续可逐步替换为更贴合你业务的模板，但当前不建议再删

---

## 5. Prototype and Interaction Expression

这组 skill 用于把需求表达成可评审的交互与原型说明。

### Included Skills

- `Prototype_Interaction/Interaction_Arsenal.md`
  - 用途：借鉴成熟的企业级交互模式
- `Prototype_Interaction/Customer_Journey_Mapping.md`
  - 用途：用户旅程与路径表达
- `Prototype_Interaction/Storyboard_Storytelling.md`
  - 用途：场景化表达与演示叙事
- `Prototype_Interaction/Browser_Tracker.md`
  - 用途：截图、页面记录、外部追踪与展示辅助

### Why Keep

- 直接支撑 `04_Prototype_Notes.md` 和交付阶段的展示材料
- 能把文档从“需求文本”推进到“可评审原型表达”

### Replacement Priority

- 中
- 后续可以按你常用的原型工具和展示方式替换

---

## 6. Master Governance and Audit

这组 skill 用于主档治理、版本归档、安全提交和终稿审计。

### Included Skills

- `Governance_Audit/Archive_Git_Guide.md`
  - 用途：版本归档与 Git 安全操作
- `Governance_Audit/ISO29148_to_PRD.md`
  - 用途：对照标准反推需求完整性
- `Governance_Audit/PRD_Audit_Engine.md`
  - 用途：终稿审计、否决项与优化项输出

### Why Keep

- 直接支撑主档治理、终稿封版和版本留痕
- 是模板工程从“能写”走向“能收口”的关键一层

### Replacement Priority

- 中低
- 这组建议在你确定自己的审计标准之后再替换

---

## 7. Current Minimal Core

如果后面要继续做极限瘦身，建议优先保留以下最小核心组合：

- `Core_Documentation/Mermaid_Engine.md`
- `Core_Documentation/Markdown_Standard.md`
- `Research_Analysis/Problem_Statement.md`
- `Core_Documentation/HowTo.md`
- `Research_Analysis/Jobs_To_Be_Done.md`
- `Research_Analysis/User_Story_Enhanced.md`
- `Research_Analysis/User_Story_Mapping.md`
- `Research_Analysis/Artifact_Context_Intake.md`
- `Governance_Audit/PRD_Audit_Engine.md`

说明：
这 9 个可以视为“没有它们就很难完整跑通 PM 闭环”的最低骨架。

## 8. Suggested Next Step

后续若要继续替换或补充 skill，建议按以下顺序推进：

1. 先替换“研究与需求分析”组
2. 再替换“原型与交互表达”组
3. 最后再替换“主档治理与审计”组

原因：

- 前两组与你的业务适配度关系最大
- 最后一组更偏仓库治理底座，变动成本更高
