# 来源账本

核验日期统一为 2026-09-15。来源用于校准术语、指标口径、平台事件模型和岗位能力；训练案例中的数值均为 synthetic / 模拟数据。

| ID | 来源 / 发布者 | 类型 | 层级 | 发布或更新日期 | 核验日期 | 适用主题 |
| --- | --- | --- | --- | --- | --- | --- |
| `target_role` | [Sr. Data Analyst – Digital and Ecommerce, Target](https://target.wd5.myworkdayjobs.com/en-US/targetcareers/job/Sr-Data-Analyst---Digital-and-Ecommerce_R0000437894) | 当前官方岗位 | A | — | 2026-09-15 | SQL、Python/R、实验、时间序列、看板 |
| `disney_role` | [Data Analyst, Disney Commerce Analytics](https://disney.wd5.myworkdayjobs.com/en-US/disneycareer/job/Data-Analyst_10158683) | 当前官方岗位 | A | — | 2026-09-15 | 指标、实验、支付/欺诈、汇报 |
| `quince_role` | [Storefront Analytics, Quince](https://job-boards.greenhouse.io/quince/jobs/5207417008) | 当前官方岗位 | A | — | 2026-09-15 | 漏斗、行为、埋点、数据治理 |
| `belkin_role` | [Data Analyst – Retail & eCommerce Analytics, Belkin](https://belkin.wd5.myworkdayjobs.com/en-US/Belkin_Careers/job/Data-Analyst---Retail---eCommerce-Analytics_10012825) | 当前官方岗位 | A | — | 2026-09-15 | DTC、平台电商、投放、看板 |
| `levis_role` | [Senior Data Analyst – DTC / Consumer / Ecommerce Analytics, Levi Strauss](https://levistraussandco.wd5.myworkdayjobs.com/pl-PL/External/job/Barcelona-Spain/Senior-Data-Analyst--DTC--Consumer---Ecommerce-Analytics-_R-0153130) | 当前官方岗位 | A | — | 2026-09-15 | cohort、funnel、CLV、促销、dbt、数据质量 |
| `ga4_events` | [Recommended events for online sales, Google Analytics](https://support.google.com/analytics/answer/14430645?hl=en) | 官方产品文档 | A | — | 2026-09-15 | view、select、cart、checkout、purchase、refund |
| `ga4_scopes` | [Event and item scopes, Google Analytics](https://support.google.com/analytics/answer/12947610?hl=en) | 官方产品文档 | A | — | 2026-09-15 | event/item 粒度与参数 |
| `shopify_cohorts` | [Live View, benchmarks and customer cohort analysis, Shopify](https://changelog.shopify.com/posts/live-view-benchmarks-and-customer-cohort-analysis-are-now-supported-in-the-new-analytics-experience) | 官方产品更新 | A | — | 2026-09-15 | 实时监控、benchmark、cohort |
| `amazon_acos` | [ACOS and ROAS guide, Amazon Ads](https://advertising.amazon.com/library/guides/acos-advertising-cost-of-sales) | 官方广告文档 | A | — | 2026-09-15 | ACOS、ROAS、利润约束 |
| `microsoft_srm` | [Alerting in Microsoft Experimentation Platform](https://www.microsoft.com/en-us/research/articles/alerting-in-microsofts-experimentation-platform-exp/) | 官方研究说明 | B | — | 2026-09-15 | SRM、分流比例、卡方检查 |
| `bigquery_window` | [Window function calls, GoogleSQL reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/window-function-calls) | 官方技术文档 | A | — | 2026-09-15 | 窗口函数、排名、滚动计算 |
| `bigquery_sql` | [Query syntax, GoogleSQL reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax) | 官方技术文档 | A | — | 2026-09-15 | CTE、JOIN、GROUP BY、NULL |
| `ga4_attribution` | [Attribution reporting, Google Analytics](https://support.google.com/analytics/answer/10596866?hl=en) | 官方产品文档 | A | — | 2026-09-15 | 归因模型、转化路径、渠道 |
| `stats_power` | [Sample size and power, Penn State STAT](https://online.stat.psu.edu/stat200/lesson/5/5.3) | 大学统计课程 | B | — | 2026-09-15 | 样本量、检验力、实验规划 |

来源选择规则：Tier A/B 才可单独支撑公式或答案键；没有纳入 Tier C 社交来源。每个词汇、听力理解题、测验题、书面案例和口语模块都带有 `sourceIds`，由 `scripts/validate-content.js` 检查是否悬空。

