# Gemini Canvas Workflow

## Purpose

本文件用于沉淀使用 `Gemini Canvas` 生成业务原型时的长期工作流方法，减少反复往返和无限修 prompt 的情况。

## Core Principle

- 先锁硬边界，再生成页面
- 先做主线页面，再补闭环页面
- 每轮最多只修 2 个问题
- 达到“可评审”后停止继续大改

## Recommended Workflow

### 1. Lock Guardrails First

先定义：

- 主场景是什么
- 支线最多展示到什么程度
- 哪些内容不能平级展示
- 页面文案要偏什么风格
- 停止条件是什么

不要先直接堆长 prompt。

### 2. Generate Mainline Before Full Flow

建议顺序：

1. 页面 1：订单池
2. 页面 2：运输规划
3. 页面 3：承运商推荐
4. 页面 4：确认指派与任务结果

原因：

- 页面 3 最容易跑偏
- 页面 3 稳住之后，再补页面 4 成本更低

### 3. Use Page-Level Ready-To-Paste Inputs

每页单独生成，不建议首轮一次塞入全量上下文。

基本节奏：

1. 先贴首轮输入
2. 如果结构对但内容空，再贴细化输入
3. 如果方向偏，再贴修正 prompt

### 4. Review In Small Rounds

每轮 review 只修 2 个问题。

优先级建议：

1. 主线是否跑偏
2. 动态数据是否一致
3. 核心页可信度是否成立
4. 页面语言是否过重

### 5. Separate Generation And Review Prompts

把 prompt 分成两类：

- 生成类：用于第一次出页面
- 修正类：用于 review 后定向收口

不要把所有要求都塞进一条大 prompt 里。

### 6. Stop At Review-Ready

达到以下条件时应停止继续大改：

- 主场景不再跑偏
- 核心页可信度成立
- 结果页不扩成执行闭环
- 剩余问题只属于轻量措辞或层级优化

## Common Failure Patterns

### 1. Side Branch Takes Over

表现：

- 支线场景比主场景更抢戏
- 特殊规则在多个页面变成主叙事

修法：

- 把支线压回规则说明区
- 明确哪些页面不能让支线成为主信息层

### 2. System Storytelling Too Heavy

表现：

- 页面像大平台、大中台、大优化系统
- 文案偏技术联动、执行编排、系统回写

修法：

- 把页面语言改回业务评审可理解的调度决策表达

### 3. Invalid Candidates Look Like Main Candidates

表现：

- 被规则拦截的候选仍然在主卡区平级展示

修法：

- 降为风险候选、审计候选或次级候选
- 不与默认推荐候选平级出现

## Recommended Companion Files

在版本目录下建议同时准备：

- `Gemini_Canvas_Generation_Guardrails.md`
- `Prototype_Review_Log.md`
- `Screen1_Ready_To_Paste.md`
- `Screen2_Ready_To_Paste.md`
- `Screen3_Ready_To_Paste.md`
- `Screen4_Ready_To_Paste.md`
- `Review_Fix_Prompts.md`

## Usage Rule

- 本文件是共享方法，不替代具体版本文档
- 具体版本仍需在 `02_Iteration_Workspace/v[版本号]/Prototype_Assets/Gemini_Canvas/` 中保存自己的 prompt 和 review 记录
