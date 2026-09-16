const OpenAI = require('openai');

function createDeepSeekAdapter(config, clientOverride) {
  const apiKey = config.aiApiKey || config.deepseekApiKey || '';
  const client = clientOverride || (apiKey
    ? new OpenAI({
        apiKey,
        baseURL: config.aiBaseUrl || config.deepseekBaseUrl || 'https://api.deepseek.com',
        timeout: config.upstreamTimeoutMs,
        maxRetries: 0
      })
    : null);
  if (!client) return null;

  async function score(prompt) {
    const text = normalizeTextFormat(prompt.text);
    const response = await client.responses.create({
      model: config.scoringModel,
      instructions: prompt.instructions,
      input: prompt.input,
      text,
      // Disable reasoning for this short structured response so the token budget
      // is spent on the JSON evaluation itself.
      reasoning: { effort: 'none' },
      max_output_tokens: 2400
    });
    const outputText = response && typeof response.output_text === 'string'
      ? response.output_text
      : extractOutputText(response);
    if (!outputText.trim()) throw new Error('DeepSeek 返回为空');
    return JSON.parse(outputText);
  }

  return {
    score,
    model: config.scoringModel,
    provider: 'deepseek'
  };
}

function normalizeTextFormat(text) {
  if (!text || !text.format) return text;
  const format = { ...text.format };
  // DeepSeek's Responses API supports JSON Schema output but does not document
  // OpenAI's additional `strict` switch.
  delete format.strict;
  return { ...text, format };
}

function extractOutputText(response) {
  const output = response && Array.isArray(response.output) ? response.output : [];
  return output.flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .filter((item) => item && item.type === 'output_text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join('');
}

module.exports = { createDeepSeekAdapter, extractOutputText, normalizeTextFormat };
