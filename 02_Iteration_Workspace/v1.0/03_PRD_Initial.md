# 03 PRD 初稿

## 1. 本次目标与边界

### 1.1 本次目标
- 目标 1：验证货主侧用户能否在同一条主线中完成“订单导入 -> 整车/零担规划 -> 承运商指派 -> 生成运输任务”。
- 目标 2：让 demo 明确体现国内陆运场景下的成本、时效、线路适配与承运商选择依据，而不是只展示页面跳转。

### 1.2 本次边界
- 包含：订单池、待规划列表、整车/零担规划判断、承运商推荐或竞价结果、确认指派、运输任务生成。
- 不包含：货代/承运商独立使用后台、司机执行端完整流程、签收回单闭环、费率对账闭环、长期 BI 经营分析。

## 2. 页面拓扑图

```mermaid
graph TD
    A[订单导入入口] --> B[订单池/待规划列表]
    B --> C[整车/零担规划页]
    C --> D{承运商选择方式}
    D --> E[协议承运商推荐]
    D --> F[竞价/招标结果]
    E --> G[确认指派]
    F --> G
    G --> H[运输任务生成结果]
```

## 3. 功能与交互清单

| 页面或模块 | 核心交互 | 推荐页面表达方式 |
| :--- | :--- | :--- |
| 订单池/待规划列表 | 查看待处理订单、筛选订单、选择订单进入规划 | 列表页 + 筛选区 + 批量选择 |
| 整车/零担规划页 | 查看订单关键信息、判断整车直发、零担拼单或拆单、确认推荐路径 | 主工作区 + 侧边详情 + 状态提示 |
| 承运商推荐区 | 展示候选承运商及推荐依据（KPI、报价、市场参考价、报价偏差、时效、运力可用性），默认按综合评分排序，支持用户手动切换排序方式 | 列表对比区 |
| LTL 对照区块 | 在同一规划页中补充零担拼单或补位判断，不单独拉新页面 | 同页补充说明区块 |
| 竞价/招标结果区 | 当无协议承运商或需比价时，展示招标结果或竞价候选 | 对比列表 + 结果说明 |
| 确认指派动作 | 由货主调度员确认承运商与运输任务关系 | 主动作按钮 + 二次确认 |
| 运输任务生成结果 | 指派完成后生成运输任务并返回结果说明 | 结果页或成功反馈面板 |

## 4. Mock 数据示例

```json
{
  "orders": [
    {
      "order_id": "ORD-20260520-001",
      "source": "ERP",
      "delivery_mode": "FTL",
      "pickup_site": "上海嘉定工厂",
      "delivery_site": "苏州工业园客户仓",
      "weight_ton": 8.5,
      "required_arrival_time": "2026-05-21 18:00",
      "status": "TO_PLAN"
    }
  ],
  "carrier_recommendations": [
    {
      "carrier_name": "顺达物流",
      "rate_total": 3200,
      "transit_hours": 10,
      "capacity_status": "AVAILABLE",
      "recommend_reason": "协议价最低，且适合工厂到工厂整车直发",
      "on_time_rate": "96%",
      "exception_rate": "1.2%",
      "fulfillment_rate": "98%",
      "market_reference_rate": 3400,
      "rate_gap": "低于市场 5.9%",
      "scenario_tag": "内贸工厂到工厂"
    },
    {
      "carrier_name": "华东快运",
      "rate_total": 3380,
      "transit_hours": 8,
      "capacity_status": "AVAILABLE",
      "recommend_reason": "时效更优，但成本略高，适合高时效订单",
      "on_time_rate": "98%",
      "exception_rate": "0.8%",
      "fulfillment_rate": "99%",
      "market_reference_rate": 3400,
      "rate_gap": "低于市场 0.6%",
      "scenario_tag": "内贸工厂到工厂"
    }
  ],
  "bid_results": [
    {
      "carrier_name": "远东供应链",
      "bid_total": 3450,
      "transit_hours": 9,
      "capacity_status": "AVAILABLE",
      "bid_rank": 1,
      "bid_reason": "报价在可接受范围内，且可满足次日到货要求，适合零担补位",
      "scenario_tag": "零担补位"
    },
    {
      "carrier_name": "联运快线",
      "bid_total": 3580,
      "transit_hours": 8,
      "capacity_status": "AVAILABLE",
      "bid_rank": 2,
      "bid_reason": "时效更优，但成本更高，适合前程陆运高优先级订单",
      "scenario_tag": "出海前程陆运"
    }
  ],
  "dispatch_result": {
    "task_id": "TSK-20260520-001",
    "carrier_name": "顺达物流",
    "status": "ASSIGNED",
    "trace_entry_hint": "后续可继续进入运输执行跟踪",
    "default_sort_rule": "综合评分优先，可切换报价最低、时效最优、KPI最优"
  }
}
```

## 5. 验收标准

1. 货主调度员可以从订单池中筛选、查看并选定订单进入整车/零担规划流程。
2. 在承运商推荐阶段，系统必须展示 KPI、报价、市场参考价、报价偏差、时效、运力可用性，并能够说明该推荐更适合整车或零担场景。
3. 承运商确认指派后，系统必须明确反馈运输任务已生成，且新任务状态清晰可见。

## 6. 小结

- 当前已锁定内容：本次 `v1.0` 聚焦货主单边使用视角，只验证国内陆运场景下“订单到承运商指派闭环”。
- 当前待补问题：是否在同页补充一条更清楚的 LTL 拼单判断说明；出海前程陆运的场景标签展示粒度到什么程度。
- 当前场景锁定：本次 `v1.0` 以工厂到工厂内贸运输为主演示场景；出海前程陆运仅作为说明性支线场景。
- 是否可进入下一阶段：可以进入下一阶段，建议继续补 `04_Prototype_Notes.md` 或直接围绕该主线开始准备 demo 展示结构。
