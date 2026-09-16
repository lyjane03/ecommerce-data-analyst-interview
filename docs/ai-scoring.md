# AI 辅助评分

## 启动

复制 `.env.example` 为 `.env`，只在本机环境中设置 `DEEPSEEK_API_KEY` 和 `GLM_API_KEY`，然后运行 `npm ci && npm start`。服务默认监听 `127.0.0.1:4173`，不提供公网部署所需的账号、限流或多用户隔离能力。

写作与口语内容评分由 DeepSeek 完成；录音转写由 `glm-asr-2512` 完成。口语转写还要求本机可执行 `ffmpeg`，用于把浏览器录制的 WebM/MP4/OGG 转成 GLM 支持的 WAV，并把超过 30 秒的录音切片。

未配置密钥时，首页和原有听力、测验、人工自评仍可用；设置页与评分页会显示“AI 未配置”。

## 数据边界

案例答案和口语录音只有在用户主动点击 AI 按钮后才会发送到本机服务。案例答案发送给 DeepSeek；录音临时转成 WAV 并发送给 GLM，GLM 返回的 transcript 再发送给 DeepSeek。前端不包含密钥，也不直接请求供应商 API。点击 AI 前，原始录音只存在当前页面内存；点击后，本机服务会在系统临时目录中短暂写入转换文件，并在正常请求结束后删除。答案、transcript、反馈和评分结果可以随现有 JSON 进度备份导出。

口语 AI 先转写，再只根据 transcript 评估任务完成度、分析内容、结构、专业词汇和英文清晰度。它不是发音、口音、语调或自信度测评，这些维度继续由用户人工自评。

## 评分保存规则

AI 返回后，结果会先作为“待复核”结果保存。用户点击“采用 AI 评分并完成”后，才会更新模块顶层 `score`、`scoreSource: "ai"` 和 `completed: true`。人工自评保存为 `selfEvaluation` / `scoreSource: "self"`，不会删除已有 AI 结果。

服务端不信任模型的总分：五个唯一维度必须是 1–5 的整数，应用按 `Math.round(sum / 25 * 100)` 重算。每个有证据的维度还必须提供原回答中的短引文。

## 验证

```bash
npm test
npm run validate
```

配置 DeepSeek 密钥后，使用合成样例做文本冒烟：

```bash
node scripts/live-ai-smoke.js --writing
```

口语冒烟需要同时配置 DeepSeek、GLM，并提供用户明确授权的本地音频文件：

```bash
node scripts/live-ai-smoke.js --speaking /absolute/path/to/authorized-recording.webm
```
