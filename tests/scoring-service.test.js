const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { createContentStore } = require('../server/content-loader');
const { createScoringService, ServiceError } = require('../server/scoring-service');
const { WRITING_IDS, SPEAKING_IDS } = require('../server/result-validator');

const contentStore = createContentStore(path.resolve(__dirname, '..'));
const config = { minAnswerChars: 50, maxAnswerChars: 6000, maxDurationSeconds: 300 };
function fixture(ids, evidence) {
  return { dimensions: ids.map((id) => ({ id, score: 3, evidence, evidenceFound: true, feedback: 'Use a more specific next step.' })), strengths: ['Clear direction'], improvements: ['Define scope'], modelAnswer: 'Improved answer.', summary: 'Preliminary but useful.' };
}

test('writing service validates and recomputes a score', async () => {
  const service = createScoringService({ contentStore, config, openai: { model: 'test', score: async () => fixture(WRITING_IDS, 'I define the business question') } });
  const answer = 'I define the business question and connect it to the revenue gap with a clear next step.';
  const result = await service.scoreWriting({ day: 1, answer });
  assert.equal(result.totalScore, 60);
  assert.equal(result.type, 'writing');
  assert.equal(result.promptVersion, 'ai-scoring-v1');
});

test('writing service rejects short answers before calling the model', async () => {
  let called = false;
  const service = createScoringService({ contentStore, config, openai: { score: async () => { called = true; return fixture(WRITING_IDS, 'x'); } } });
  await assert.rejects(service.scoreWriting({ day: 1, answer: 'too short' }), (error) => error instanceof ServiceError && error.code === 'INVALID_INPUT');
  assert.equal(called, false);
});

test('speaking service transcribes in memory and scores transcript content', async () => {
  let receivedPrompt = '';
  const service = createScoringService({ contentStore, config, openai: {
    model: 'test', transcribeModel: 'transcribe-test',
    transcribe: async (buffer, mimeType) => { assert.equal(buffer.toString(), 'audio'); assert.equal(mimeType, 'audio/webm'); return { text: 'I use a KPI tree to connect revenue to conversion.' }; },
    score: async (prompt) => { receivedPrompt = prompt.input; return fixture(SPEAKING_IDS, 'I use a KPI tree'); }
  } });
  const result = await service.scoreSpeaking({ day: 1, buffer: Buffer.from('audio'), mimeType: 'audio/webm', durationSeconds: 30 });
  assert.equal(result.transcript, 'I use a KPI tree to connect revenue to conversion.');
  assert.equal(result.totalScore, 60);
  assert.match(receivedPrompt, /learner_transcript/);
});

test('speaking service can use separate GLM transcription and DeepSeek scoring clients', async () => {
  const ai = {
    model: 'deepseek-flash',
    score: async () => fixture(SPEAKING_IDS, 'I compare conversion')
  };
  const transcriber = {
    model: 'glm-asr-2512',
    transcribe: async () => ({ text: 'I compare conversion before recommending an action.' })
  };
  const service = createScoringService({ contentStore, config, ai, transcriber });
  const result = await service.scoreSpeaking({ day: 1, buffer: Buffer.from('audio'), mimeType: 'audio/webm', durationSeconds: 20 });
  assert.equal(result.model, 'deepseek-flash');
  assert.equal(result.transcribeModel, 'glm-asr-2512');
  assert.equal(result.transcript, 'I compare conversion before recommending an action.');
});

test('missing key and upstream 429 are mapped safely', async () => {
  const noKey = createScoringService({ contentStore, config, openai: null });
  await assert.rejects(noKey.scoreWriting({ day: 1, answer: 'A'.repeat(60) }), (error) => error.code === 'AI_NOT_CONFIGURED' && error.status === 503);
  const noTranscriber = createScoringService({ contentStore, config, ai: { model: 'test', score: async () => fixture(SPEAKING_IDS, 'evidence') } });
  await assert.rejects(
    noTranscriber.scoreSpeaking({ day: 1, buffer: Buffer.from('audio'), mimeType: 'audio/webm', durationSeconds: 10 }),
    (error) => error.code === 'TRANSCRIPTION_NOT_CONFIGURED' && error.status === 503
  );
  const limited = createScoringService({ contentStore, config, openai: { score: async () => { const error = new Error('rate'); error.status = 429; throw error; } } });
  await assert.rejects(limited.scoreWriting({ day: 1, answer: 'A'.repeat(60) }), (error) => error.code === 'AI_RATE_LIMITED' && error.retryable === true);
});
