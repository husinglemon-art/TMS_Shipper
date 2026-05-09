# 🎨 Phase 4A: 高保真原型原生开发 (Antigravity Native Prototype)

> ⚠️ **强制双端装载指令 (Dual-Role Pre-requisite)**
> 在执行本阶段前，你必须静默读取并融合：
> 1. `/02_Agent_Roles/03_ue.md` (资深交互体验专家：把控信息层级与微交互)
> 2. `/02_Agent_Roles/04_staff.md` (资深前端研发专家：React + AntD 代码实现)
  3. `00_System/Prd_Standard/10_UI_Aesthetic_Standard.md` (👈 新增：美学红线)
---

## 📸 视觉引导门禁 (Visual Gating)
- **动作**：AI 必须停下并提示：“指挥官，请上传 [当前页面/模块] 的视觉参考图或手绘草图。”
- **指令**：在收到图片后，AI 必须执行 `[视觉特征提取]`：
  1. 识别图片中的间距（Padding/Gap）风格。
  2. 识别图片中的色彩占比与按钮样式。
  3. 识别图片中的对齐方式（左对齐/居中/通栏）。
- **目标**：将提取的视觉特征与 PRD 逻辑进行像素级缝合。
---

## 🛑 技术栈红线 (Tech Stack Lock)
- 严格使用 **Vite + React (Hooks) + Ant Design v5**。
- 严禁引入未经允许的第三方库（如 Tailwind、MUI 等），必须保持工程纯净度。

## 🔄 执行动作：双核驱动组装 (Coding & UE Injection)

### 🟢 动作 1：SaaS 骨架与代码实现 (Coding)
- **标准布局**：采用经典的左侧 Sider + 顶部 Header + 自适应 Content 布局。
- **品牌基因**：全局主题色强制设为 **Daybreak Blue (#1890ff)**。
- **状态流转**：利用 `useState` 和 `useEffect` 实现基础的页面切换与弹窗交互，让原型“活”起来。

### 🟡 动作 2：高保真数据注入 (High-Fi Mocking)
- 严禁使用 `test`、`123` 等无意义数据。
- 必须读取 Phase 3 定义的 Mock 数据字典，注入逼真的行业数据（如：真实运单号 `TRW-20260327-001`、合理的 GPS 坐标、口岸名称）。

### 🔴 动作 3：UE 体验审查与注入 (UE Review)
- **防呆与防错**：破坏性操作（如删除、撤回）前，强制加入二次确认（Popconfirm 或 Modal）。
- **微交互设计**：强制实现 Loading 状态（骨架屏/Spin）、空状态提示（Empty）、成功/失败的 Toast 提示（Message）。
- **认知减负**：复杂表单强制分步（Steps）或分组；高频操作放置在第一视觉落点。

### 🔵 动作 4：环境激活与实时预览 (Environment Activation)
- **自动指令**：代码输出完毕后，AI 必须立刻在终端执行：
  `cd 03_Prototype_Web && npm run dev`
- **目标**：确保 Vite 预览服务处于活跃状态，实现“代码落盘即预览”。

### 🔴 动作 5：红线对标质检 (Red Line Audit)
- **要求**：在生成代码前，AI 必须检查布局是否符合 `Quality_Standards.md` 的 Sider/Header 规范。
- **要求**：检查主色调是否已锁定为 #1890ff。
---

## 🔄 执行动作：欧美简约主义实现 (Clean-Flow Injection)

### 🟢 动作 1：去框化布局组装 (Borderless Layout)
- 遵循 `10_UI_Aesthetic_Standard.md`，移除沉重的实体边框。
- 使用 **Negative Space (负空间)** 进行逻辑分区，而非“画格子”。

### 🟡 动作 2：高保真数据与状态 (Dynamic Mocking)
- 注入符合跨境物流真实场景的 Mock 数据。
- 实现 Tabs 切换、抽屉展开、按钮 Loading 等实时交互，拒绝死图。

### 🔴 动作 3：流程通顺质检 (Flow Audit)
- 检查页面是否出现了“大模块堆砌”？如果是，立即通过增加垂直间距（Gap）和弱化次要元素进行“消肿”。
- 确保核心动作（如提交、保存）始终处于用户的“视觉舒适区”。
---

## 📦 本阶段交付物 (Deliverables)

- **输出 1：实时预览 (Live View)**
  - **路径**：`/03_Prototype_Web/src/App.tsx`
  - **作用**：供指挥官在右侧预览区即时验收、点击、交互。

- **输出 2：时空快照 (Time Machine Snapshot)**
  - **路径**：`/02_Iterations/v[当前版本号]/Prototype_Archive/App_v[当前版本号].tsx`
  - **作用**：作为本版本的“数字木乃伊”永久封存。
  - **要求**：该文件必须与实时预览版完全一致，严禁任何字节偏差。
  

- **全量覆盖禁令**：拒绝 `// ...此处省略`，两处路径均必须输出**完整可运行源码**。
- **汇报与流转**：
  > “[系统日志：Phase 4A 渲染引擎已点火 🚀] 
  > 报告指挥官，原型已同步存入快照库。**本地开发服务已自动启动**，请在右侧预览区直接验收。确认体验丝滑后，是否授权进入 Phase 5？”
  - **后置动作**：按全局规则更新 `workthrough.md`。