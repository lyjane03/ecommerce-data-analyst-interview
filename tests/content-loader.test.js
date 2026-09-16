const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { createContentStore, ContentError } = require('../server/content-loader');

const store = createContentStore(path.resolve(__dirname, '..'));

test('loads all trusted writing and speaking contexts', () => {
  assert.equal(store.dayCount, 14);
  for (let day = 1; day <= 14; day += 1) {
    const writing = store.getWritingContext(day);
    const speaking = store.getSpeakingContext(day);
    assert.equal(writing.day, day);
    assert.equal(writing.writing.rubric.length, 5);
    assert.equal(new Set(writing.writing.rubric.map((item) => item.id)).size, 5);
    assert.equal(speaking.speaking.outline.length, 4);
  }
});

test('rejects invalid days and does not accept string injection', () => {
  assert.throws(() => store.getWritingContext(0), ContentError);
  assert.throws(() => store.getWritingContext(15), ContentError);
  assert.throws(() => store.getWritingContext('1'), ContentError);
});

test('returns defensive copies of course context', () => {
  const first = store.getWritingContext(1);
  first.writing.title = 'tampered';
  assert.notEqual(store.getWritingContext(1).writing.title, 'tampered');
});
