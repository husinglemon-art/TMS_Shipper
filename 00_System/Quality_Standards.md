# 🛡️ 质量标准与红线协议 (Quality Standards)

## 一、 UI/UX 视觉与交互红线 (SaaS UI)

- **布局拓扑**：
  - **Sider**：暗色导航，支持折叠。
  - **Header**：面包屑 + 时间 + 版本号 + 头像。
  - **Content**：浅色背景，自适应 Padding。
- **品牌基因**：主色 #1890ff (Daybreak Blue) | 报警色 #f5222d (Dust Red)。

## 二、 代码工程化规范 (Code Engineering)

- **注释要求**：核心逻辑必须配有清晰的中文注释，解释“为什么”。
- **防破坏锁**：严禁大面积删除功能，重构/删除前必须发出二次确认警报。
- **模块化**：长列表拆分组件，状态管理使用 React Hooks (useState/useEffect)。

## 三、 数字资产文档规范 (Documentation)

- **排版**：严格遵守 GFM (GitHub Flavored Markdown)。
- **可视化**：逻辑/流程/架构**禁止纯文字**，强制使用 Mermaid。
- **交付红线**：用户指南严禁“无图”，必须“截图 + 标注 + 白话文”。
