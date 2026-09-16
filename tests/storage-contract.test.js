const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function storage() {
  const values = new Map();
  const context = vm.createContext({
    localStorage: { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value) },
    Date, JSON, Blob: function Blob() {}, URL: {}, document: {}, FileReader: function FileReader() {}
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js/storage.js'), 'utf8'), context);
  return context.AppStorage;
}

test('AI and self evaluation fields merge without overwriting each other', () => {
  const app = storage();
  app.init();
  app.saveDayProgress(1, 'writing', { score: 80, scoreSource: 'self', completed: true, response: 'original answer', selfEvaluation: { score: 80, rubricScores: { problem: 4 } } });
  app.saveDayProgress(1, 'writing', { aiEvaluation: { totalScore: 72, dimensions: [] }, response: 'updated answer' });
  const writing = app.getDayProgress(1).writing;
  assert.equal(writing.score, 80);
  assert.equal(writing.scoreSource, 'self');
  assert.equal(writing.response, 'updated answer');
  assert.deepEqual(writing.selfEvaluation.rubricScores, { problem: 4 });
  assert.equal(writing.aiEvaluation.totalScore, 72);
  assert.equal(app.APP_ID, 'ecommerce-data-analyst-interview');
  assert.equal(app.SCHEMA_VERSION, 1);
});

test('source labels distinguish AI and self scores', () => {
  const app = storage();
  assert.equal(app.scoreSourceLabel({ scoreSource: 'ai' }), 'AI评分');
  assert.equal(app.scoreSourceLabel({ scoreSource: 'self' }), '自评');
  assert.equal(app.scoreSourceLabel({}), '');
});
