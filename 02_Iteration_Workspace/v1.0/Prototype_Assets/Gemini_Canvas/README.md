# Gemini Canvas Assets

## Purpose

本目录用于存放面向 `Gemini Canvas` 的专用原型生成资料。

## Current Files

- `v1.0_Gemini_Canvas_Final_Prompt_Kit.md`：当前版本 `Gemini Canvas` 的最终版统一入口，优先使用
- `v1.0_Gemini_Canvas_Final_Workflow.md`：总结本次验证有效的最终使用流程
- `tms_control_tower.tsx`：当前 `v1.0` 的 Gemini Canvas 原型评审基线代码

## Legacy Files

- `Legacy/v1.0_Gemini_Canvas_Prompts.md`
- `Legacy/v1.0_Gemini_Canvas_Copy_Pack.md`
- `Legacy/v1.0_Gemini_Canvas_Screen1_Ready_To_Paste.md`
- `Legacy/v1.0_Gemini_Canvas_Screen2_Ready_To_Paste.md`
- `Legacy/v1.0_Gemini_Canvas_Screen3_Ready_To_Paste.md`
- `Legacy/v1.0_Gemini_Canvas_Screen4_Ready_To_Paste.md`
- `Legacy/v1.0_Gemini_Canvas_Review_Fix_Prompts.md`

说明：

- 上述 `Legacy/` 文件保留为本次 `v1.0` 的生成与修正历史参考
- 后续继续使用 `Gemini Canvas` 时，不再以这些分散文件作为主要入口

## Usage Suggestion

- 先使用 `Canvas Global Setup`
- 再按页面顺序使用 `Canvas Screen 1` 到 `Canvas Screen 4`
- 若工具支持长上下文，可同时补充页面规格、页面内容和线框备注
- 当前目录只存放 `Gemini_Canvas` 相关资料，不混放其他工具内容
- 正式生成前，默认应先与用户确认是否本轮使用 `Gemini_Canvas`
- 若主 prompt 为英文，为方便中文使用，应同步保留中文说明或中英文对照

## Related Files

- 上层目录中的 `v1.0_Page_Spec.md`
- 上层目录中的 `v1.0_Screen_Content.md`
- 上层目录中的 `v1.0_Wireframe_Notes.md`

## Language Rule

- 建议保留结构化英文 brief 以提升生成稳定性
- 同时保留中文说明和必要的中文对照，便于按中文习惯审阅和补充
- 推荐实际使用方式：英文 brief 直接投喂工具，中文对照用于人工确认、复核和补充细节
- 当前 `v1.0` 优先直接使用 `v1.0_Gemini_Canvas_Final_Prompt_Kit.md`
- 若必须回看旧过程资料，再进入 `Legacy/` 目录查看
