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
3. 接下来按组替换
4. 替换优先于新增

原因：

- 先替换已有位置，比先膨胀数量更容易控盘
- 当前 skill 已经是最小核心集合，不适合再无序扩张

## 3. Replacement Priority

建议按以下顺序推进：

1. `Research_Analysis/`
2. `Prototype_Interaction/`
3. `Core_Documentation/`
4. `Governance_Audit/`

原因：

- 前两组与你实际业务适配度关系最大
- 后两组更偏基础设施和治理底座，替换成本更高

---

## 4. Group-by-Group Plan

### 4.1 Research_Analysis

当前文件：

- `Company_Research.md`
- `Problem_Statement.md`
- `Jobs_To_Be_Done.md`
- `User_Story_Enhanced.md`
- `User_Story_Mapping.md`
- `Artifact_Context_Intake.md`

建议动作：

- 优先替换为更贴合你业务访谈方式的模板
- 优先减少通用 Prompt 味，增加你的固定提问框架
- 保留“问题定义”和“故事地图”两类核心能力

建议补充：

- `Requirement_Interview_Template.md`
- `Demo_Scope_Definition.md`
- `Competitor_Scan_Checklist.md`

替换优先级：高

### 4.2 Prototype_Interaction

当前文件：

- `Browser_Tracker.md`
- `Customer_Journey_Mapping.md`
- `Interaction_Arsenal.md`
- `Storyboard_Storytelling.md`

建议动作：

- 替换成更贴近你实际 demo 展示方式的模板
- 如果你常用固定原型工具，可以围绕那个工具重写说明
- 保留截图追踪、页面流表达和演示叙事三类核心能力

建议补充：

- `Prototype_Link_Register.md`
- `Demo_Walkthrough_Script.md`
- `Screen_Review_Checklist.md`

替换优先级：高

### 4.3 Core_Documentation

当前文件：

- `Markdown_Standard.md`
- `HowTo.md`
- `Mermaid_Engine.md`

建议动作：

- 这组不要大改结构，只建议局部增强
- 它们已经是稳定底座，优先保证通用性

建议补充：

- `Document_Review_Checklist.md`
- `Mermaid_Pattern_Library.md`

替换优先级：中

### 4.4 Governance_Audit

当前文件：

- `Archive_Git_Guide.md`
- `ISO29148_to_PRD.md`
- `PRD_Audit_Engine.md`

建议动作：

- 这一组先别急着替换
- 等你实际跑过几轮 demo 版本后，再反向抽出更适合你的治理标准

建议补充：

- `Master_Update_Checklist.md`
- `Version_Closeout_Checklist.md`

替换优先级：中低

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

如果下一步开始真正替换，我建议从这 3 个文件优先开始：

1. `Research_Analysis/Company_Research.md`
2. `Research_Analysis/Problem_Statement.md`
3. `Prototype_Interaction/Storyboard_Storytelling.md`

原因：

- 它们最容易根据你的 demo 用法快速定制
- 替换后立刻能影响新版本实际产出质量
