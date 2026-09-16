const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createApp } = require('../server/app');

function request(app, options, body) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const req = http.request({ hostname: '127.0.0.1', port: address.port, path: options.path, method: options.method || 'GET', headers: options.headers || {} }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => { server.close(); resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString() }); });
      });
      req.on('error', (error) => { server.close(); reject(error); });
      if (body) req.write(body);
      req.end();
    });
  });
}

function multipart(fields, file) {
  const boundary = '----codex-ai-test-boundary';
  const chunks = [];
  Object.entries(fields).forEach(([name, value]) => chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`)));
  chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="sample.webm"\r\nContent-Type: ${file.type}\r\n\r\n`));
  chunks.push(file.buffer);
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  return { boundary, body: Buffer.concat(chunks) };
}

test('health reports unconfigured AI and static home remains available', async () => {
  const app = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '' } });
  const health = await request(app, { path: '/api/health' });
  assert.equal(health.status, 200);
  assert.equal(JSON.parse(health.body).aiConfigured, false);
  assert.equal(JSON.parse(health.body).transcriptionConfigured, false);
  const home = await request(app, { path: '/index.html' });
  assert.equal(home.status, 200);
  assert.match(home.body, /E-commerce Data Analyst/);
});

test('health reports DeepSeek scoring and GLM transcription independently', async () => {
  const app = createApp({ ai: { model: 'deepseek-flash' }, transcriber: { model: 'glm-asr-2512' } });
  const health = await request(app, { path: '/api/health' });
  const body = JSON.parse(health.body);
  assert.equal(body.scoringConfigured, true);
  assert.equal(body.transcriptionConfigured, true);
  assert.equal(body.speakingAIConfigured, true);
  assert.equal(body.aiProvider, 'deepseek');
  assert.equal(body.transcribeProvider, 'glm');
});

test('writing endpoint enforces day and answer bounds without a key', async () => {
  const app = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '' } });
  const short = JSON.stringify({ day: 1, answer: 'short' });
  const shortResponse = await request(app, { path: '/api/score/writing', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(short) } }, short);
  assert.equal(shortResponse.status, 400);
  assert.equal(JSON.parse(shortResponse.body).error.code, 'INVALID_INPUT');
  const invalidDay = JSON.stringify({ day: 0, answer: 'A'.repeat(60) });
  const invalidResponse = await request(app, { path: '/api/score/writing', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(invalidDay) } }, invalidDay);
  assert.equal(invalidResponse.status, 400);
  const noKey = JSON.stringify({ day: 1, answer: 'A'.repeat(60) });
  const noKeyResponse = await request(app, { path: '/api/score/writing', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(noKey) } }, noKey);
  assert.equal(noKeyResponse.status, 503);
  assert.equal(JSON.parse(noKeyResponse.body).error.code, 'AI_NOT_CONFIGURED');
});

test('API rejects cross-origin requests and does not emit wildcard CORS', async () => {
  const app = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '' } });
  const response = await request(app, { path: '/api/health', headers: { Origin: 'https://evil.example' } });
  assert.equal(response.status, 403);
  assert.equal(response.headers['access-control-allow-origin'], undefined);
});

test('API returns 413 for oversized JSON and audio', async () => {
  const jsonApp = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '' } });
  const huge = JSON.stringify({ day: 1, answer: 'A'.repeat(70 * 1024) });
  const jsonResponse = await request(jsonApp, { path: '/api/score/writing', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(huge) } }, huge);
  assert.equal(jsonResponse.status, 413);
  assert.equal(JSON.parse(jsonResponse.body).error.code, 'JSON_TOO_LARGE');
  const audioApp = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '', maxAudioBytes: 5 } });
  const form = multipart({ day: 1, durationSeconds: 10 }, { type: 'audio/webm', buffer: Buffer.from('123456') });
  const audioResponse = await request(audioApp, { path: '/api/score/speaking', method: 'POST', headers: { 'Content-Type': `multipart/form-data; boundary=${form.boundary}`, 'Content-Length': form.body.length } }, form.body);
  assert.equal(audioResponse.status, 413);
  assert.equal(JSON.parse(audioResponse.body).error.code, 'AUDIO_TOO_LARGE');
});

test('speaking route rejects unsupported MIME before any model call', async () => {
  const app = createApp({ config: { aiApiKey: '', deepseekApiKey: '', glmApiKey: '' } });
  const form = multipart({ day: 1, durationSeconds: 10 }, { type: 'text/plain', buffer: Buffer.from('not audio') });
  const response = await request(app, { path: '/api/score/speaking', method: 'POST', headers: { 'Content-Type': `multipart/form-data; boundary=${form.boundary}`, 'Content-Length': form.body.length } }, form.body);
  assert.equal(response.status, 400);
  assert.equal(JSON.parse(response.body).error.code, 'INVALID_AUDIO_TYPE');
});

test('configured writing route delegates only day and answer to service', async () => {
  let received;
  const app = createApp({
    config: { aiApiKey: 'configured-for-test', glmApiKey: '' },
    openai: {},
    scoringService: { scoreWriting: async (value) => { received = value; return { totalScore: 80, dimensions: [], strengths: [], improvements: [], modelAnswer: '', summary: '' }; } }
  });
  const body = JSON.stringify({ day: 1, answer: 'A'.repeat(60), rubric: 'client cannot override this' });
  const response = await request(app, { path: '/api/score/writing', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, body);
  assert.equal(response.status, 200);
  assert.deepEqual(received, { day: 1, answer: 'A'.repeat(60) });
});
