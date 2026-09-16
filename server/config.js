const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

const config = {
  rootDir: path.resolve(__dirname, '..'),
  host: process.env.HOST || '127.0.0.1',
  port: positiveInteger(process.env.PORT, 4173) || 4173,
  aiProvider: process.env.AI_PROVIDER || 'deepseek',
  aiApiKey: process.env.DEEPSEEK_API_KEY || '',
  aiBaseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  deepseekApiKey: process.env.DEEPSEEK_API_KEY || '',
  deepseekBaseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
  scoringModel: process.env.AI_SCORING_MODEL || process.env.DEEPSEEK_SCORING_MODEL || 'deepseek-flash',
  transcribeProvider: process.env.TRANSCRIBE_PROVIDER || 'glm',
  glmApiKey: process.env.GLM_API_KEY || '',
  glmBaseUrl: process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
  transcribeModel: process.env.GLM_TRANSCRIBE_MODEL || 'glm-asr-2512',
  ffmpegPath: process.env.FFMPEG_PATH || 'ffmpeg',
  audioSegmentSeconds: Math.min(29, positiveInteger(process.env.AUDIO_SEGMENT_SECONDS, 25) || 25),
  jsonLimitBytes: 64 * 1024,
  minAnswerChars: 50,
  maxAnswerChars: 6000,
  maxAudioBytes: 15 * 1024 * 1024,
  maxDurationSeconds: 300,
  requestTimeoutMs: 150 * 1000,
  upstreamTimeoutMs: 60 * 1000
};

module.exports = config;
