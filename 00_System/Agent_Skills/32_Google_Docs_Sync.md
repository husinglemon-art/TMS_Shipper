# 🛠️ Skill: MD 转 Google Docs 自动转译协议 (v2.0)

> **[自动化触发器]**：当 `Project_Identity.json` 中的 `auto_save_as_gdoc` 为 `true` 时，在阶段文档定稿后触发。

## 1. 格式转译矩阵 (Formatting Map)
AI 在创建 Google Doc 时，必须执行以下语义映射：
- **# Header 1** -> 转为 Docs 【标题 1】 (居中, 18pt, 加粗)
- **## Header 2** -> 转为 Docs 【标题 2】 (14pt, 加粗, 下方留白)
- **### Header 3** -> 转为 Docs 【标题 3】 (12pt, 加粗)
- **| Table |** -> 转为 Docs 【原生表格】 (表头背景设为淡灰色 #F5F5F5, 垂直居中)
- **> Quote** -> 转为 Docs 【左侧带灰色边框的文字块】
- **`Inline Note`** -> 转为 Docs 【等宽字体 Courier New, 背景色 #F0F0F0】

## 2. 自动寻址与命名 (Auto-Naming)
- **路径解析**：
  1. 定位 `My Drive/TMS_Shipper/01_PRD_Archive/`。
  2. 若当前 PRD 属于 v1.1.0，则自动创建/进入 `v1.1.0` 子文件夹。
- **命名规范**：`[TW_PRD]_[模块名]_v[版本号]_[日期]`

## 3. 附件处理 (Assets Injection)
- **Mermaid 转换**：由于 Docs 不支持 Mermaid 源文本，AI 必须生成该流程图的文字描述版，并标注 `[需指挥官手动截图替换]`。
- **链接引用**：在文档页脚自动附上本地 `.md` 文件的相对路径，确保双向追溯。
