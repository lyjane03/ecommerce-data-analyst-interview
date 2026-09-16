const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

function createGlmTranscriptionAdapter(config, dependencies = {}) {
  if (!config.glmApiKey) return null;
  const fetchImpl = dependencies.fetch || globalThis.fetch;
  const convertAudio = dependencies.convertAudio || convertAudioToWavSegments;

  async function transcribe(buffer, mimeType) {
    const segments = await convertAudio(buffer, mimeType, config);
    try {
      const texts = await mapLimit(segments, 3, async (segment) => {
        const data = await requestTranscript(segment, config, fetchImpl);
        return typeof data.text === 'string' ? data.text.trim() : '';
      });
      return { text: texts.filter(Boolean).join(' ').trim() };
    } finally {
      await Promise.all(segments.map((segment) => segment.cleanup ? segment.cleanup() : Promise.resolve()));
    }
  }

  return { transcribe, model: config.transcribeModel, provider: 'glm' };
}

async function requestTranscript(segment, config, fetchImpl) {
  const form = new FormData();
  form.append('model', config.transcribeModel);
  form.append('stream', 'false');
  form.append('prompt', 'English e-commerce data analyst interview. Preserve metrics and analytics terminology.');
  const bytes = segment.buffer || await fsp.readFile(segment.path);
  form.append('file', new Blob([bytes], { type: 'audio/wav' }), segment.name || 'speaking.wav');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.upstreamTimeoutMs);
  let response;
  try {
    response = await fetchImpl(`${String(config.glmBaseUrl).replace(/\/$/, '')}/audio/transcriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.glmApiKey}` },
      body: form,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('GLM 音频转写失败');
    error.status = response.status;
    error.code = 'GLM_TRANSCRIPTION_FAILED';
    error.providerMessage = body && body.error && body.error.message;
    throw error;
  }
  return body;
}

async function convertAudioToWavSegments(buffer, mimeType, config) {
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'interview-asr-'));
  const inputPath = path.join(tempDir, `input.${extensionFor(mimeType)}`);
  const outputPattern = path.join(tempDir, 'segment-%03d.wav');
  await fsp.writeFile(inputPath, buffer);
  try {
    await runProcess(config.ffmpegPath, [
      '-hide_banner', '-loglevel', 'error', '-i', inputPath,
      '-vn', '-ac', '1', '-ar', '16000',
      '-f', 'segment', '-segment_time', String(config.audioSegmentSeconds || 25),
      '-reset_timestamps', '1', outputPattern
    ]);
    const names = (await fsp.readdir(tempDir)).filter((name) => /^segment-\d+\.wav$/.test(name)).sort();
    if (!names.length) throw new Error('没有生成可转写的音频片段');
    let cleaned = false;
    const cleanup = async () => {
      if (cleaned) return;
      cleaned = true;
      await fsp.rm(tempDir, { recursive: true, force: true });
    };
    return names.map((name, index) => ({ path: path.join(tempDir, name), name, cleanup: index === 0 ? cleanup : null }));
  } catch (error) {
    await fsp.rm(tempDir, { recursive: true, force: true });
    throw error;
  }
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      if (error.code === 'ENOENT') error.code = 'FFMPEG_NOT_FOUND';
      reject(error);
    });
    child.on('close', (code) => {
      if (code === 0) return resolve();
      const error = new Error(stderr.trim() || `ffmpeg exited with code ${code}`);
      error.code = 'AUDIO_CONVERSION_FAILED';
      reject(error);
    });
  });
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  let failure = null;
  async function run() {
    while (next < items.length && !failure) {
      const index = next++;
      try {
        results[index] = await worker(items[index], index);
      } catch (error) {
        failure = failure || error;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  if (failure) throw failure;
  return results;
}

function extensionFor(mimeType) {
  const type = String(mimeType || '').split(';')[0].toLowerCase();
  return type === 'audio/ogg' ? 'ogg' : type === 'audio/mp4' ? 'm4a' : type === 'audio/mpeg' ? 'mp3' : type === 'audio/wav' ? 'wav' : 'webm';
}

module.exports = {
  createGlmTranscriptionAdapter,
  requestTranscript,
  convertAudioToWavSegments,
  mapLimit,
  extensionFor
};
