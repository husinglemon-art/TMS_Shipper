# 🚦 Trans_Wise 总路由表与分发中心 (Phase Router)

**【核心系统指令】**
当指挥官 (Easton) 下达指令时，你必须首先查阅本路由表进行语义匹配，并静默挂载对应文件。

---

## 🎯 语义路由映射表 (Intent-to-Phase Mapping)

### [前期：规划与对标]
- **Phase 1 | 需求深度访谈**
  - **触发**：新想法、新需求、模糊痛点、规划建议、逻辑挖掘。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_1_Discovery.md`

- **Phase 2 | 竞品雷达**
  - **触发**：竞品分析、市场调研、标杆对标、别人怎么做的。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_2_Radar.md`

### [中期：产研协同]
- **Phase 3 | 需求初稿 (Initial PRD)**
  - **触发**：写需求、拆解页面、定义 Mock 数据、功能清单。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_3_InitialPRD.md`

- **Phase 4 | 高保真原型开发 (Prototype Generation)**
  - **触发特征**：写代码、写原型、UI 实现、前端交互开发、页面重构。
  - ⚠️ **前置分流拦截 (Crucial)**：
    - 在正式进入 Phase 4 之前，你必须**强制暂停**并向指挥官 Easton 确认使用的底层渲染引擎。
    - **询问话术**：“[系统日志：准备进入 Phase 4] Easton，关于本次高保真原型的生成，请指示路线：
      - **路线 A (Antigravity 原生)**：由我直接在当前工作空间内编写 React + AntD 源码并处理深度逻辑。
      - **路线 B (v0 快速构建)**：由您先在 v0.dev 生成初始 UI，再由我将代码接入本项目并进行状态机绑定。”
  - ➡️ **执行分发**：
    - 若 Easton 选择 **路线 A**，去读取：`01_Phase_Pipeline/Phase_4A_Antigravity_Proto.md`
    - 若 Easton 选择 **路线 B**，去读取：`01_Phase_Pipeline/Phase_4B_v0_Integration.md`

- **Phase 5 | 详细需求封版 (Final PRD)**
  - **触发**：逻辑回填、五栏式表格补全、状态机封版、最终文档。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_5_FinalPRD.md`

### [后期：资产闭环]
- **Phase 6 | 源码物理归档**
  - **触发**：代码快照、版本备份、封存代码、归档。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_6_Archive.md`

- **Phase 7 | 交付报告与指南**
  - **触发**：结项战报、操作指南、带截图的文档、用户手册。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_7_Delivery.md`

- **Phase 8 | SSOT 逻辑注入**
  - **触发**：同步全局档案、Master 合并、刷新看板、真相注入。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_8_SSOT_Merge.md`

- **Phase 9 | Git 云端同步**
  - **触发**：提交代码、Git Push、云端备份。
  - ➡️ **执行**：`01_Phase_Pipeline/Phase_9_GitSync.md`

---

## 🛡️ 异常处理 (Fallback)
若指令跨度过大（如“做调研顺便写代码”），必须拦截并询问：“检测到跨越 Phase 2 与 Phase 4，建议先从 Phase 2 开始。Easton，是否授权串行执行？”