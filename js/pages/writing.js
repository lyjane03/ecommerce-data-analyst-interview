var PageWriting = (function () {
  var state = { phase: 'brief', day: null, response: '', showReference: false, rubricScores: {}, savedScore: null };

  function render() {
    var currentDay = AppStorage.getCurrentDay(), dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    if (state.day !== currentDay) { state.day = currentDay; state.phase = 'brief'; state.response = ''; state.showReference = false; state.rubricScores = {}; state.savedScore = null; }
    var W = dayContent.writing;
    return '<div class="page-writing"><h2 class="page-title">案例分析 — Day ' + currentDay + '</h2>' +
      '<div class="writing-topic-bar"><strong>' + W.title + '</strong><span class="day-theme-badge">' + dayContent.themeZh + '</span></div>' +
      '<div class="tab-bar">' + tabBtn('brief', '📌 案例简报', state.phase) + tabBtn('practice', '✍️ 英文作答', state.phase) + tabBtn('score', '✅ 自评 rubric', state.phase) + '</div>' +
      '<div id="writing-phase-content">' + renderPhase(W) + '</div></div>';
  }

  function tabBtn(id, label, active) { return '<button class="tab-btn' + (active === id ? ' active' : '') + '" data-tab="' + id + '" onclick="PageWriting.switchPhase(\'' + id + '\')">' + label + '</button>'; }
  function renderPhase(W) { if (state.phase === 'practice') return renderPractice(W); if (state.phase === 'score') return renderScore(W); return renderBrief(W); }
  function panel(title, content) { return '<div class="writing-panel"><div class="writing-panel-title">' + title + '</div><div class="writing-panel-body">' + content + '</div></div>'; }
  function renderBrief(W) {
    return '<div class="writing-brief">' +
      panel('业务目标', '<p>' + W.prompt + '</p>') +
      panel('数据情境（synthetic / 模拟数据）', '<pre class="data-context">' + escapeHtml(W.dataContext) + '</pre>') +
      panel('交付要求', '<ul class="guide-list">' + W.deliverable.map(function (item) { return '<li>' + item + '</li>'; }).join('') + '</ul>') +
      '<div class="source-strip"><strong>口径依据：</strong>' + sourceLinks(W.sourceIds) + '</div>' +
      '<button class="btn btn-primary" onclick="PageWriting.switchPhase(\'practice\')">开始英文作答 →</button>' +
    '</div>';
  }
  function renderPractice(W) {
    return '<div class="practice-section">' +
      '<div class="instruction-box"><strong>作答提示：</strong>先写结论，再说明指标口径、分析方法、限制条件和建议。建议 150–250 词。</div>' +
      '<div class="practice-editor"><label class="input-label">用英文写出你的分析结论：</label><textarea id="caseResponseEditor" class="email-textarea" rows="16" placeholder="Start with your recommendation...">' + escapeHtml(state.response) + '</textarea><div class="word-count" id="caseWordCount">0 词</div></div>' +
      '<div class="action-row"><button class="btn btn-primary btn-large" onclick="PageWriting.switchPhase(\'score\')">进入五维自评 →</button><button class="btn btn-secondary" onclick="PageWriting.toggleReference()">' + (state.showReference ? '隐藏参考答案' : '查看参考答案') + '</button><button class="btn btn-secondary" onclick="PageWriting.clearResponse()">清空</button></div>' +
      (state.showReference ? '<div class="reference-email"><div class="ref-title">📖 参考分析答案</div><pre class="ref-content">' + escapeHtml(W.referenceAnswer) + '</pre><div class="ref-content-zh"><span class="ref-zh-label">中文提示</span>' + W.referenceAnswerZh + '</div></div>' : '') +
    '</div>';
  }
  function renderScore(W) {
    var answered = W.rubric.filter(function (dim) { return state.rubricScores[dim.id]; }).length;
    return '<div class="score-section"><div class="instruction-box"><strong>逐项自评：</strong>按 1–5 分给自己打分（当前已完成 ' + answered + '/' + W.rubric.length + ' 项）。参考答案只用于复盘，不会自动替你评分。</div>' +
      '<div class="rubric-list">' + W.rubric.map(function (dim) { return renderRubric(dim); }).join('') + '</div>' +
      '<div class="rubric-total" id="rubricTotal">当前自评：' + (state.savedScore === null ? '尚未保存' : state.savedScore + ' 分') + '</div>' +
      '<div class="action-row"><button class="btn btn-primary btn-large" onclick="PageWriting.saveWritingScore()">✓ 保存自评并完成</button><button class="btn btn-secondary" onclick="PageWriting.switchPhase(\'practice\')">返回修改</button></div></div>';
  }
  function renderRubric(dim) {
    var current = state.rubricScores[dim.id] || 0;
    return '<div class="rubric-item"><div class="rubric-head"><strong>' + dim.label + '</strong><span>' + (current ? current + '/5' : '未评分') + '</span></div><div class="rubric-question">' + dim.question + '</div><div class="rubric-hint">检查点：' + dim.checkpoint + '</div><div class="rating-buttons">' + [1,2,3,4,5].map(function (n) { return '<button class="rating-btn' + (n === current ? ' active' : '') + '" onclick="PageWriting.setRubric(\'' + dim.id + '\',' + n + ')">' + n + '</button>'; }).join('') + '</div></div>';
  }
  function sourceLinks(ids) { return (ids || []).map(function (id) { var source = AppSources && AppSources.get(id); return source ? '<a href="' + source.url + '" target="_blank" rel="noopener">' + source.publisher + '</a>' : ''; }).filter(Boolean).join(' · '); }
  function escapeHtml(value) { return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function saveResponse() { var el = document.getElementById('caseResponseEditor'); if (el) state.response = el.value; }
  function switchPhase(phase) {
    saveResponse(); state.phase = phase;
    var dayContent = AppContent.days[AppStorage.getCurrentDay() - 1], el = document.getElementById('writing-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.writing);
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) { btn.classList.toggle('active', btn.getAttribute('data-tab') === phase); });
    if (phase === 'practice') updateWordCount();
  }
  function toggleReference() { saveResponse(); state.showReference = !state.showReference; var el = document.getElementById('writing-phase-content'); if (el) el.innerHTML = renderPractice(AppContent.days[AppStorage.getCurrentDay() - 1].writing); updateWordCount(); }
  function clearResponse() { state.response = ''; var el = document.getElementById('caseResponseEditor'); if (el) el.value = ''; updateWordCount(); }
  function updateWordCount() { var el = document.getElementById('caseResponseEditor'), wc = document.getElementById('caseWordCount'); if (el && wc) wc.textContent = (el.value.trim() ? el.value.trim().split(/\s+/).length : 0) + ' 词'; }
  function setRubric(id, score) { state.rubricScores[id] = score; var el = document.getElementById('writing-phase-content'); if (el) el.innerHTML = renderScore(AppContent.days[AppStorage.getCurrentDay() - 1].writing); }
  function saveWritingScore() {
    saveResponse(); var W = AppContent.days[AppStorage.getCurrentDay() - 1].writing;
    var missing = W.rubric.filter(function (dim) { return !state.rubricScores[dim.id]; });
    if (missing.length) { App.showToast('请完成全部 ' + W.rubric.length + ' 项自评', 'warning'); return; }
    var sum = W.rubric.reduce(function (total, dim) { return total + state.rubricScores[dim.id]; }, 0);
    var score = Math.round(sum / (W.rubric.length * 5) * 100); state.savedScore = score;
    AppStorage.saveDayProgress(AppStorage.getCurrentDay(), 'writing', { score: score, completed: true, timeSpent: 0, rubricScores: state.rubricScores, response: state.response });
    App.showToast('案例自评已保存：' + score + ' 分', 'success');
    var total = document.getElementById('rubricTotal'); if (total) total.textContent = '当前自评：' + score + ' 分（已保存）';
  }
  function afterRender() { updateWordCount(); }
  function onLeave() { saveResponse(); }
  return { render: render, afterRender: afterRender, switchPhase: switchPhase, toggleReference: toggleReference, clearResponse: clearResponse, setRubric: setRubric, saveWritingScore: saveWritingScore, onLeave: onLeave };
})();
