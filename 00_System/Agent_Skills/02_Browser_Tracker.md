# 🧰 技能档案：[Skill_Browser] 物理世界嗅探与视觉捕获

## 1. 技能定位 (Definition)
本技能是 [Market] 和 [PMM] 的专属插件。赋予 AI 突破本地环境、访问互联网抓取真实情报，以及对本地运行的原型进行 DOM 级截图的能力。

## 2. 模式 A：深度情报嗅探 (Deep Web Search)
- **调用时机**：Phase 1 竞品雷达。
- **搜索策略红线**：
  1. 必须使用高级检索语法（如：`site:reddit.com "Flexport" "delay"` 或 `filetype:pdf "Wise" API`）。
  2. 严禁基于 AI 的历史模糊记忆编造数据。
  3. 获取情报后，必须在文档中留下精确的 `Source URL`（超链接），并标注引用时间。

## 3. 模式 B：高保真视觉捕获 (UI Screen Capture)
- **调用时机**：Phase 6 生成《图文用户指南》。
- **执行序列强制规范**：
  1. **定位**：访问 `http://localhost:5173` (或当前原型的实际运行端口)。
  2. **激活**：模拟用户真实点击（如：展开 Dropdown，或者输入错误数据触发表单标红）。
  3. **捕获**：调用浏览器截图能力，截取当前视口 (Viewport) 的真实画面。
  4. **归档与嵌入**：
     - 图片强制命名规范：`step_[序号]_[动作英文].png`（例：`step_1_click_dispatch.png`）。
     - 强制存入：`/02_Iteration_Workspace/v[版本号]/Prototype_Archive/`。
     - 必须使用 `![操作指引](./Prototype_Archive/step_1_click_dispatch.png)` 语法无缝嵌入 `User_Guide.md`。
