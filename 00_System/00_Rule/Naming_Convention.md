# Naming Convention

## 1. Purpose

本规范用于统一仓库内的项目命名、版本命名、主档命名、迭代文件命名和原型资产命名。

目标：

- 避免 `Trans_Shipper`、`Trans_Wise` 与当前正式名称混用
- 保证主档、迭代文档和配置文件命名一致
- 让后续版本扩展时保持稳定结构

## 2. Primary Naming Rules

### 2.1 Repository Name

- Repository Name: `TMS_Shipper`
- Usage: 仅用于本地仓库目录名、仓库标题和目录结构示意

说明：
`TMS_Shipper` 同时作为当前仓库名与产品正式名使用。

### 2.2 Product Official Name

- Product Official Name: `TMS_Shipper`
- Usage: 用于项目配置、产品主文档、流程文档、审计文档和对外展示口径

说明：
`TMS_Shipper` 是当前仓库内唯一有效的产品正式名。

### 2.3 Deprecated Names

以下命名不再作为正式名称继续使用：

- `Trans_Shipper`
- `Trans_Wise`

说明：
若历史文档中存在旧名称，应在后续维护中逐步替换为 `TMS_Shipper`。

## 3. Version Naming Rules

版本目录统一使用以下格式：

- `v1.0`
- `v1.1`
- `v2.0`

规则：

- 主版本升级使用：`v2.0`
- 小版本迭代使用：`v1.1`、`v1.2`
- 禁止使用 `final`、`new`、`latest` 作为目录名

## 4. Master Document Naming Rules

主档目录：`01_Master_Documents/`

当前保留主档文件：

- `PRD_Master.md`
- `Product_Architecture.md`
- `Dashboard.md`

规则：

- 主档名称保持稳定，不随版本变化附加编号
- 不创建 `PRD_Master_final.md`、`Architecture_new.md` 这类派生文件
- 主档更新通过修订记录体现，而不是通过复制文件体现

## 5. Iteration File Naming Rules

迭代目录：`02_Iteration_Workspace/v[版本号]/`

标准文件：

- `01_Question_Input.md`
- `02_Competitor_Research.md`
- `03_PRD_Initial.md`
- `04_Prototype_Notes.md`
- `05_PRD_Final.md`
- `Audit_Reports/`

规则：

- 统一使用阶段编号前缀，确保排序稳定
- 阶段编号一旦确定，不随个人偏好调整
- 禁止新增 `PRD_new.md`、`需求整理2.md`、`最终最终版.md` 这类文件名

## 6. Prototype Asset Naming Rules

原型资产目录：`03_Prototype_Assets/`

建议命名方式：

- 页面截图：`screen-login-lobby.png`
- 页面流图：`flow-auth-entry.png`
- 评审稿：`review-v1-tenant-switch.pdf`
- 链接说明：`demo-links.md`

规则：

- 文件名优先体现页面或模块用途
- 文件名使用短横线连接英文词
- 避免使用 `test`、`demo1`、`temp`、`最新` 这类低信息量命名

## 7. Document Title Rules

文档标题遵循以下原则：

- 仓库入口文档可使用仓库名，例如 `# TMS_Shipper`
- 产品主文档优先使用产品名 `TMS_Shipper`
- 版本文档标题可同时包含阶段名和产品名

示例：

- `# TMS_Shipper`
- `# PRD Master`
- `# Product Architecture`
- `# TMS_Shipper 司机端鉴权与业务归属分发模块 - PRD_Final`

## 8. Update Rules

- 当新增目录层级时，先检查是否符合本命名规范
- 当出现新命名需求时，优先更新本文件后再批量调整仓库内容
- 若历史文档仍有旧命名，后续修改该文档时顺手清理

## 9. Role Naming Rules

角色目录：`00_System/Agent_Roles/`

规则：

- 角色文件名优先使用职责型命名，不使用编号命名
- 角色文件名应尽量直接反映在 PM 模板工程中的职责
- 当两个角色承担高度重叠职责时，优先合并角色，而不是保留多个缩写名称

当前角色文件包括：

- `Product_Lead.md`
- `Market_Research.md`
- `UX_Design.md`
- `Prototype_Design.md`
- `Quality_Review.md`
- `Enablement.md`
- `Master_Architect.md`
- `Master_Steward.md`
- `Version_Governance.md`
- `Language_Review.md`

## 10. Current Decision Summary

- Repository Name: `TMS_Shipper`
- Product Official Name: `TMS_Shipper`
- Master Directory: `01_Master_Documents`
- Iteration Directory: `02_Iteration_Workspace`
- Prototype Directory: `03_Prototype_Assets`
