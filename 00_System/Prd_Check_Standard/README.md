# PRD Check Standard README

## 1. Purpose

本目录用于存放 `TMS_Shipper` 模板工程当前使用的 PRD 检查标准。

它的目标不是把所有人都拉进完整的大审计流程，而是提供两层不同强度的检查方式：

- 日常快速检查
- 深度完整检查

## 2. How To Use

### 日常快速检查

优先使用：

- `Quick_Check_Rule.md`

适用场景：

- 当前版本是否可以继续推进
- demo 是否能继续收口
- 主档前是否已经具备基本完整性

说明：
这是当前模板工程的默认入口。

### 深度完整检查

在以下情况，再使用深度资料：

- 准备正式封版
- 涉及系统级规划
- 涉及复杂架构、数据或商业分析
- 需要做一次完整质量回顾

额外提醒：

如果当前版本已经准备合并主档、准备大范围评审，或已形成完整业务闭环，也应主动切换到深度完整检查。

优先参考：

- `Global_PRD_Check_Rule.md`
- `Check_Dimensions/`

## 3. Directory Structure

当前目录结构：

```text
PRD_Check_Standard/
├─ README.md
├─ Quick_Check_Rule.md
├─ Global_PRD_Check_Rule.md
├─ Check_Dimensions/
├─ check-prd-appendix-veto.md
└─ check-prd-appendix-guide.md
```

## 4. File Roles

### `Quick_Check_Rule.md`

轻量入口。

内容特点：

- 只保留 6 个核心维度
- 适合日常审查
- 适合 demo 和版本收口

### `Global_PRD_Check_Rule.md`

深度参考总纲。

内容特点：

- 覆盖 14 个维度
- 适合完整审计
- 适合方法论回顾

### `Check_Dimensions/`

深度维度资料库。

内容特点：

- 每个维度一份详细参考资料
- 适合做完整质量分析时展开使用

### `check-prd-appendix-veto.md`

用于记录必须拦截的问题。

### `check-prd-appendix-guide.md`

用于记录优化建议和改进方向。

## 5. Recommended Default Flow

建议默认顺序：

1. 先看 `Quick_Check_Rule.md`
2. 如果问题复杂，再进入 `Global_PRD_Check_Rule.md`
3. 只有需要深入某个维度时，再打开 `Check_Dimensions/`
4. 输出结果时，用 `veto` 和 `guide` 两类文件沉淀结论

## 6. Current Guideline

当前仓库更推荐：

- 先做快速检查
- 再按需做深度检查

不推荐：

- 每次都从 14 维开始全量扫描
- 在 demo 阶段就执行过重的完整审计

## 7. Maintenance Rule

- 如果后续继续精简审查体系，优先改 `Quick_Check_Rule.md`
- 如果要维护完整参考标准，再改 `Global_PRD_Check_Rule.md` 和 `Check_Dimensions/`
- 如果只是调整输出格式，优先改 `check-prd-appendix-veto.md` 和 `check-prd-appendix-guide.md`
