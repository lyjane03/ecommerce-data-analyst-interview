var PageWriting = (function () {
  var state = {
    phase: 'brief', day: null, response: '', showReference: false, rubricScores: {}, savedScore: null,
    scoreSource: '', aiEvaluation: null, aiAnswer: '', aiStatus: 'idle', aiError: null
  };

  function hydrate(currentDay) {
    var progress = AppStorage.getDayProgress(currentDay) || {};
    var saved = progress.writing || {};
    var self = saved.selfEvaluation || {};
    state.day = currentDay;
    state.phase = 'brief';
    state.response = saved.response || '';
    state.showReference = false;
    state.rubricScores = JSON.parse(JSON.stringify(self.rubricScores || saved.rubricScores || {}));
    state.savedScore = saved.score != null ? saved.score : null;
    state.scoreSource = saved.scoreSource || (saved.selfEvaluation ? 'self' : '');
    state.aiEvaluation = saved.aiEvaluation || null;
    state.aiAnswer = state.aiEvaluation && state.aiEvaluation.answer ? state.aiEvaluation.answer : '';
    state.aiStatus = state.aiEvaluation ? 'ready' : 'idle';
    state.aiError = null;
  }

  function render() {
    var currentDay = AppStorage.getCurrentDay(), dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    if (state.day !== currentDay) hydrate(currentDay);
    var W = dayContent.writing;
    return '<div class="page-writing"><h2 class="page-title">案例分析 — Day ' + currentDay + '</h2>' +
      '<div class="writing-topic-bar"><strong>' + escapeHtml(W.title) + '</strong><span class="day-theme-badge">' + escapeHtml(dayContent.themeZh) + '</span></div>' +
      '<div class="tab-bar">' + tabBtn('brief', '📌 案例简报', state.phase) + tabBtn('practice', '✍️ 英文作答', state.phase) + tabBtn('score', '✅ AI / 自评', state.phase) + '</div>' +
      '<div id="writing-phase-content">' + renderPhase(W) + '</div></div>';
  }

  function tabBtn(id, label, active) { return '<button class="tab-btn' + (active === id ? ' active' : '') + '" data-tab="' + id + '" onclick="PageWriting.switchPhase(\'' + id + '\')">' + label + '</button>'; }
  function renderPhase(W) { if (state.phase === 'practice') return renderPractice(W); if (state.phase === 'score') return renderScore(W); return renderBrief(W); }
  function panel(title, content) { return '<div class="writing-panel"><div class="writing-panel-title">' + title + '</div><div class="writing-panel-body">' + content + '</div></div>'; }
  function renderBrief(W) {
    return '<div class="writing-brief">' +
      panel('业务目标', '<p>' + escapeHtml(W.prompt) + '</p>') +
      panel('数据情境（synthetic / 模拟数据）', '<pre class="data-context">' + escapeHtml(W.dataContext) + '</pre>') +
      panel('交付要求', '<ul class="guide-list">' + W.deliverable.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>') +
      '<div class="source-strip"><strong>口径依据：</strong>' + sourceLinks(W.sourceIds) + '</div>' +
      '<button class="btn btn-primary" onclick="PageWriting.switchPhase(\'practice\')">开始英文作答 →</button>' +
    '</div>';
  }

  function renderPractice(W) {
    var status = AppAIScoring.getStatus();
    var disabled = state.aiStatus === 'loading' || (status.checked && !status.configured);
    return '<div class="practice-section">' +
      '<div class="instruction-box"><strong>作答提示：</strong>先写结论，再说明指标口径、分析方法、限制条件和建议。建议 150–250 词。</div>' +
      '<div class="practice-editor"><label class="input-label">用英文写出你的分析结论：</label><textarea id="caseResponseEditor" class="email-textarea" rows="16" placeholder="Start with your recommendation..." oninput="PageWriting.handleResponseInput(this.value)">' + escapeHtml(state.response) + '</textarea><div class="word-count" id="caseWordCount">0 词 · 0 字符</div></div>' +
      '<div class="ai-disclosure"><strong>AI 评分：</strong>点击后，本题答案会经本机服务发送给 DeepSeek；不点击不会自动发送。' +
        '<span id="writing-ai-status" class="ai-status ' + (status.configured ? 'configured' : 'unconfigured') + '">' + escapeHtml(AppAIScoring.statusText()) + '</span></div>' +
      (state.aiError ? '<div class="ai-error">' + escapeHtml(state.aiError.message) + (state.aiError.retryable ? ' 可重试。' : '') + '</div>' : '') +
      '<div class="action-row"><button class="btn btn-primary btn-large" onclick="PageWriting.requestAIScore()" ' + (disabled ? 'disabled' : '') + '>' + (state.aiStatus === 'loading' ? '⏳ AI 评分中…' : '🤖 AI 评分') + '</button><button class="btn btn-secondary" onclick="PageWriting.switchPhase(\'score\')">进入自评 →</button><button class="btn btn-secondary" onclick="PageWriting.toggleReference()">' + (state.showReference ? '隐藏参考答案' : '查看参考答案') + '</button><button class="btn btn-secondary" onclick="PageWriting.clearResponse()">清空</button></div>' +
      (state.showReference ? '<div class="reference-email"><div class="ref-title">📖 参考分析答案</div><pre class="ref-content">' + escapeHtml(W.referenceAnswer) + '</pre><div class="ref-content-zh"><span class="ref-zh-label">中文提示</span>' + escapeHtml(W.referenceAnswerZh) + '</div></div>' : '') +
    '</div>';
  }

  function renderScore(W) {
    var answered = W.rubric.filter(function (dim) { return state.rubricScores[dim.id]; }).length;
    return '<div class="score-section"><div class="instruction-box"><strong>评分选择：</strong>AI 评分会按你的原文给出证据和反馈；人工自评仍然保留。AI 结果先存为待复核结果，只有点击“采用 AI 评分并完成”才会计入模块完成状态。</div>' +
      (state.aiEvaluation ? renderAIEvaluation(state.aiEvaluation, W) : '<div class="ai-empty">还没有 AI 评分。你可以返回英文作答并主动发起，或直接完成人工自评。</div>') +
      '<div class="self-eval-heading"><strong>人工自评 rubric</strong><span>已完成 ' + answered + '/' + W.rubric.length + ' 项</span></div>' +
      '<div class="rubric-list">' + W.rubric.map(function (dim) { return renderRubric(dim); }).join('') + '</div>' +
      '<div class="rubric-total" id="rubricTotal">当前自评：' + (state.savedScore === null || state.scoreSource !== 'self' ? '尚未保存' : state.savedScore + ' 分（自评）') + '</div>' +
      '<div class="action-row">' +
        (state.aiEvaluation ? '<button class="btn btn-green btn-large" onclick="PageWriting.adoptAIScore()">✓ 采用 AI 评分并完成</button><button class="btn btn-secondary" onclick="PageWriting.continueSelfEval()">继续人工自评</button>' : '') +
        '<button class="btn btn-primary btn-large" onclick="PageWriting.saveWritingScore()">✓ 保存自评并完成</button><button class="btn btn-secondary" onclick="PageWriting.switchPhase(\'practice\')">返回修改</button>' +
      '</div></div>';
  }

  function renderAIEvaluation(result, W) {
    var labels = {};
    W.rubric.forEach(function (dim) { labels[dim.id] = dim.label; });
    return '<div class="ai-result-card"><div class="ai-result-head"><div><span class="ai-result-kicker">AI 辅助评分 · 待确认</span><h3>' + result.totalScore + ' / 100 分</h3></div><span class="score-source-badge ai">AI评分</span></div>' +
      '<p class="ai-summary">' + escapeHtml(result.summary) + '</p>' +
      '<div class="ai-dimensions">' + result.dimensions.map(function (dim) {
        return '<div class="ai-dimension"><div class="ai-dimension-head"><strong>' + escapeHtml(labels[dim.id] || dim.id) + '</strong><span>' + dim.score + '/5</span></div>' +
          '<div class="ai-evidence ' + (dim.evidenceFound ? '' : 'missing') + '">' + (dim.evidenceFound ? '原文证据：“' + escapeHtml(dim.evidence) + '”' : '未找到直接原文证据') + '</div>' +
          '<div class="ai-feedback">' + escapeHtml(dim.feedback) + '</div></div>';
      }).join('') + '</div>' +
      '<div class="ai-feedback-columns"><div><strong>做得好的地方</strong><ul>' + result.strengths.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div><div><strong>下一步改进</strong><ul>' + result.improvements.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div></div>' +
      '<details class="ai-model-answer"><summary>查看示范改写</summary><pre>' + escapeHtml(result.modelAnswer) + '</pre></details>' +
    '</div>';
  }

  function renderRubric(dim) {
    var current = state.rubricScores[dim.id] || 0;
    return '<div class="rubric-item"><div class="rubric-head"><strong>' + escapeHtml(dim.label) + '</strong><span>' + (current ? current + '/5' : '未评分') + '</span></div><div class="rubric-question">' + escapeHtml(dim.question) + '</div><div class="rubric-hint">检查点：' + escapeHtml(dim.checkpoint) + '</div><div class="rating-buttons">' + [1,2,3,4,5].map(function (n) { return '<button class="rating-btn' + (n === current ? ' active' : '') + '" onclick="PageWriting.setRubric(\'' + dim.id + '\',' + n + ')">' + n + '</button>'; }).join('') + '</div></div>';
  }
  function sourceLinks(ids) { return (ids || []).map(function (id) { var source = AppSources && AppSources.get(id); return source ? '<a href="' + source.url + '" target="_blank" rel="noopener">' + escapeHtml(source.publisher) + '</a>' : ''; }).filter(Boolean).join(' · '); }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function saveResponse() {
    var el = document.getElementById('caseResponseEditor');
    if (!el) return;
    if (state.aiEvaluation && state.aiAnswer && el.value !== state.aiAnswer) state.aiEvaluation = null;
    state.response = el.value;
  }
  function handleResponseInput(value) {
    if (state.aiEvaluation && state.aiAnswer && value !== state.aiAnswer) {
      state.aiEvaluation = null;
      state.aiAnswer = '';
    }
    state.response = value;
    updateWordCount();
  }
  function persist(patch) { AppStorage.saveDayProgress(AppStorage.getCurrentDay(), 'writing', Object.assign({ response: state.response }, patch || {})); }
  function refreshPhase() {
    var dayContent = AppContent.days[AppStorage.getCurrentDay() - 1], el = document.getElementById('writing-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.writing);
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) { btn.classList.toggle('active', btn.getAttribute('data-tab') === state.phase); });
    if (state.phase === 'practice') updateWordCount();
  }
  function switchPhase(phase) { saveResponse(); persist(); state.phase = phase; refreshPhase(); }
  function toggleReference() { saveResponse(); var el = document.getElementById('writing-phase-content'); state.showReference = !state.showReference; if (el) el.innerHTML = renderPractice(AppContent.days[AppStorage.getCurrentDay() - 1].writing); updateWordCount(); }
  function clearResponse() { state.response = ''; state.aiEvaluation = null; state.aiAnswer = ''; var el = document.getElementById('caseResponseEditor'); if (el) el.value = ''; persist({ aiEvaluation: null }); updateWordCount(); }
  function updateWordCount() {
    var el = document.getElementById('caseResponseEditor'), wc = document.getElementById('caseWordCount');
    if (!el || !wc) return;
    var text = el.value || '', trimmed = text.trim();
    var wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    wc.textContent = wordCount + ' 词 · ' + text.length + ' 字符';
  }
  function setRubric(id, score) { state.rubricScores[id] = score; var el = document.getElementById('writing-phase-content'); if (el) el.innerHTML = renderScore(AppContent.days[AppStorage.getCurrentDay() - 1].writing); }

  function requestAIScore() {
    saveResponse();
    if (state.response.trim().length < 50 || state.response.trim().length > 6000) { App.showToast('英文答案需要 50–6000 个字符', 'warning'); return; }
    state.aiStatus = 'loading'; state.aiError = null; refreshPhase();
    AppAIScoring.scoreWriting(AppStorage.getCurrentDay(), state.response).then(function (result) {
      state.aiEvaluation = Object.assign({}, result, { answer: state.response });
      state.aiAnswer = state.response;
      state.aiStatus = 'ready';
      persist({ aiEvaluation: state.aiEvaluation });
      state.phase = 'score'; refreshPhase();
      App.showToast('AI 评分完成，请核对证据后选择是否采用', 'success');
    }).catch(function (error) {
      state.aiStatus = 'error'; state.aiError = error; refreshPhase();
      App.showToast(error.message || 'AI 评分失败', 'error');
    });
  }

  function adoptAIScore() {
    if (!state.aiEvaluation) return;
    state.savedScore = state.aiEvaluation.totalScore; state.scoreSource = 'ai';
    persist({ score: state.savedScore, scoreSource: 'ai', completed: true, aiEvaluation: state.aiEvaluation });
    App.showToast('已采用 AI 评分并完成：' + state.savedScore + ' 分', 'success');
    refreshPhase();
  }
  function continueSelfEval() { App.showToast('可以继续完成五项人工自评，AI 结果仍会保留。', 'info'); }
  function saveWritingScore() {
    saveResponse(); var W = AppContent.days[AppStorage.getCurrentDay() - 1].writing;
    var missing = W.rubric.filter(function (dim) { return !state.rubricScores[dim.id]; });
    if (missing.length) { App.showToast('请完成全部 ' + W.rubric.length + ' 项自评', 'warning'); return; }
    var sum = W.rubric.reduce(function (total, dim) { return total + state.rubricScores[dim.id]; }, 0);
    var score = Math.round(sum / (W.rubric.length * 5) * 100); state.savedScore = score; state.scoreSource = 'self';
    persist({ score: score, scoreSource: 'self', completed: true, rubricScores: state.rubricScores, selfEvaluation: { score: score, rubricScores: JSON.parse(JSON.stringify(state.rubricScores)), savedAt: new Date().toISOString() } });
    App.showToast('案例自评已保存：' + score + ' 分', 'success');
    var total = document.getElementById('rubricTotal'); if (total) total.textContent = '当前自评：' + score + ' 分（已保存）';
  }
  function afterRender() {
    updateWordCount();
    AppAIScoring.health().then(function () {
      var el = document.getElementById('writing-ai-status');
      if (el) { var s = AppAIScoring.getStatus(); el.textContent = AppAIScoring.statusText(); el.className = 'ai-status ' + (s.configured ? 'configured' : 'unconfigured'); }
    });
  }
  function onLeave() { saveResponse(); persist(); }
  return { render: render, afterRender: afterRender, switchPhase: switchPhase, toggleReference: toggleReference, clearResponse: clearResponse, handleResponseInput: handleResponseInput, setRubric: setRubric, requestAIScore: requestAIScore, adoptAIScore: adoptAIScore, continueSelfEval: continueSelfEval, saveWritingScore: saveWritingScore, onLeave: onLeave };
})();
