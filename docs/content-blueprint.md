# 电商数据分析英语面试课程蓝图

定位：2–5 年经验的 E-commerce Data Analyst，默认兼顾 DTC 与 marketplace；SQL 使用 ANSI 风格，涉及日期函数时优先采用 BigQuery 语境。所有金额、订单、转化和实验数据均为 synthetic / 模拟数据。

| Day | 主题 | 面试能力 | 主要来源 |
| --- | --- | --- | --- |
| 1 | 岗位叙事与电商 KPI 树 | 讲清分析职责、北极星指标、业务目标到指标树 | target_role, disney_role, ga4_events |
| 2 | 订单/商品/客户数据粒度 | 识别 grain、主键、重复 join 与订单/商品/客户层级 | ga4_events, ga4_scopes, bigquery_window |
| 3 | GMV/NMV/Revenue/AOV/UPT | 区分成交、退款、净销售、客单与件单口径 | ga4_events, shopify_cohorts, amazon_acos |
| 4 | 行为事件与转化漏斗 | 设计 view→select→cart→checkout→purchase 漏斗并诊断损失 | ga4_events, ga4_scopes |
| 5 | 获客/归因/CAC/ROAS/ACOS | 解释渠道效率、增量与利润约束，避免最后点击幻觉 | amazon_acos, belkin_role, disney_role |
| 6 | cohort/留存/复购/LTV | 按首单 cohort 分析复购、留存和生命周期价值 | shopify_cohorts, levis_role |
| 7 | A/B 测试/样本量/随机化/guardrail/SRM | 从设计、分流、检验到业务决策完整解释实验 | microsoft_srm, target_role, disney_role |
| 8 | 商品、搜索、品类、价格与促销 | 把商品表现转成选品、搜索、折扣和利润行动 | quince_role, levis_role, belkin_role |
| 9 | 库存、缺货、履约、取消与退货 | 连接可售库存、服务水平、退款和收入损失 | disney_role, target_role, belkin_role |
| 10 | 高级 SQL（窗口、滚动、Top-N、去重） | 用窗口、滚动、Top-N、去重与 NULL 处理回答分析问题 | bigquery_window, bigquery_sql, ga4_scopes |
| 11 | 看板、业务叙事与跨部门沟通 | 面向运营、市场、产品和高管给出结论与行动 | quince_role, levis_role, target_role |
| 12 | 埋点、口径、时区、币种和数据质量 | 发现 schema 漂移、时区错位、币种错配和口径不一致 | ga4_events, ga4_scopes, quince_role |
| 13 | 收入下滑与大促异常诊断 | 建立排查顺序，区分流量、转化、客单、供给和数据问题 | shopify_cohorts, belkin_role, levis_role |
| 14 | 完整模拟面试 | 综合筛选、SQL 讲解、业务 case、行为题和高管汇报 | target_role, disney_role, quince_role, microsoft_srm |

D14 作为综合日，必须能在有限时间内完成：自我介绍、SQL 查询审阅、漏斗/收入诊断、实验设计和高管口头汇报。
