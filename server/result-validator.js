const WRITING_IDS = ['problem', 'metrics', 'method', 'action', 'english'];
const SPEAKING_IDS = ['task', 'analysis', 'structure', 'vocabulary', 'clarity'];

class ResultValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ResultValidationError';
  }
}

function normalized(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function scoreFromDimensions(dimensions) {
  return Math.round(dimensions.reduce((sum, item) => sum + item.score, 0) / 25 * 100);
}

function validateEvaluation(raw, ids, sourceText) {
  if (!raw || typeof raw !== 'object') throw new ResultValidationError('模型没有返回对象');
  if (!Array.isArray(raw.dimensions) || raw.dimensions.length !== ids.length) {
    throw new ResultValidationError('模型返回的评分维度数量不正确');
  }
  const seen = new Set();
  const source = normalized(sourceText);
  const dimensions = raw.dimensions.map((item) => {
    if (!item || typeof item !== 'object') throw new ResultValidationError('评分维度格式不正确');
    if (!ids.includes(item.id) || seen.has(item.id)) throw new ResultValidationError('评分维度 ID 重复或不受支持');
    seen.add(item.id);
    if (!Number.isInteger(item.score) || item.score < 1 || item.score > 5) {
      throw new ResultValidationError('评分必须是 1–5 的整数');
    }
    if (typeof item.evidence !== 'string' || typeof item.feedback !== 'string' ||
        typeof item.evidenceFound !== 'boolean') {
      throw new ResultValidationError('证据或反馈字段格式不正确');
    }
    const evidence = item.evidence.trim();
    if (item.evidenceFound && (!evidence || !source.includes(normalized(evidence)))) {
      throw new ResultValidationError(`维度 ${item.id} 的 evidence 不在原回答中`);
    }
    return {
      id: item.id,
      score: item.score,
      evidence: evidence,
      evidenceFound: item.evidenceFound,
      feedback: item.feedback.trim()
    };
  });
  if (seen.size !== ids.length || ids.some((id) => !seen.has(id))) {
    throw new ResultValidationError('模型没有覆盖全部评分维度');
  }
  if (!Array.isArray(raw.strengths) || !Array.isArray(raw.improvements) ||
      typeof raw.modelAnswer !== 'string' || typeof raw.summary !== 'string') {
    throw new ResultValidationError('模型返回缺少反馈字段');
  }
  const strings = (items, label, max) => {
    if (items.length > max || items.some((item) => typeof item !== 'string' || !item.trim())) {
      throw new ResultValidationError(`${label} 格式不正确`);
    }
    return items.map((item) => item.trim());
  };
  return {
    totalScore: scoreFromDimensions(dimensions),
    dimensions,
    strengths: strings(raw.strengths, '优点', 3),
    improvements: strings(raw.improvements, '改进项', 3),
    modelAnswer: raw.modelAnswer.trim(),
    summary: raw.summary.trim()
  };
}

const EVALUATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    dimensions: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          score: { type: 'integer', minimum: 1, maximum: 5 },
          evidence: { type: 'string' },
          evidenceFound: { type: 'boolean' },
          feedback: { type: 'string' }
        },
        required: ['id', 'score', 'evidence', 'evidenceFound', 'feedback']
      }
    },
    strengths: { type: 'array', maxItems: 3, items: { type: 'string' } },
    improvements: { type: 'array', maxItems: 3, items: { type: 'string' } },
    modelAnswer: { type: 'string' },
    summary: { type: 'string' }
  },
  required: ['dimensions', 'strengths', 'improvements', 'modelAnswer', 'summary']
};

module.exports = {
  WRITING_IDS,
  SPEAKING_IDS,
  EVALUATION_SCHEMA,
  ResultValidationError,
  scoreFromDimensions,
  validateEvaluation
};
