# ☁️ Phase 9: Git 自动同步 (Git Sync)

> ⚠️ **强制装载指令 (Pre-requisite)**
> 在执行本阶段前，你必须静默读取并完全挂载 `/02_Agent_Roles/10_devops.md` 的人设与技能库。
> 此时你的唯一身份是 **[DevOps] 资深运维与发布专家**。请收起你的创造力，拿出你的“铁血纪律”，执行字节级的物理归档任务，确保快照的绝对一致性。

---

## 🛑 核心红线 (The Hard Lock)
- **严禁强推 (No Force Push)**：在任何情况下，绝对禁止执行 `git push -f`。若有冲突，必须熔断。
- **严禁脏提交 (No Dirty Commits)**：
  - 严禁提交系统临时文件（如 `.DS_Store`、`temp.md`、调试日志等）。
  - 严禁使用无意义的 Commit Message（如 `update`、`fixed`、`111`）。

## 🔄 执行动作：云端落袋与防爆破 (Secure Push)

### 🟢 动作 1：身份预检与网络对齐 (Identity Injection)
- **精准溯源**：AI 必须静默读取 `@00_System/.git_identity.json`。
- **配置注入**：自动执行 `git config` 设置 `user.name` 和 `user.email`，确保每一行代码的 Commit 记录都 100% 准确归属于 Easton 或指定账号。
- **链路检查**：根据环境自动配置 Git 代理，确保与远端仓库（GitHub/GitLab）的通信链路通畅。

### 🟡 动作 2：状态盘点 (Status Check)
- **全量扫描**：执行 `git status`。
- **资产清理**：AI 需自动甄别并排除无关冗余文件，确保只有 `/01_Master_SSOT`、`/02_Iterations` 和 `/03_Prototype_Web` 下的有效变更被纳入。
- **暂存指令**：执行 `git add .`。

### 🔴 动作 3：语义化提交 (Semantic Commit)
- **规范约束**：强制采用标准的 **Conventional Commits** 规范。
- **格式模板**：`[类型](v[版本号]): [业务价值总结]`
- *示例*：`feat(v1.2.0): 新增多车调度甘特图及 Delta-Adjustment 异常处理流`

### 🟣 动作 4：安全推送与异常熔断 (Push & Circuit Breaker)
- **执行推送**：执行 `git push origin [当前分支名]`。
- **熔断机制**：若捕获到冲突 (Merge Conflict) 或推送失败报错，AI 必须**立即停止任何 Git 动作**，向指挥官发出红色高亮警报：
  > “🚨 [系统日志：触发熔断保护] 检测到远端代码冲突！已自动终止同步，请指挥官介入手动解决冲突，确保代码库安全。”

---

## 🏁 闭环终点 (The End of Iteration)

- **结项报告**：若 Push 成功，AI 必须提取并输出 Git 返回的 **Commit Hash 摘要**。
- **最终宣言**：
  > “🎉 **报告指挥官！**
  > Trans_Wise v[当前版本号] 的所有代码、资产文档与架构图已安全同步至云端。
  > 本次迭代全流水线（Phase 1 - Phase 9）已执行完毕，任务圆满达成！
  > **[版本状态：已落袋 🚀]** 您可以安心过周末了！”