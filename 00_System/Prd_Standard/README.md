# PRD Standard README

## 1. Purpose

本目录用于存放 `TMS_Shipper` 当前使用的 PRD 编写标准。

它的目标不是替代实际需求内容，而是帮助产品经理在写 PRD 时保持：

- 结构统一
- 边界清楚
- 交互表达稳定
- 页面描述可复用

## 2. How To Use

### 先看总纲

优先使用：

- `Global_Prd_Standard.md`

适用场景：

- 准备写一份新的 PRD
- 想确认 PRD 应该按什么结构展开
- 想确定一份 PRD 至少要包含哪些模块

### 再看模式规范

需要写具体页面和交互时，再看：

- `Pattern_Specs/`

适用场景：

- 写筛选区
- 写列表区
- 写表单
- 写详情页
- 写步骤条
- 写 Dashboard
- 写 Tab 切换

## 3. Directory Structure

当前目录结构：

```text
PRD_Standard/
├─ README.md
├─ Global_Prd_Standard.md
└─ Pattern_Specs/
```

## 4. File Roles

### `Global_Prd_Standard.md`

总纲文件。

内容特点：

- 定义 PRD 的总体结构
- 定义写作顺序
- 定义页面、流程、动作、边界如何展开

### `Pattern_Specs/`

页面与交互模式资料库。

内容特点：

- 每类页面区块一份参考
- 用于帮助把 PRD 写得更具体
- 适合在写 `03_PRD_Initial.md` 和 `05_PRD_Final.md` 时对照使用

## 5. Recommended Default Flow

建议默认顺序：

1. 先用 `Global_Prd_Standard.md` 确定 PRD 结构
2. 再根据页面内容进入 `Pattern_Specs/`
3. 写完后再交给 `PRD_Check_Standard/` 做检查

## 6. Current Guideline

当前仓库更推荐：

- 先写核心业务结构
- 再补页面与交互细节
- 不要一开始就陷入组件级描述

不推荐：

- 跳过总纲直接写零散页面
- 只写页面名，不写动作和边界
- 只写功能，不写流程和异常

## 7. Maintenance Rule

- 如果要调整 PRD 整体结构，优先改 `Global_Prd_Standard.md`
- 如果要增强具体页面写法，再改 `Pattern_Specs/`
- 如果只是新增一个常用页面模式，可以在 `Pattern_Specs/` 中扩展，而不一定改总纲
