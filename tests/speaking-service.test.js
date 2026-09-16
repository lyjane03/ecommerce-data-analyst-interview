const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { createContentStore } = require('../server/content-loader');
const { createScoringService } = require('../server/scoring-service');
const { SPEAKING_IDS } = require('../server/result-validator');

test('speaking fixture uses five content dimensions and never an acoustic dimension', async () => {
  const service = createScoringService({
    contentStore: createContentStore(path.resolve(__dirname, '..')),
    config: { minAnswerChars: 50, maxAnswerChars: 6000, maxDurationSeconds: 300 },
    openai: {
      model: 'test', transcribeModel: 'test-transcribe',
      transcribe: async () => ({ text: 'I clarify the grain, explain the conversion drop, and propose a next step.' }),
      score: async () => ({
        dimensions: SPEAKING_IDS.map((id) => ({ id, score: 4, evidence: 'I clarify the grain', evidenceFound: true, feedback: 'Good content.' })),
        strengths: ['Concrete method'], improvements: ['Add a result'], modelAnswer: 'Improved spoken answer.', summary: 'Clear content.'
      })
    }
  });
  const result = await service.scoreSpeaking({ day: 1, buffer: Buffer.from('x'), mimeType: 'audio/webm', durationSeconds: 10 });
  assert.equal(result.totalScore, 80);
  assert.deepEqual(result.dimensions.map((item) => item.id), SPEAKING_IDS);
  assert.equal(result.dimensions.some((item) => /pronunciation|accent|confidence/i.test(item.id)), false);
});
