# Browser Tracker

## 1. Purpose

本 skill 用于支持 **B 端供应链系统产品经理** 做两件事：

1. 竞品取证
2. demo 截图留痕

它的目标不是泛泛“浏览网页”，而是为以下产出服务：

- `02_Competitor_Research.md`
- `04_Prototype_Notes.md`
- 图文操作说明
- demo 演示记录

## 2. Default Context

默认适用于以下背景：

- 你是 B 端供应链系统产品经理
- 你要研究的对象通常是物流、仓储、运输、调度、订单履约、异常协同类产品
- 你要截图的对象通常是 demo 页面、竞品页面、评审页面或关键操作状态页

## 3. Mode A: Competitor Evidence Capture

### When To Use

- 做竞品研究
- 查找真实页面证据
- 查找用户吐槽或典型体验问题
- 为 `02_Competitor_Research.md` 补充可信来源

### Core Rules

1. 不允许凭印象写竞品结论，必须尽量附来源
2. 优先记录真实页面、公开截图、公开说明或用户反馈来源
3. 结论必须回到供应链业务闭环，不要跑偏到无关品牌故事

### What To Capture

- 核心页面结构
- 关键操作路径
- 异常提示方式
- 用户评论中的高频槽点
- 适合借鉴的交互点

## 4. Mode B: Demo Screen Capture

### When To Use

- 写 `04_Prototype_Notes.md`
- 准备 demo 演示材料
- 输出图文操作说明
- 记录页面状态用于后续评审

### Capture Sequence

1. 先明确本次要截图的页面状态
2. 再进入目标页面或目标步骤
3. 触发需要展示的状态
4. 最后截图并归档

### Typical States to Capture

- 默认进入态
- 有数据态
- 空状态
- 异常提示态
- 成功完成态
- 关键切换态

## 5. Naming and Storage Rule

推荐命名方式：

- `step_1_login_lobby.png`
- `step_2_tenant_switch.png`
- `step_3_exception_toast.png`

推荐存放位置：

- `03_Prototype_Assets/`
- `02_Iteration_Workspace/v[版本号]/Prototype_Archive/`

如果是版本内演示记录，优先放到版本目录中。

## 6. Good Output Standard

一个合格的截图或取证结果，应该满足：

- 能看清当前页面或状态
- 能支持你在 PRD、原型说明或汇报中的论点
- 文件名可读，不需要打开图片也能猜到内容
- 截图与业务动作一一对应，不是随手乱截

## 7. Next Suggested Actions

完成截图或取证后，推荐进入以下任一步：

1. 写入 `02_Competitor_Research.md`
2. 写入 `04_Prototype_Notes.md`
3. 嵌入图文操作说明或 demo 讲解材料
