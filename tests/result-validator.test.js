const test = require('node:test');
const assert = require('node:assert/strict');
const { validateEvaluation, scoreFromDimensions, ResultValidationError, WRITING_IDS } = require('../server/result-validator');

function valid(evidence = 'I define the business question') {
  return {
    dimensions: WRITING_IDS.map((id, index) => ({ id, score: index + 1, evidence, evidenceFound: true, feedback: 'Clear feedback.' })),
    strengths: ['Specific conclusion'],
    improvements: ['Clarify denominator'],
    modelAnswer: 'A concise improved answer.',
    summary: 'A preliminary analysis with a useful direction.'
  };
}

test('recalculates total score from exactly five dimensions', () => {
  const result = validateEvaluation(valid(), WRITING_IDS, 'I define the business question and state the gap.');
  assert.equal(result.totalScore, scoreFromDimensions(result.dimensions));
  assert.equal(result.totalScore, 60);
});

test('rejects duplicate, missing, out-of-range, and fabricated evidence', () => {
  const duplicate = valid(); duplicate.dimensions[1].id = duplicate.dimensions[0].id;
  assert.throws(() => validateEvaluation(duplicate, WRITING_IDS, 'I define the business question.'), ResultValidationError);
  const missing = valid(); missing.dimensions.pop();
  assert.throws(() => validateEvaluation(missing, WRITING_IDS, 'I define the business question.'), ResultValidationError);
  const outOfRange = valid(); outOfRange.dimensions[0].score = 6;
  assert.throws(() => validateEvaluation(outOfRange, WRITING_IDS, 'I define the business question.'), ResultValidationError);
  const fakeEvidence = valid('This sentence is not in the answer');
  assert.throws(() => validateEvaluation(fakeEvidence, WRITING_IDS, 'I define the business question.'), ResultValidationError);
});

test('allows an explicit missing-evidence explanation', () => {
  const result = valid();
  result.dimensions[0] = { id: 'problem', score: 1, evidence: 'No direct evidence found', evidenceFound: false, feedback: 'The answer does not state the business question.' };
  result.dimensions.slice(1).forEach((item) => { item.evidenceFound = false; item.evidence = 'No direct evidence found'; });
  assert.equal(validateEvaluation(result, WRITING_IDS, 'The answer contains a conclusion.').dimensions[0].evidenceFound, false);
});
