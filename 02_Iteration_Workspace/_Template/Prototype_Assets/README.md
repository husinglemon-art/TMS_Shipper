# Prototype Assets Template

## Purpose

本目录用于存放当前版本专属的原型资产与落图资料。

## Suitable Contents

- 页面截图
- 页面流说明
- demo 脚本
- 页面规格说明
- 页面内容文案
- 线框落图备注
- 原型工具提示词

## Usage Rule

- 本目录强绑定当前版本，不用于存放跨版本共享资产
- 若某些展示材料可被多个版本复用，请放到根级共享目录中管理
- 当前版本的 `04_Prototype_Notes.md` 中，截图目录应指向本目录
- 若要生成原型工具资料，默认优先准备 `Stitch` 和 `Gemini_Canvas` 两类内容，但在实际生成前应先询问用户当前要用哪种工具，用户也可以补充其他工具
- 每一种工具都应在当前版本目录下建立独立子目录集中管理，例如 `Stitch/`、`Gemini_Canvas/`
- 若 prompt 为英文主版本，应提供对应中文说明或中英文对照，方便中文使用习惯下的复核和二次编辑

## Recommended Starter Files

- `Demo_Asset_Index.md`
- `vX.X_Demo_Script.md`
- `vX.X_Demo_Screenflow.md`
- `vX.X_Page_Spec.md`
- `vX.X_Screen_Content.md`
- `vX.X_Wireframe_Notes.md`
- `vX.X_Prototype_Tool_Prompts.md`
- `Stitch/`
- `Gemini_Canvas/`

若使用 `Gemini_Canvas`，建议同时补以下流程模板：

- `Gemini_Canvas/vX.X_Gemini_Canvas_Generation_Guardrails.md`
- `Gemini_Canvas/vX.X_Prototype_Review_Log.md`
