# 📐 Phase 5: 详细需求封版与双重魔鬼审计 (Final PRD & Dual-Audit)

> ⚠️ **强制装载指令 (Sequential Execution)**
> 1. **生产段**：装载 `/02_Agent_Roles/01_pm.md` 与 `05_qa.md`。
> 2. **逻辑质检段**：装载 `Agent_Skills/PRD_Audit_Engine.md`。
> 3. **语言审计段**：装载 `/02_Agent_Roles/11_inspector.md`。

---

## 🔄 执行动作：三位一体流水线 (Execution Pipeline)

### 🟢 第一步：终版生产 (Production)
- **动作**：基于 Phase 4 的原型实现，由 PM/QA 协同撰写 `05_PRD_Final.md`。
- **规范**：强制执行“五栏式矩阵”，确保逻辑颗粒度达到指挥官要求的“商品发布流程”级别。

### 🔴 第二步：14 维度逻辑扫描 (Hard Audit - Skill 33)
- **触发**：初稿完成后，立即调用 **Skill 33**。
- **任务**：对照 `Prd_Check_Standard` 中的 14 个维度文件执行死穴扫描。
- **产出**：生成第一轮 `check-prd-appendix-veto.md`。
- **判定**：若 Veto 非空，**直接打回第一步重写**。只有逻辑 100% 闭环，才准许进入下一步。

### 🟡 第三步：11 号检察员语言审计 (Soft Audit - Role 11)
- **触发**：通过 Skill 33 逻辑质检后，将文档移交给 **11 号检察员**。
- **任务**：
  1. **技术脱敏**：彻底剔除文档中的 `API`、`State` 等代码词汇。
  2. **人话重修**：将生硬逻辑润色为流畅的业务操作指令。
- **产出**：生成第二轮（最终版）`check-prd-appendix-veto.md` 和 `check-prd-appendix-guide.md`。
- **判定**：11 号检察员拥有一票否决权。若他判定文档“AI 味太重”或“代码词汇过多”，必须清零 Veto 后方可过关。

---

## 📦 本阶段最终交付物 (Final Deliverables)

- **物理存档**：
  - `/02_Iteration_Workspace/v[当前版本号]/05_PRD_Final.md` (已通过双重审计的纯净版)
  - `/02_Iteration_Workspace/v[当前版本号]/Audit_Reports/` (内含逻辑审计与语言审计的完整记录)

---

## 🚀 结项与云端同步 (Final Release)

- **云端转码**：仅在 11 号检察员点头后，触发 `Skill_32` 将文档同步至 Google Docs。
- **进度更新**：更新 `workthrough.md`。
- **汇报**：
  > “[系统日志：Phase 5 双重过滤完成 🏁] 
  > 1. 逻辑审计 (Skill 33)：14 维度全通。
  > 2. 语言审计 (Role 11)：已去技术化，人话占比 100%。
  > 报告指挥官，v[版本号] PRD 已达到『说明书级』精度，是否开启 Phase 6？”
