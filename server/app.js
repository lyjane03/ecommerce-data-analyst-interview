const path = require('path');
const express = require('express');
const multer = require('multer');
const config = require('./config');
const { createContentStore, ContentError } = require('./content-loader');
const { createDeepSeekAdapter } = require('./deepseek-client');
const { createGlmTranscriptionAdapter } = require('./glm-transcription-client');
const { ServiceError, createScoringService } = require('./scoring-service');

function errorPayload(error) {
  const known = error instanceof ServiceError;
  return {
    error: {
      code: known ? error.code : 'INTERNAL_ERROR',
      message: known ? error.message : '服务发生错误，请稍后重试。',
      retryable: known ? error.retryable : false
    }
  };
}

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ServiceError('AI_TIMEOUT', 'AI 服务响应超时，请稍后重试。', 504, true)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return url.protocol === 'http:' && url.host === req.headers.host;
  } catch (_) { return false; }
}

function validDay(day) {
  return Number.isInteger(day) && day >= 1 && day <= 14;
}

function createApp(options = {}) {
  const runtimeConfig = { ...config, ...(options.config || {}) };
  const contentStore = options.contentStore || createContentStore(runtimeConfig.rootDir);
  const ai = options.ai || options.openai || createDeepSeekAdapter(runtimeConfig, options.aiClient || options.openaiClient);
  const transcriber = options.transcriber || createGlmTranscriptionAdapter(runtimeConfig, options.transcriptionDependencies);
  const scoringService = options.scoringService || createScoringService({ contentStore, ai, openai: ai, transcriber, config: runtimeConfig });
  const app = express();

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    next();
  });
  app.use('/api', (req, res, next) => {
    if (!sameOrigin(req)) return res.status(403).json({ error: { code: 'ORIGIN_REJECTED', message: '只接受本机同源请求。', retryable: false } });
    next();
  });
  app.use(express.json({ limit: runtimeConfig.jsonLimitBytes }));

  app.get('/api/health', (req, res) => res.json({
    ok: true,
    aiConfigured: !!ai,
    scoringConfigured: !!ai,
    transcriptionConfigured: !!transcriber,
    speakingAIConfigured: !!ai && !!transcriber,
    aiProvider: runtimeConfig.aiProvider || 'deepseek',
    transcribeProvider: runtimeConfig.transcribeProvider || 'glm',
    scoringModel: runtimeConfig.scoringModel,
    transcribeModel: runtimeConfig.transcribeModel
  }));

  app.post('/api/score/writing', async (req, res, next) => {
    try {
      const body = req.body || {};
      const day = Number.isInteger(body.day) ? body.day : NaN;
      if (!validDay(day) || typeof body.answer !== 'string') throw new ServiceError('INVALID_INPUT', '请提供有效的 day 和案例答案。', 400, false);
      const result = await withTimeout(scoringService.scoreWriting({ day, answer: body.answer }), runtimeConfig.requestTimeoutMs);
      res.json(result);
    } catch (error) { next(error); }
  });

  app.post('/api/score/speaking-transcript', async (req, res, next) => {
    try {
      const body = req.body || {};
      const day = Number.isInteger(body.day) ? body.day : NaN;
      if (!validDay(day) || typeof body.transcript !== 'string') {
        throw new ServiceError('INVALID_INPUT', '请提供有效的 day 和英文 transcript。', 400, false);
      }
      const result = await withTimeout(scoringService.scoreSpeakingTranscript({ day, transcript: body.transcript }), runtimeConfig.requestTimeoutMs);
      res.json(result);
    } catch (error) { next(error); }
  });

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: runtimeConfig.maxAudioBytes, files: 1 },
    fileFilter: (req, file, callback) => {
      const accepted = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav'].some((type) => file.mimetype.toLowerCase().startsWith(type));
      callback(accepted ? null : new ServiceError('INVALID_AUDIO_TYPE', '只支持浏览器录音的 webm、ogg、mp4、mp3 或 wav 格式。', 400, false), accepted);
    }
  });

  app.post('/api/score/speaking', (req, res, next) => {
    upload.single('audio')(req, res, async (uploadError) => {
      try {
        if (uploadError) throw uploadError;
        const day = Number(req.body && req.body.day);
        const durationSeconds = Number(req.body && req.body.durationSeconds);
        if (!validDay(day) || !req.file) throw new ServiceError('INVALID_INPUT', '请提供有效的 day 和录音文件。', 400, false);
        const result = await withTimeout(scoringService.scoreSpeaking({ day, buffer: req.file.buffer, mimeType: req.file.mimetype, durationSeconds }), runtimeConfig.requestTimeoutMs);
        req.file.buffer = null;
        res.json(result);
      } catch (error) {
        if (req.file) req.file.buffer = null;
        next(error);
      }
    });
  });

  app.use(express.static(runtimeConfig.rootDir, { index: 'index.html' }));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(runtimeConfig.rootDir, 'index.html'));
  });

  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error && error.type === 'entity.too.large') {
      return res.status(413).json({ error: { code: 'JSON_TOO_LARGE', message: '请求内容不能超过 64 KiB。', retryable: false } });
    }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: { code: 'AUDIO_TOO_LARGE', message: '录音文件不能超过 15 MiB。', retryable: false } });
    }
    if (error instanceof SyntaxError && error.status === 400) {
      return res.status(400).json({ error: { code: 'INVALID_JSON', message: '请求格式不是有效 JSON。', retryable: false } });
    }
    if (error instanceof ContentError) {
      return res.status(500).json({ error: { code: 'CONTENT_ERROR', message: '课程内容加载失败。', retryable: false } });
    }
    const payload = errorPayload(error);
    return res.status(error instanceof ServiceError ? error.status : 500).json(payload);
  });
  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(config.port, config.host, () => {
    console.log(`E-commerce interview app listening at http://${config.host}:${config.port}`);
    console.log(`DeepSeek scoring configured: ${!!config.aiApiKey}`);
    console.log(`GLM transcription configured: ${!!config.glmApiKey}`);
  });
}

module.exports = { createApp, withTimeout, sameOrigin };
