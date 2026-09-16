var AppAIScoring = (function () {
  var status = { reachable: null, configured: null, scoringConfigured: null, transcriptionConfigured: null, speakingConfigured: null, scoringModel: '', transcribeModel: '', checked: false, errorCode: '', errorMessage: '' };
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
          var error = new Error(info.message || (response.status === 404 ? 'AI 服务接口不存在，请检查后端服务地址。' : 'AI 请求失败，请稍后重试。'));
          error.code = info.code || (response.status === 404 ? 'AI_BACKEND_ENDPOINT_NOT_FOUND' : 'AI_REQUEST_FAILED');
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
      if (error && error.name === 'TypeError') {
        var connection = new Error('无法连接 AI 服务，请检查网络或联系管理员。');
        connection.code = 'AI_BACKEND_UNREACHABLE'; connection.retryable = true; throw connection;
      }
      throw error;
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function health() {
    return apiFetch('/api/health').then(function (data) {
      var scoringConfigured = data.scoringConfigured == null ? !!data.aiConfigured : !!data.scoringConfigured;
      var transcriptionConfigured = !!data.transcriptionConfigured;
      status = {
        reachable: true,
        configured: scoringConfigured,
        scoringConfigured: scoringConfigured,
        transcriptionConfigured: transcriptionConfigured,
        speakingConfigured: data.speakingAIConfigured == null ? scoringConfigured && transcriptionConfigured : !!data.speakingAIConfigured,
        scoringModel: data.scoringModel || '',
        transcribeModel: data.transcribeModel || '',
        aiProvider: data.aiProvider || '',
        transcribeProvider: data.transcribeProvider || '',
        checked: true,
        errorCode: '',
        errorMessage: ''
      };
      return status;
    }).catch(function (error) {
      status = { reachable: false, configured: false, scoringConfigured: false, transcriptionConfigured: false, speakingConfigured: false, scoringModel: '', transcribeModel: '', checked: true, errorCode: error.code || 'AI_BACKEND_UNREACHABLE', errorMessage: error.message || '无法连接 AI 服务。', error: error };
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
    if (!status.reachable) {
      if (status.errorCode === 'AI_UNAVAILABLE') return '当前打开方式不支持 AI · 可继续人工自评';
      if (status.errorCode === 'AI_BACKEND_ENDPOINT_NOT_FOUND') return 'AI 服务地址错误 · 可继续人工自评';
      return 'AI 服务未连接 · 可继续人工自评';
    }
    if (mode === 'speaking') {
      if (status.speakingConfigured) return 'GLM 转写 + DeepSeek 评分已就绪';
      if (!status.scoringConfigured && !status.transcriptionConfigured) return 'AI 服务已连接，但 DeepSeek 与 GLM 尚未配置 · 可继续人工自评';
      if (!status.scoringConfigured) return 'AI 服务已连接，但 DeepSeek 尚未配置 · 可继续人工自评';
      return 'AI 服务已连接，但 GLM 转写尚未配置 · 可继续人工自评';
    }
    return status.scoringConfigured ? 'DeepSeek 评分已就绪 · 点击后才会发送作答内容' : 'AI 服务已连接，但 DeepSeek 尚未配置 · 可继续人工自评';
  }

  return { health: health, scoreWriting: scoreWriting, scoreSpeaking: scoreSpeaking, getStatus: getStatus, statusText: statusText };
})();
