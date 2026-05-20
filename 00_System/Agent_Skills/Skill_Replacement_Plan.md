# Skill Replacement Plan

## 1. Purpose

本文件用于规划 `TMS_Shipper` 模板工程下一阶段的 skill 替换与补充顺序。

目标不是一次性重建整个 skill 库，而是：

- 先保持当前 16 个核心 skill 可用
- 再按组逐步替换为更贴合你实际业务的方法模板
- 最后在需要时补充新的 demo 专用 skill

## 2. Current Strategy

当前采取的策略是：

1. 已完成瘦身
2. 已完成分组
3. 已完成首轮按组替换
4. 接下来按需补充

原因：

- 先替换已有位置，比先膨胀数量更容易控盘
- 当前 skill 已经是最小核心集合，不适合再无序扩张

## 3. Replacement Priority

首轮替换已按以下顺序推进：

1. `Research_Analysis/`
2. `Prototype_Interaction/`
3. `Core_Documentation/`
4. `Governance_Audit/`

执行原因：

- 前两组与你实际业务适配度关系最大
- 后两组更偏基础设施和治理底座，替换成本更高

---

## 4. Group-by-Group Plan

### 4.1 Research_Analysis

当前文件：

- `Competitor_Research.md`
- `Problem_Definition.md`
- `Role_Task_Analysis.md`
- `Requirement_Card.md`
- `Version_Map.md`
- `Context_Intake.md`

当前状态：已完成首轮替换

替换结果：

- 已贴合 B 端供应链岗位、流程和 demo 范围
- 已减少通用 Prompt 味
- 已形成问题定义、需求卡、版本结构图的主链路

建议补充：

- `Requirement_Interview_Template.md`
- `Demo_Scope_Definition.md`
- `Competitor_Scan_Checklist.md`

下一步优先级：中

### 4.2 Prototype_Interaction

当前文件：

- `Evidence_Capture.md`
- `Journey_Map.md`
- `Interaction_Rules.md`
- `Demo_Storyline.md`

当前状态：已完成首轮替换

替换结果：

- 已贴合 demo 叙事、截图留痕和交互表达
- 已形成岗位旅程图与演示故事线的组合
- 已可直接支撑 `04_Prototype_Notes.md` 和 demo 说明

建议补充：

- `Prototype_Link_Register.md`
- `Demo_Walkthrough_Script.md`
- `Screen_Review_Checklist.md`

下一步优先级：中

### 4.3 Core_Documentation

当前文件：

- `Doc_Standard.md`
- `User_Guide.md`
- `Diagram_Standard.md`

当前状态：已完成首轮替换

替换结果：

- 已贴合主档、PRD、图文说明和 demo 文档
- 已形成较稳定的表达底座
- 后续只建议局部增强，不建议大改

建议补充：

- `Document_Review_Checklist.md`
- `Mermaid_Pattern_Library.md`

下一步优先级：中低

### 4.4 Governance_Audit

当前文件：

- `Version_Closeout.md`
- `Requirement_Review.md`
- `PRD_Review.md`

当前状态：已完成首轮替换

替换结果：

- 已贴合版本收口、需求完整性检查和 PRD 审计
- 已可直接服务主档治理和 demo 收口
- 后续建议结合真实版本运行后再做第二轮微调

建议补充：

- `Master_Update_Checklist.md`
- `Version_Closeout_Checklist.md`

下一步优先级：中低

---

## 5. Suggested Additions for Demo Workflow

如果当前模板工程主要用于做 demo，建议未来优先补以下 skill：

- `Demo_Scope_Definition.md`
- `Demo_Script_Template.md`
- `Prototype_Link_Register.md`
- `Version_Review_Checklist.md`
- `Stakeholder_Review_Notes.md`

这些比继续补充大而全的通用 Prompt 更实用。

## 6. Replacement Rules

每次替换一个 skill，建议遵循以下规则：

1. 一次只替换一个 skill 或一个小组内的 1 到 2 个 skill
2. 先更新 skill 文件本身
3. 再更新 `Skill_Groups.md`
4. 再检查角色和流程引用是否需要同步
5. 最后再提交

## 7. Success Standard

替换后的 skill 应满足：

- 名称清楚
- 职责单一
- 能直接服务当前 PM 模板工程
- 不依赖娱乐化或纯灵感型话术
- 角色引用后不会产生歧义

## 8. Current Recommendation

首轮替换已经完成。

下一步不建议继续大面积改名或重写，而建议进入：

1. 结合真实 demo 版本试跑
2. 根据试跑结果补充新 skill
3. 仅在发现明显不适配时做第二轮替换
