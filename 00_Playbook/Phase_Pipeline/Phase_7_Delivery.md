# 📊 Phase 7: 交付物闭环 (Completion Reports)

> ⚠️ **强制双端装载指令 (Dual-Role Pre-requisite)**
> 在执行本阶段前，你必须静默读取并融合：
> 1. `Agent_Roles/Enablement.md` (演示与使用引导专家：提炼业务价值并输出图文说明)

---

## 🛑 核心禁令 (The Hard Lock)
- **拒绝干瘪汇报**：Walkthrough 报告严禁罗列提交记录或技术术语。必须翻译成“老板听得懂的业务收益”。
- **禁止无图指南**：`User_Guide.md` 严禁纯文字描述。凡涉及关键操作，必须配有真实截图。
- **纯用户视角**：指南中严禁出现 `onClick`、`API`、`Props` 等技术词汇，必须使用“点击”、“输入”、“等待”等白话。

## 🔄 执行动作：商业化交付 (Commercial Delivery)

### 🟢 动作 1：生成《交付演示报告 (Walkthrough)》
- **输出位置**：直接在对话框中输出，作为结项仪式。
- **强制结构**：
  1. **🚀 核心亮点 (Highlights)**：用一句极具传播性的话总结本版本的最大突破。
  2. **💰 业务价值 (ROI)**：解决了什么痛点？排产、纠错或效率提升了多少？
  3. **✨ 视觉/交互高亮**：对 UI 层的明星功能进行强调（如：“新版甘特图支持动态拖拽”）。
  4. **📝 下一步建议**：自动推导下一个版本（vX.X.0）的演进方向。

### 🟡 动作 2：生成《图文用户指南 (User_Guide.md)》
- **截图协议 (Crucial)**：
  - AI 必须调用内置 **Browser/Web 工具**，优先访问当前版本对应的 `/02_Iteration_Workspace/v[版本号]/Prototype_Assets/` 页面或展示资产；若存在共享展示材料，再补充访问 `/03_Shared_Prototype_Assets/`。
  - 在每个关键步骤（如：点击按钮后弹出弹窗、表单提交成功等）进行**真实截图**。
  - 截图保存至：`/02_Iteration_Workspace/v[当前版本号]/Prototype_Archive/stepX_xxx.png`。
- **文档编写**：
  - 编写操作步骤，并使用 Markdown 语法嵌入对应的截图：`![操作说明](./Prototype_Archive/stepX_xxx.png)`。

---

## 📦 本阶段交付物 (Deliverables)

- **交付文件**：`/02_Iteration_Workspace/v[当前版本号]/User_Guide.md`
- **汇报与流转**：
  > “[系统日志：Phase 7 演示战报已送达 📄] 
  > 报告指挥官，业务价值提炼已完成，图文操作指南（含真实截图）已生成完毕。
  > 我们的作品现在不仅好用，而且“好看”了。
  > 是否授权开启 **Phase 8 (SSOT 逻辑注入)**，将本次更新合并至全局真相档案？”

- **后置动作**：按全局规则更新工作记录。
