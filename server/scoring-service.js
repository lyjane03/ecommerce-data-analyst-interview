const { WRITING_IDS, SPEAKING_IDS, ResultValidationError, validateEvaluation } = require('./result-validator');
const { writingPrompt, speakingPrompt, PROMPT_VERSION } = require('./prompt-builder');

class ServiceError extends Error {
  constructor(code, message, status, retryable = false) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

function mapUpstreamError(error) {
  if (error instanceof ServiceError) return error;
  const status = Number(error && (error.status || error.statusCode));
  if (error && error.code === 'FFMPEG_NOT_FOUND') {
    return new ServiceError('AUDIO_CONVERTER_NOT_CONFIGURED', '本机未找到 ffmpeg，无法把浏览器录音转换为 GLM 支持的格式。', 503, false);
  }
  if (error && error.code === 'AUDIO_CONVERSION_FAILED') {
    return new ServiceError('AUDIO_CONVERSION_FAILED', '录音格式转换失败，请重新录音。', 422, true);
  }
  if (status === 401 || status === 403) return new ServiceError('AI_AUTH_ERROR', 'AI API Key 无效或没有对应模型权限。', 503, false);
  if (status === 429) return new ServiceError('AI_RATE_LIMITED', 'AI 服务当前限流，请稍后重试。', 429, true);
  if (status >= 500) return new ServiceError('AI_UPSTREAM_ERROR', 'AI 服务暂时不可用，请稍后重试。', 502, true);
  if (error && (error.name === 'AbortError' || error.name === 'TimeoutError' || /timeout/i.test(error.message || ''))) {
    return new ServiceError('AI_TIMEOUT', 'AI 服务响应超时，请稍后重试。', 504, true);
  }
  return new ServiceError('AI_UPSTREAM_ERROR', 'AI 服务暂时不可用，请稍后重试。', 502, true);
}

function ensureText(value, min, max, label) {
  if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
    throw new ServiceError('INVALID_INPUT', `${label}长度必须在 ${min}–${max} 字符之间。`, 400, false);
  }
  return value.trim();
}

function createScoringService({ contentStore, openai, ai, transcriber, config }) {
  const modelClient = ai || openai;
  const transcriptionClient = transcriber || (openai && typeof openai.transcribe === 'function' ? openai : null);

  function requireAI() {
    if (!modelClient) throw new ServiceError('AI_NOT_CONFIGURED', 'DeepSeek 尚未配置。请设置 DEEPSEEK_API_KEY 后重启本机服务。', 503, false);
  }

  function requireTranscriber() {
    if (!transcriptionClient) throw new ServiceError('TRANSCRIPTION_NOT_CONFIGURED', 'GLM 音频转写尚未配置。请设置 GLM_API_KEY 后重启本机服务。', 503, false);
  }

  async function evaluateSpeakingTranscript({ day, transcript, transcribeModel }) {
    const text = ensureText(transcript, 10, config.maxAnswerChars, '英文 transcript');
    requireAI();
    const context = contentStore.getSpeakingContext(day);
    const prompt = speakingPrompt(context, text);
    let raw;
    try { raw = await modelClient.score(prompt); } catch (error) { throw mapUpstreamError(error); }
    let evaluation;
    try { evaluation = validateEvaluation(raw, SPEAKING_IDS, text); }
    catch (error) {
      if (error instanceof ResultValidationError) throw new ServiceError('AI_INVALID_RESPONSE', '评分结果无法通过安全校验，请重试。', 502, false);
      throw error;
    }
    return {
      type: 'speaking', day, transcript: text, promptVersion: PROMPT_VERSION,
      model: modelClient.model, transcribeModel: transcribeModel || 'provided-transcript',
      evaluatedAt: new Date().toISOString(), ...evaluation
    };
  }

  async function scoreWriting({ day, answer }) {
    const text = ensureText(answer, config.minAnswerChars, config.maxAnswerChars, '案例答案');
    requireAI();
    const context = contentStore.getWritingContext(day);
    const prompt = writingPrompt(context, text);
    let raw;
    try { raw = await modelClient.score(prompt); } catch (error) { throw mapUpstreamError(error); }
    let evaluation;
    try { evaluation = validateEvaluation(raw, WRITING_IDS, text); }
    catch (error) {
      if (error instanceof ResultValidationError) throw new ServiceError('AI_INVALID_RESPONSE', '评分结果无法通过安全校验，请重试。', 502, false);
      throw error;
    }
    return { type: 'writing', day, promptVersion: PROMPT_VERSION, model: modelClient.model, evaluatedAt: new Date().toISOString(), ...evaluation };
  }

  async function scoreSpeaking({ day, buffer, mimeType, durationSeconds }) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw new ServiceError('INVALID_INPUT', '请提供有效录音。', 400, false);
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > config.maxDurationSeconds) {
      throw new ServiceError('INVALID_INPUT', `录音时长必须在 1–${config.maxDurationSeconds} 秒之间。`, 400, false);
    }
    requireAI();
    requireTranscriber();
    let transcription;
    try { transcription = await transcriptionClient.transcribe(buffer, mimeType); } catch (error) { throw mapUpstreamError(error); }
    const transcript = transcription && typeof transcription.text === 'string' ? transcription.text.trim() : '';
    if (transcript.length < 10) throw new ServiceError('EMPTY_TRANSCRIPT', '没有识别到足够的英文内容，请重新录音。', 502, true);
    return evaluateSpeakingTranscript({ day, transcript, transcribeModel: transcriptionClient.transcribeModel || transcriptionClient.model || config.transcribeModel });
  }

  return { scoreWriting, scoreSpeaking, scoreSpeakingTranscript: evaluateSpeakingTranscript };
}

module.exports = { ServiceError, createScoringService, mapUpstreamError, ensureText };
