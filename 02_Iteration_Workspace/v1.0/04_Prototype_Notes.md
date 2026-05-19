# Phase 4: Prototype Notes

## 1. Prototype Overview

- Prototype type: 高保真业务原型说明
- Tool used: 待补充
- Owner: PM_Agent / Inspector 11
- Review date: 2026-04-02

## 2. Screen List

- 登录授权大厅
- 手机号验证码页
- 人脸核身模块
- 身份切换中心
- 邀请承接页

## 3. Review Notes

### 3.1 Confirmed Interaction

- 登录入口保留双路径：微信授权与手机号验证码
- 未登录用户必须停留在登录拦截区域，不开放游客路径
- 多货主用户登录成功后必须进入身份切换中心
- 在安全策略触发时，需要补做人脸核身
- 邀请链接进入的用户，注册完成后自动归属于邀请来源货主

### 3.2 Revised Interaction

- 原型阶段将“登录注册”收敛为同一闭环，不拆成多个冗余入口页
- 对拒绝微信手机号授权的场景，改为软引导降级，不做强硬报错中断
- 对异常反馈文案进行精确定稿，避免出现模糊提示语

### 3.3 Pending Issue

- 人脸核身最终采用原生能力还是第三方服务，待后续确认
- 邀请入驻后是否追加“首单建议”能力，当前未纳入主流程
- 原型工具与原型链接未在当前版本文档中留档，后续版本需补齐

## 4. Asset Links

- Figma or tool link: 待补充
- Demo link: 待补充
- Screenshot folder: `03_Prototype_Assets/`

## 5. Summary

- Ready for final PRD: Yes
- Need another review round: No
- Notes: 本阶段的稳定结论已进入 `05_PRD_Final.md`，并已进一步合并到主档。
