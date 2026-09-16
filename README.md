# E-commerce Data Analyst 英语面试训练

一个本地运行的 14 天英语面试训练应用，面向 2–5 年经验的电商数据分析岗位候选人。无需 AI 时可直接使用人工自评；配置本机服务后可主动调用 AI 辅助评分。

## 使用方式

无需 AI 时可以直接打开 `index.html`，或启动任意静态文件服务器。要启用 AI 评分，请复制 `.env.example` 为 `.env`，填入 `DEEPSEEK_API_KEY`；如需录音转写，再填入 `GLM_API_KEY`。然后运行：

```bash
npm ci
npm start
```

访问 `http://127.0.0.1:4173`。服务默认只绑定本机；不要把它直接暴露到公网。

## GitHub Pages

仓库根目录可以直接作为静态页面发布到 GitHub Pages。Pages 只托管前端，不运行 `server/` 中的本机 API；因此听力、测验、进度和人工自评可在线使用，AI 评分与录音转写仍需按上面的方式启动本机服务。

## 课程范围

14 天 × 4 个模块：听力训练、案例分析、口语训练、每日测验。主题覆盖电商指标与口径、事件漏斗、投放归因、cohort、A/B 测试、商品促销、库存履约、SQL、看板叙事、数据质量和综合诊断。

页面中的公司、金额、订单量、实验结果和业务情境均为 synthetic / 模拟数据，不代表任何公司的真实内部数据。

## 数据与隐私

学习进度、答案、transcript 和评分反馈使用独立的 `ecommerceDataAnalystInterviewApp:v1` 存储空间。导出文件包含 `appId` 与 `schemaVersion`；导入时会拒绝其他应用的备份，避免不同课程版本串线。原始口语音频不会写入 `localStorage` 或日志；点击 AI 评分后，本机服务只在系统临时目录中生成转写所需的音频片段，并在正常请求结束后删除。

AI 评分只在用户主动点击后调用：案例答案发送给 DeepSeek；口语录音先在本机用 ffmpeg 转成 WAV 并切为不超过 29 秒的片段，发送给 GLM-ASR 转写，再把 transcript 发送给 DeepSeek 评分。不会自动批量上传历史内容，临时音频片段会在请求结束后删除。口语 AI 评估 transcript 的任务完成度、分析内容、结构、专业词汇和英文清晰度，不评发音、口音、语调或自信度。AI 结果先作为待复核结果保存，用户确认采用后才成为模块顶层分数；未配置 AI 或调用失败时，人工自评仍可用。

口语转写依赖本机 `ffmpeg`。macOS 可通过 Homebrew 安装：`brew install ffmpeg`；如命令不在 PATH 中，可在 `.env` 设置 `FFMPEG_PATH` 为其绝对路径。

指标口径、平台事件和岗位能力依据 `docs/sources.md` 中的来源清单整理；题目均为原创改写，不复制来源原文。

## 验证

```text
node scripts/validate-content.js --all
npm test
npm run validate
```
