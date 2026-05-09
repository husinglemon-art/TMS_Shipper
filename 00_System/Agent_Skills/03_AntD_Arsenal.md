# 🧰 技能档案：[Skill_AntD] 企业级 React 组件装配库

## 1. 技能定位 (Definition)
本技能是 [UE] 和 [Staff] 的核心约束。用于确保生成的 React 代码不仅能跑，而且具备纯正的现代 SaaS 质感，彻底消灭“拼凑感”和“土味 UI”。

## 2. 组件映射绝对法则 (Component Mapping Laws)
在 Phase 2 规划与 Phase 3 编码时，遇到以下业务场景，**必须强制调用**对应的 Ant Design v5 高级组件，严禁使用原生 HTML 标签替代：

- **【数据展示域】**
  - 多行数据：禁止用原生 `<table>`，强制使用 `@ant-design/pro-components` 的 `ProTable`（支持列宽拖拽、高级检索）。
  - 核心指标看板：强制使用 `Statistic` 组件，配合 `Card` 使用。
- **【复杂表单域】**
  - 超过 5 个字段的表单：严禁一屏铺满。强制使用 `StepsForm`（分步表单）或通过 `Tabs` 进行信息分组。
  - 动态增减字段：强制使用 `Form.List`。
- **【阻断与反馈域】**
  - **危险动作 (删除/撤回)**：强制包裹 `Popconfirm`，确认按钮必须设置为 `danger` 属性。
  - **页面级空载**：检测到数组长度为 0 时，必须渲染 `<Empty description="当前暂无数据，请尝试调整筛选条件" />`。
  - **异步等待**：凡是涉及数据请求的区块，必须有 `Spin` 或 `Skeleton` (骨架屏) 占位。

## 3. 样式污染禁令 (Anti-Pollution)
- **严禁**在组件上大量手写内联 `style={{...}}`。
- 间距、排版必须使用 AntD 的 `Space`、`Row/Col` 或 `Divider` 进行标准规范化处理。