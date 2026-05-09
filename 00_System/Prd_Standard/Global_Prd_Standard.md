# 📑 Trans_Wise 工业级 PRD 输出标准 (v1.2)

> **[最高执行指令]**：AI 在撰写任何功能模块的 PRD 时，必须强制套用此模板结构。在描述第 4 章节的原子组件时，必须强制跳转并参考 `Pattern_Specs/` 目录下对应的编号文件，严禁凭空发挥。

---

## 1. 文档基本信息 (General Info)

### 1.1 文档修订历史
| 文档版本号 | 日期 | 作者 | 修改描述 | 审核人 |
| :--- | :--- | :--- | :--- | :--- |
| v1.2 | 2026-04-01 | AI_Agent | 对齐 Pattern_Specs 01-09 编号路径 | Easton |

---

## 2. 概述与范围 (Overview & Scope)

### 2.1 业务背景 (Background)
- **现状/痛点**：当前业务流程中的瓶颈或痛点。
- **解决方案**：本迭代如何通过技术手段优化。
- **预期价值**：量化的提升指标（如：提单处理效率提升 30%）。

### 2.2 核心用户故事 (User Story)
- **格式**：作为一名 **[角色]**，我希望 **[做某事]**，以便于 **[达到目的]**。

### 2.3 需求范围 (Scope)
- **包含 (In Scope)**：本次必须交付的功能。
- **不包含 (Out of Scope)**：明确排除的边界。

---

## 3. 核心流程与全局逻辑 (Global Logic)

### 3.1 核心交互逻辑流程图
- **要求**：使用 `Mermaid` 绘制。展示用户跨页面的核心操作路径。

### 3.2 全局状态流转图 (Status Machine)
- **要求**：使用 `Mermaid` 绘制 `stateDiagram-v2`。
- **说明**：定义实体的全生命周期（如：待入库 -> 运输中 -> 已签收），必须标注触发切换的【动作名称】。

---

## 4. 页面交互规则及业务逻辑 (Atomic Detail)

> **[原子化组件引用]**：在本章节描述具体页面时，AI 必须根据页面元素，强制参考以下编号手册进行“填空式”撰写：

### 4.1 [具体页面名称]
- **A. 查询过滤区 (Filter)**：
  - **[参考手册]**：`./Pattern_Specs/01_Filter_Standard.md`
- **B. 数据展示列表 (Table)**：
  - **[参考手册]**：`./Pattern_Specs/02_Table_Standard.md`
- **C. 按钮与操作行为 (Action)**：
  - **[参考手册]**：`./Pattern_Specs/03_Action_Standard.md`
- **D. 录入表单与弹窗 (Form)**：
  - **[参考手册]**：`./Pattern_Specs/04_Form_Standard.md`
- **E. 详情描述区 (Detail)**：
  - **[参考手册]**：`./Pattern_Specs/05_Detail_Standard.md`
- **F. 操作日志与轨迹 (Log)**：
  - **[参考手册]**：`./Pattern_Specs/06_Log_Standard.md`
- **G. 业务进度条 (Steps)**：
  - **[参考手册]**：`./Pattern_Specs/07_Steps_Standard.md`
- **H. 统计看板卡片 (Dashboard)**：
  - **[参考手册]**：`./Pattern_Specs/08_Dashboard_Standard.md`
- **I. 标签页切换 (Tab)**：
  - **[参考手册]**：`./Pattern_Specs/09_Tab_Standard.md`

---

## 5. 核心动作逻辑深度分析 (The 5-Column Analysis)

*针对“提交”、“审核”、“批量删除”等关键闭环，必须执行以下五栏矩阵分析：*

| 逻辑项 | 场景说明 | 前置条件 | 处理流程与校验 (Step-by-Step) | 后置条件/反馈 |
| :--- | :--- | :--- | :--- | :--- |
| **动作名** | 场景描述 | 触发所需的权限/单据状态 | **1. 校验:** 前端规则<br>**2. 反馈:** 二次确认文案<br>**3. 处理:** API 异常处理 | 状态流转结果、页面刷新、Toast 文案 |

---

## 6. 原型与视觉标准 (UI/UX Standards)

- **布局规范**：严格遵守 Ant Design v5 SaaS 布局标准。
- **反馈红线**：
  - 成功：`Message.success`
  - 失败：`Notification.error` (必须包含具体错误提示)
- **Mock 数据**：严禁使用 `aaa/123`，必须使用真实的跨境物流 Mock 数据。