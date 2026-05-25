# Prototype Review Log

## Purpose

本文件用于记录原型生成后的 review 轮次，避免无限来回迭代。

原则：

- 每轮最多只修 2 个问题
- 每轮修正后都判断是否满足停止条件
- review log 比 prompt 更重要，因为它决定下一轮只修什么

## Review Round Template

### Round [X]

- 当前工具：`Gemini_Canvas`
- 当前目标页面：
- 当前版本文件：

#### This Round Only Fixes

- 问题 1：
- 问题 2：

#### Do Not Expand This Round

- 不修：
- 不修：

#### Prompt Used

- 使用的 prompt 文件：
- 使用的 prompt 段落：

#### Review Result

- 是否通过：是 / 否
- 若未通过，下一轮只保留的 2 个问题：
- 若通过，是否进入下一页面或停止：

## Stop Conditions

- 主场景不再跑偏
- 核心页可信度成立
- 结果页不扩成执行闭环
- 剩余问题已进入“收益递减”的轻量润色级别

## Usage Rule

- 不允许跳过本文件直接连续做 4 轮以上 prompt 修正
- 若连续两轮都在修同一类偏差，应回到 `Generation Guardrails` 补硬约束
