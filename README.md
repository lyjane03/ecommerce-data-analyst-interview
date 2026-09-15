# E-commerce Data Analyst 英语面试训练

一个可离线打开的 14 天英语面试训练应用，面向 2–5 年经验的电商数据分析岗位候选人。

## 使用方式

直接打开 `index.html`，或在本目录启动任意静态文件服务器后访问页面。应用不需要后端、账号或付费 API；学习进度只保存在当前浏览器的 `localStorage` 中。

## 课程范围

14 天 × 4 个模块：听力训练、案例分析、口语训练、每日测验。主题覆盖电商指标与口径、事件漏斗、投放归因、cohort、A/B 测试、商品促销、库存履约、SQL、看板叙事、数据质量和综合诊断。

页面中的公司、金额、订单量、实验结果和业务情境均为 synthetic / 模拟数据，不代表任何公司的真实内部数据。

## 数据与隐私

新版使用独立的 `ecommerceDataAnalystInterviewApp:v1` 存储空间。导出文件包含 `appId` 与 `schemaVersion`；导入时会拒绝其他应用的备份，避免不同课程版本串线。

指标口径、平台事件和岗位能力依据 `docs/sources.md` 中的来源清单整理；题目均为原创改写，不复制来源原文。

## 验证

```text
node scripts/validate-content.js --all
```
