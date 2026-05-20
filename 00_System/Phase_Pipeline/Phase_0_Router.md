# TMS_Shipper 阶段路由表

**【核心路由规则】**
当指挥官 (Easton) 下达指令时，你必须首先查阅本路由表进行语义匹配，并读取对应阶段文件。

---

## 路由映射表 (Intent-to-Phase Mapping)

### [前期：规划与对标]
- **Phase 1 | 需求深度访谈**
  - **触发**：新想法、新需求、模糊痛点、规划建议、逻辑挖掘。
  - ➡️ **执行**：`Phase_Pipeline/Phase_1_Discovery.md`

- **Phase 2 | 竞品雷达**
  - **触发**：竞品分析、市场调研、标杆对标、别人怎么做的。
  - ➡️ **执行**：`Phase_Pipeline/Phase_2_Radar.md`

### [中期：产研协同]
- **Phase 3 | 需求初稿 (Initial PRD)**
  - **触发**：写需求、拆解页面、定义 Mock 数据、功能清单。
  - ➡️ **执行**：`Phase_Pipeline/Phase_3_InitialPRD.md`

- **Phase 4 | 高保真原型开发 (Prototype Generation)**
  - **触发特征**：写原型说明、整理交互方案、补页面流、补展示资产、重构页面结构表达。
  - ⚠️ **前置分流拦截 (Crucial)**：
    - 在正式进入 Phase 4 之前，你必须**强制暂停**并向指挥官 Easton 确认本次原型表达路线。
    - **询问话术**：“[系统日志：准备进入 Phase 4] Easton，关于本次高保真原型的生成，请指示路线：
      - **路线 A (Antigravity 原生)**：由我直接在当前工作空间内整理高保真原型说明、页面结构与交互细节。
      - **路线 B (外部原型接入)**：由您先在 v0.dev 或其他工具生成初始界面，再由我补充交互说明与文档缝合。”
  - ➡️ **执行分发**：
      - 若 Easton 选择 **路线 A**，去读取：`Phase_Pipeline/Phase_4A_Antigravity_Proto.md`
      - 若 Easton 选择 **路线 B**，去读取：`Phase_Pipeline/Phase_4B_v0_Integration.md`

- **Phase 5 | 详细需求封版 (Final PRD)**
  - **触发**：逻辑回填、五栏式表格补全、状态机封版、最终文档。
  - ➡️ **执行**：`Phase_Pipeline/Phase_5_FinalPRD.md`

### [后期：资产闭环]
- **Phase 6 | 原型资产归档**
  - **触发**：原型快照、版本备份、封存展示资产、归档。
  - ➡️ **执行**：`Phase_Pipeline/Phase_6_Archive.md`

- **Phase 7 | 交付报告与指南**
  - **触发**：结项战报、操作指南、带截图的文档、用户手册。
  - ➡️ **执行**：`Phase_Pipeline/Phase_7_Delivery.md`

- **Phase 8 | SSOT 逻辑注入**
  - **触发**：同步全局档案、Master 合并、刷新看板、真相注入。
  - ➡️ **执行**：`Phase_Pipeline/Phase_8_SSOT_Merge.md`

- **Phase 9 | Git 云端同步**
  - **触发**：提交文档、提交资产、Git Push、云端备份。
  - ➡️ **执行**：`Phase_Pipeline/Phase_9_GitSync.md`

---

## 🛡️ 异常处理 (Fallback)
若指令跨度过大（如“做调研顺便补原型说明”），必须拦截并询问：“检测到跨越 Phase 2 与 Phase 4，建议先从 Phase 2 开始。Easton，是否授权串行执行？”
