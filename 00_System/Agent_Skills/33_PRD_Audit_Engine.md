# 🛠️ Skill: 14 维度 PRD 深度审计引擎 (v2.3)

## 📥 输入源 (Inputs)
1. **审计法典**：读取 `Prd_Check_Standard/Global_Prd_Check_Rule.md`。
2. **扫描标准**：循环读取 `Prd_Check_Standard/Check_Dimensions/` 下的 14 个维度文件。
3. **待检对象**：当前版本的 PRD 源码。

## ⚙️ 动作序列 (Actions)
- **版本对齐**：自动识别当前正在处理的迭代版本号（如 `v1.1.0`）。
- **深度扫描**：执行 14 维度交叉对标，捕捉逻辑漏洞与优化点。

## 📤 动态产出 (Dynamic Outputs)
**强制输出路径**：`/02_Iterations/v[当前版本号]/Audit_Reports/`
AI 必须在该目录下生成并实时更新以下文件：
1. **`check-prd-appendix-veto.md`** (否决项：必须清零方可结项)
2. **`check-prd-appendix-guide.md`** (优化项：作为开发参考)