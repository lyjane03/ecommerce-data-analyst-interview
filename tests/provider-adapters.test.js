const test = require('node:test');
const assert = require('node:assert/strict');
const { createDeepSeekAdapter, extractOutputText } = require('../server/deepseek-client');
const { createGlmTranscriptionAdapter, mapLimit, extensionFor } = require('../server/glm-transcription-client');

test('DeepSeek adapter uses Responses API structured output', async () => {
  let request;
  const client = {
    responses: {
      create: async (value) => {
        request = value;
        return { output_text: '{"summary":"ok"}' };
      }
    }
  };
  const adapter = createDeepSeekAdapter({ scoringModel: 'deepseek-flash' }, client);
  const result = await adapter.score({ instructions: 'Return JSON', input: 'answer', text: { format: { type: 'json_schema', strict: true, schema: {} } } });
  assert.deepEqual(result, { summary: 'ok' });
  assert.equal(request.model, 'deepseek-flash');
  assert.equal(request.reasoning.effort, 'none');
  assert.equal(request.text.format.type, 'json_schema');
  assert.equal(Object.hasOwn(request.text.format, 'strict'), false);
});

test('DeepSeek adapter extracts output text from response items', () => {
  assert.equal(extractOutputText({ output: [{ content: [{ type: 'output_text', text: '{"ok":true}' }] }] }), '{"ok":true}');
});

test('GLM adapter transcribes converted WAV chunks and preserves order', async () => {
  let cleaned = 0;
  const calls = [];
  const adapter = createGlmTranscriptionAdapter({
    glmApiKey: 'test-key', glmBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    transcribeModel: 'glm-asr-2512', upstreamTimeoutMs: 1000
  }, {
    convertAudio: async () => [
      { buffer: Buffer.from('one'), name: 'segment-000.wav', cleanup: async () => { cleaned += 1; } },
      { buffer: Buffer.from('two'), name: 'segment-001.wav' }
    ],
    fetch: async (url, options) => {
      calls.push({ url, options });
      const file = options.body.get('file');
      return { ok: true, json: async () => ({ text: file.name.includes('000') ? 'first part' : 'second part' }) };
    }
  });
  const result = await adapter.transcribe(Buffer.from('audio'), 'audio/webm');
  assert.equal(result.text, 'first part second part');
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, 'https://open.bigmodel.cn/api/paas/v4/audio/transcriptions');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-key');
  assert.equal(calls[0].options.body.get('model'), 'glm-asr-2512');
  assert.equal(cleaned, 1);
});

test('GLM helpers keep result order and map browser MIME types', async () => {
  const result = await mapLimit([30, 5, 20], 2, async (value) => {
    await new Promise((resolve) => setTimeout(resolve, value));
    return value;
  });
  assert.deepEqual(result, [30, 5, 20]);
  assert.equal(extensionFor('audio/mp4;codecs=mp4a'), 'm4a');
  assert.equal(extensionFor('audio/webm'), 'webm');
});
