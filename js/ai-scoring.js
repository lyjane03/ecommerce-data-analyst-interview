var AppAIScoring = (function () {
  var status = { configured: null, scoringConfigured: null, transcriptionConfigured: null, speakingConfigured: null, scoringModel: '', transcribeModel: '', checked: false };
  var REQUEST_TIMEOUT_MS = 160000;

  function unavailable(message) {
    var error = new Error(message || 'AI 服务不可用。');
    error.code = 'AI_UNAVAILABLE';
    error.retryable = false;
    return Promise.reject(error);
  }

  function apiFetch(path, options) {
    if (window.location.protocol === 'file:') return unavailable('直接打开 HTML 时 AI 服务不可用，请用 npm start 启动。');
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
    var request = Object.assign({}, options || {});
    if (controller) request.signal = controller.signal;
    return fetch(path, request).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok) {
          var info = body.error || {};
          var error = new Error(info.message || 'AI 请求失败，请稍后重试。');
          error.code = info.code || 'AI_REQUEST_FAILED';
          error.retryable = !!info.retryable;
          throw error;
        }
        return body;
      });
    }).catch(function (error) {
      if (error.name === 'AbortError') {
        var timeout = new Error('AI 请求超时，请稍后重试。');
        timeout.code = 'AI_TIMEOUT'; timeout.retryable = true; throw timeout;
      }
      throw error;
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function health() {
    return apiFetch('/api/health').then(function (data) {
      var scoringConfigured = data.scoringConfigured == null ? !!data.aiConfigured : !!data.scoringConfigured;
      var transcriptionConfigured = !!data.transcriptionConfigured;
      status = {
        configured: scoringConfigured,
        scoringConfigured: scoringConfigured,
        transcriptionConfigured: transcriptionConfigured,
        speakingConfigured: data.speakingAIConfigured == null ? scoringConfigured && transcriptionConfigured : !!data.speakingAIConfigured,
        scoringModel: data.scoringModel || '',
        transcribeModel: data.transcribeModel || '',
        aiProvider: data.aiProvider || '',
        transcribeProvider: data.transcribeProvider || '',
        checked: true
      };
      return status;
    }).catch(function (error) {
      status = { configured: false, scoringConfigured: false, transcriptionConfigured: false, speakingConfigured: false, scoringModel: '', transcribeModel: '', checked: true, error: error };
      return status;
    });
  }

  function scoreWriting(day, answer) {
    return apiFetch('/api/score/writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: day, answer: answer })
    });
  }

  function scoreSpeaking(day, blob, durationSeconds) {
    if (!blob) return unavailable('请先完成一段录音。');
    var form = new FormData();
    form.append('day', String(day));
    form.append('durationSeconds', String(durationSeconds || 0));
    form.append('audio', blob, 'speaking.webm');
    return apiFetch('/api/score/speaking', { method: 'POST', body: form });
  }

  function getStatus() { return status; }
  function statusText(mode) {
    if (!status.checked) return '正在检查 AI 服务…';
    if (mode === 'speaking') {
      if (status.speakingConfigured) return 'GLM 转写 + DeepSeek 评分已配置';
      if (!status.scoringConfigured && !status.transcriptionConfigured) return 'DeepSeek 与 GLM 均未配置 · 可继续人工自评';
      if (!status.scoringConfigured) return 'DeepSeek 评分未配置 · 可继续人工自评';
      return 'GLM 转写未配置 · 可继续人工自评';
    }
    return status.scoringConfigured ? 'DeepSeek 已配置 · 点击后才会发送作答内容' : 'DeepSeek 未配置 · 可继续使用人工自评';
  }

  return { health: health, scoreWriting: scoreWriting, scoreSpeaking: scoreSpeaking, getStatus: getStatus, statusText: statusText };
})();
