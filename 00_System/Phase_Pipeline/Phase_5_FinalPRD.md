# 📐 Phase 5: 详细需求封版与双重审计 (Final PRD & Dual-Audit)

> ⚠️ **强制装载指令 (Sequential Execution)**
> 1. **生产段**：装载 `Agent_Roles/Product_Lead.md` 与 `Agent_Roles/Quality_Review.md`。
> 2. **逻辑质检段**：装载 `Agent_Skills/Governance_Audit/PRD_Review.md`。
> 3. **语言审计段**：装载 `Agent_Roles/Language_Review.md`。

---

## 🔄 执行动作：三位一体流水线 (Execution Pipeline)

### 🟢 第一步：终版生产 (Production)
- **动作**：基于 Phase 4 的原型实现，由 PM/QA 协同撰写 `05_PRD_Final.md`。
- **规范**：强制执行“五栏式矩阵”，确保逻辑颗粒度达到指挥官要求的“商品发布流程”级别。

### 🔴 第二步：逻辑完整性扫描 (Hard Audit)
- **触发**：初稿完成后，立即调用审计引擎。
- **任务**：对照 `Prd_Check_Standard` 中的 14 个维度文件执行死穴扫描。
- **产出**：生成第一轮 `check-prd-appendix-veto.md`。
- **判定**：若 Veto 非空，**直接打回第一步重写**。只有逻辑 100% 闭环，才准许进入下一步。

### 🟡 第三步：语言审查 (Soft Audit)
- **触发**：通过逻辑质检后，将文档移交给语言审查角色。
- **任务**：
  1. **技术脱敏**：彻底剔除文档中的 `API`、`State` 等技术词汇。
  2. **业务白话重写**：将生硬逻辑润色为流畅的业务操作指令。
- **产出**：生成第二轮（最终版）`check-prd-appendix-veto.md` 和 `check-prd-appendix-guide.md`。
- **判定**：语言审查角色拥有一票否决权。若其判定文档“AI 味太重”或“技术词汇过多”，必须清零 Veto 后方可过关。

---

## 📦 本阶段最终交付物 (Final Deliverables)

- **物理存档**：
  - `/02_Iteration_Workspace/v[当前版本号]/05_PRD_Final.md` (已通过双重审计的纯净版)
  - `/02_Iteration_Workspace/v[当前版本号]/Audit_Reports/` (内含逻辑审计与语言审计的完整记录)

---

## 🚀 结项与云端同步 (Final Release)

- **云端转码**：仅在语言审查通过后，才执行云端同步动作。
- **进度更新**：更新工作记录。
- **汇报**：
  > “[系统日志：Phase 5 双重过滤完成 🏁] 
  > 1. 逻辑审计：关键维度已闭环。
  > 2. 语言审计：已去技术化，业务表达已收口。
  > 报告指挥官，v[版本号] PRD 已达到『说明书级』精度，是否开启 Phase 6？”
