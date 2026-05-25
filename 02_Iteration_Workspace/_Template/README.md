# Iteration Template

使用方式：

1. 复制 `_Template` 目录。
2. 将复制后的目录重命名为新版本号，例如 `v1.1`。
3. 按阶段顺序补充文档内容。
4. 在 `Prototype_Assets/` 中补充当前版本的原型资产与落图资料。
5. 在需要时向 `Audit_Reports/` 中加入审计附录。
6. 当本次版本稳定后，再将结论合并到 `01_Master_Documents/`。

适用说明：

- 当前模板更适合 B 端供应链系统需求试验
- 当前模板也适合做 demo 版本收口与展示准备
- 当前仓库以模板为主，同时保留 `v1.0` 作为试跑参考。后续如需新版本，仍建议复制模板创建独立版本目录。
- 当前版本专属原型资产应放在版本目录下的 `Prototype_Assets/`，不要与根级共享资产目录混放。
- 若要生成原型工具资料，默认优先准备 `Stitch` 和 `Gemini_Canvas` 两类输出，但在生成前应先确认你要用哪一种工具。

模板内容说明：

- `01_Question_Input.md`: 需求访谈与边界确认
- `02_Competitor_Research.md`: 竞品调研与差异化建议
- `03_PRD_Initial.md`: 初版 PRD
- `04_Prototype_Notes.md`: 原型评审记录
- `05_PRD_Final.md`: 终版 PRD
- `Prototype_Assets/`: 当前版本专属的页面说明、截图、prompt、落图资料
- `Audit_Reports/`: 审计记录目录

原型相关使用建议：

- `04_Prototype_Notes.md` 用于记录原型评审口径、页面清单和待定项
- `04_Prototype_Notes.md` 中建议额外记录“当前冻结基线”和“不再继续大改的范围”
- `Prototype_Assets/` 用于沉淀实际落图材料，例如页面规格、页面内容、线框备注和原型工具提示词
- 若某些展示资产需要跨版本复用，再整理到根级 `03_Shared_Prototype_Assets/`
- 若使用原型工具，建议在 `Prototype_Assets/` 下按工具建立独立子目录，例如 `Stitch/`、`Gemini_Canvas/`
- 每种工具的资料应集中管理在当前版本自己的目录中，不与其他版本混放
- 若为保证生成效果需要使用英文 prompt，应同步提供中文说明或中英文对照版本，便于日常使用
