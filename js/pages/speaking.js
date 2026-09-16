var PageSpeaking = (function () {
  var state = {
    day: null, phase: 'outline', isRecording: false, audioUrl: null, audioBlob: null, durationSeconds: 0,
    selfEvalScores: {}, submitted: false, transcript: '', aiEvaluation: null, aiStatus: 'idle', aiError: null
  };

  var evalDimensions = [
    { id: 'fluency', label: '流利度 Fluency', hint: '语言是否流畅，停顿是否自然' },
    { id: 'vocabulary', label: '词汇丰富度 Vocabulary', hint: '是否使用了专业词汇和多样表达' },
    { id: 'structure', label: '结构清晰度 Structure', hint: '逻辑是否清晰，是否按提纲组织' },
    { id: 'pronunciation', label: '发音准确度 Pronunciation', hint: '关键词发音是否清晰准确' },
    { id: 'confidence', label: '自信度 Confidence', hint: '是否表现出自信和对内容的掌握' }
  ];
  var aiLabels = { task: '任务完成度', analysis: '分析内容', structure: '结构清晰度', vocabulary: '专业词汇', clarity: '英文清晰度' };

  function hydrate(currentDay) {
    var progress = AppStorage.getDayProgress(currentDay) || {};
    var saved = progress.speaking || {};
    var self = saved.selfEvaluation || {};
    state.day = currentDay;
    state.phase = 'outline'; state.isRecording = false; state.audioUrl = null; state.audioBlob = null; state.durationSeconds = 0;
    state.selfEvalScores = JSON.parse(JSON.stringify(self.scores || saved.selfEval || {}));
    state.submitted = !!(saved.completed && (saved.scoreSource || 'self') === 'self');
    state.transcript = saved.transcript || '';
    state.aiEvaluation = saved.aiEvaluation || null;
    state.aiStatus = state.aiEvaluation ? 'ready' : 'idle'; state.aiError = null;
  }

  function render() {
    var currentDay = AppStorage.getCurrentDay(), dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    if (state.day !== currentDay) hydrate(currentDay);
    var S = dayContent.speaking;
    return '<div class="page-speaking"><h2 class="page-title">口语训练 — Day ' + currentDay + '</h2>' +
      '<div class="speaking-topic-bar"><strong>' + escapeHtml(S.title) + '</strong><span class="day-theme-badge">' + escapeHtml(dayContent.themeZh) + '</span></div>' +
      '<div class="tab-bar">' + tabBtn('outline', '📋 汇报提纲', state.phase) + tabBtn('record', '🎙️ 录音练习', state.phase) + tabBtn('eval', '📊 AI / 自评', state.phase) + '</div>' +
      '<div id="speaking-phase-content">' + renderPhase(S) + '</div></div>';
  }
  function tabBtn(id, label, active) { return '<button class="tab-btn' + (active === id ? ' active' : '') + '" data-tab="' + id + '" onclick="PageSpeaking.switchPhase(\'' + id + '\')">' + label + '</button>'; }
  function renderPhase(S) { if (state.phase === 'record') return renderRecord(S); if (state.phase === 'eval') return renderEval(S); return renderOutline(S); }
  function renderOutline(S) {
    return '<div class="outline-section"><div class="instruction-box"><strong>任务：</strong>' + escapeHtml(S.title) + '<br>建议用时：2–3分钟（约 200–350 词），录音前熟悉以下提纲和关键句型。</div>' +
      '<div class="outline-card"><div class="outline-title">📋 汇报提纲</div>' + S.outline.map(function (item) { return '<div class="outline-item"><div class="outline-point">' + escapeHtml(item.point) + '</div><div class="outline-note">' + escapeHtml(item.note) + '</div>' + (item.noteZh ? '<div class="zh-translation">' + escapeHtml(item.noteZh) + '</div>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="key-sentences-card"><div class="ks-title">💬 关键句型参考</div><ul class="ks-list">' + S.keySentences.map(function (text, i) { return '<li class="ks-item"><div class="ks-en-row"><span class="ks-text">' + escapeHtml(text) + '</span><button class="btn-play-ks" onclick="PageSpeaking.playKeySentence(\'' + text.replace(/'/g, "\\'") + '\')" title="试听">▶</button></div>' + (S.keySentencesZh && S.keySentencesZh[i] ? '<div class="zh-translation">' + escapeHtml(S.keySentencesZh[i]) + '</div>' : '') + '</li>'; }).join('') + '</ul></div>' +
      '<div class="vocab-reminder"><div class="vr-title">🔑 当日重点词汇提醒</div><div class="vr-tags">' + getCurrentDayKeywords().map(function (kw) { return '<span class="vr-tag">' + escapeHtml(kw) + '</span>'; }).join('') + '</div></div>' +
      '<button class="btn btn-primary" onclick="PageSpeaking.switchPhase(\'record\')" style="margin-top:1.5rem">开始录音 🎙️</button></div>';
  }
  function renderRecord(S) {
    var status = AppAIScoring.getStatus();
    var canScore = !!state.audioBlob && state.aiStatus !== 'loading' && !(status.checked && !status.speakingConfigured);
    return '<div class="record-section"><div class="instruction-box"><strong>录音说明：</strong>点击“开始录音”，按提纲完整汇报一遍。录完后可回听；只有点击 AI 按钮时才会上传本次录音。</div>' +
      '<div class="record-center"><div class="record-btn-wrap"><button class="btn-record ' + (state.isRecording ? 'recording' : '') + '" id="recordBtn" onclick="PageSpeaking.toggleRecord()">' + (state.isRecording ? '■ 停止录音' : '● 开始录音') + '</button>' + (state.isRecording ? '<div class="recording-indicator"><span class="rec-dot"></span> 录制中...</div>' : '') + '</div>' + (state.audioUrl ? '<div class="playback-area"><div class="playback-title">录音回放：</div><audio controls src="' + state.audioUrl + '" class="audio-player"></audio><div class="playback-tips">回听时注意：发音是否清晰？逻辑是否流畅？关键词是否都用到了？</div></div>' : '') + '</div>' +
      '<div class="record-outline-mini"><div class="mini-title">提纲速览：</div>' + S.outline.map(function (item) { return '<div class="mini-point">• ' + escapeHtml(item.point) + '</div>'; }).join('') + '</div>' +
      (!AppRecorder.isSupported() ? '<div class="warn-box">⚠️ 浏览器不支持录音功能。请使用 Chrome 或 Edge 浏览器。</div>' : '') +
      (state.transcript ? renderTranscript() : '') +
      (state.aiError ? '<div class="ai-error">' + escapeHtml(state.aiError.message) + (state.aiError.retryable ? ' 可重试。' : '') + '</div>' : '') +
      '<div class="ai-disclosure"><strong>AI 内容评分：</strong>点击后，录音会由本机转换格式并发送给 GLM 转写，所得文字再发送给 DeepSeek 评分；不评发音、口音、语调或自信度。<span id="speaking-ai-status" class="ai-status ' + (status.speakingConfigured ? 'configured' : 'unconfigured') + '">' + escapeHtml(AppAIScoring.statusText('speaking')) + '</span></div>' +
      '<div class="action-row">' + (state.audioBlob ? '<button class="btn btn-primary btn-large" onclick="PageSpeaking.requestAIScore()" ' + (canScore ? '' : 'disabled') + '>' + (state.aiStatus === 'loading' ? '⏳ 转写和评分中…' : '🤖 转写并由 AI 评分') + '</button>' : '') + (state.audioUrl || state.transcript ? '<button class="btn btn-secondary" onclick="PageSpeaking.switchPhase(\'eval\')">进入自评 →</button>' : '') + '</div></div>';
  }
  function renderTranscript() {
    return '<div class="transcript-card"><div class="transcript-title">英文 transcript（可核对）</div><textarea id="speakingTranscript" class="transcript-textarea" rows="6">' + escapeHtml(state.transcript) + '</textarea><div class="transcript-note">内容型 AI 评分只依据文字；发音、口音、语调和自信度请使用下方人工自评。</div></div>';
  }
  function renderEval(S) {
    var totalScore = calcTotalScore();
    return '<div class="eval-section"><div class="instruction-box"><strong>评分说明：</strong>AI 评分只评估 transcript 的任务完成度、分析内容、结构、专业词汇和英文清晰度，不等于声学级发音测评。发音与自信度仍由你人工自评。</div>' +
      (state.aiEvaluation ? renderAIEvaluation(state.aiEvaluation) : '<div class="ai-empty">还没有 AI 内容评分。完成录音后可主动上传；也可以直接完成人工自评。</div>') +
      '<div class="eval-form">' + evalDimensions.map(function (dim) { var current = state.selfEvalScores[dim.id] || 0; return '<div class="eval-row"><div class="eval-dim-label"><span>' + escapeHtml(dim.label) + '</span><span class="eval-hint">' + escapeHtml(dim.hint) + '</span></div><div class="star-rating" id="stars-' + dim.id + '">' + [1,2,3,4,5].map(function (n) { return '<span class="star' + (n <= current ? ' active' : '') + '" onclick="PageSpeaking.setStar(\'' + dim.id + '\',' + n + ')">' + (n <= current ? '★' : '☆') + '</span>'; }).join('') + '</div><div class="eval-score-display">' + (current > 0 ? current + '/5' : '未评') + '</div></div>'; }).join('') + '</div>' +
      (Object.keys(state.selfEvalScores).length > 0 ? '<div class="eval-radar-wrap"><canvas id="speakingRadarChart" style="width:260px;height:260px;"></canvas></div>' : '') +
      '<div class="eval-total">综合自评得分：<strong>' + (totalScore > 0 ? Math.round(totalScore) + '/100 分' : '请先完成所有维度评分') + '</strong></div>' +
      '<div class="action-row">' + (state.aiEvaluation ? '<button class="btn btn-green btn-large" onclick="PageSpeaking.adoptAIScore()">✓ 采用 AI 评分并完成</button>' : '') + '<button class="btn btn-primary btn-large" onclick="PageSpeaking.submitEval()" ' + (totalScore === 0 ? 'disabled' : '') + '>✓ 提交自评并保存</button>' + (state.audioUrl || state.transcript ? '<button class="btn btn-secondary" onclick="PageSpeaking.switchPhase(\'record\')">返回录音</button>' : '') + '</div>' + (state.submitted ? '<div class="success-banner">✅ 今日口语训练已完成！</div>' : '') + '</div>';
  }
  function renderAIEvaluation(result) {
    return '<div class="ai-result-card"><div class="ai-result-head"><div><span class="ai-result-kicker">AI 内容评分 · 待确认</span><h3>' + result.totalScore + ' / 100 分</h3></div><span class="score-source-badge ai">AI评分</span></div><p class="ai-summary">' + escapeHtml(result.summary) + '</p><div class="ai-dimensions">' + result.dimensions.map(function (dim) { return '<div class="ai-dimension"><div class="ai-dimension-head"><strong>' + escapeHtml(aiLabels[dim.id] || dim.id) + '</strong><span>' + dim.score + '/5</span></div><div class="ai-evidence ' + (dim.evidenceFound ? '' : 'missing') + '">' + (dim.evidenceFound ? '原文证据：“' + escapeHtml(dim.evidence) + '”' : '未找到直接原文证据') + '</div><div class="ai-feedback">' + escapeHtml(dim.feedback) + '</div></div>'; }).join('') + '</div><div class="ai-feedback-columns"><div><strong>做得好的地方</strong><ul>' + result.strengths.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div><div><strong>下一步改进</strong><ul>' + result.improvements.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul></div></div><details class="ai-model-answer"><summary>查看示范改写</summary><pre>' + escapeHtml(result.modelAnswer) + '</pre></details></div>';
  }

  function switchPhase(phase) {
    saveTranscript(); state.phase = phase; refreshPhase();
  }
  function toggleRecord() {
    if (state.isRecording) {
      AppRecorder.stop().then(function (result) { state.isRecording = false; if (result) { state.audioBlob = result.blob; state.audioUrl = result.url; state.durationSeconds = result.durationSeconds; } refreshPhase(); });
    } else {
      AppRecorder.cleanup(); state.audioUrl = null; state.audioBlob = null; state.durationSeconds = 0; state.transcript = ''; state.aiEvaluation = null; state.aiError = null;
      AppRecorder.start().then(function () { state.isRecording = true; refreshPhase(); }).catch(function (err) { App.showToast('录音失败：' + err.message, 'error'); });
    }
  }
  function requestAIScore() {
    if (!state.audioBlob) { App.showToast('请先完成一段录音', 'warning'); return; }
    saveTranscript(); state.aiStatus = 'loading'; state.aiError = null; refreshPhase();
    AppAIScoring.scoreSpeaking(AppStorage.getCurrentDay(), state.audioBlob, state.durationSeconds).then(function (result) {
      state.transcript = result.transcript; state.aiEvaluation = result; state.aiStatus = 'ready';
      persist({ transcript: state.transcript, aiEvaluation: state.aiEvaluation });
      state.phase = 'eval'; refreshPhase(); App.showToast('转写和 AI 内容评分完成，请核对后选择是否采用', 'success');
    }).catch(function (error) { state.aiStatus = 'error'; state.aiError = error; refreshPhase(); App.showToast(error.message || 'AI 评分失败', 'error'); });
  }
  function saveTranscript() { var el = document.getElementById('speakingTranscript'); if (el) state.transcript = el.value; }
  function persist(patch) { AppStorage.saveDayProgress(AppStorage.getCurrentDay(), 'speaking', Object.assign({ transcript: state.transcript }, patch || {})); }
  function setStar(dimId, score) {
    state.selfEvalScores[dimId] = score; var container = document.getElementById('stars-' + dimId);
    if (container) { container.querySelectorAll('.star').forEach(function (star, i) { star.textContent = i < score ? '★' : '☆'; star.classList.toggle('active', i < score); }); var display = container.parentElement.querySelector('.eval-score-display'); if (display) display.textContent = score + '/5'; }
    var totalEl = document.querySelector('.eval-total strong'); if (totalEl) { var total = calcTotalScore(); totalEl.textContent = total > 0 ? Math.round(total) + '/100 分' : '请先完成所有维度评分'; }
    var submitBtn = document.querySelector('.eval-section .btn-primary'); if (submitBtn) submitBtn.disabled = calcTotalScore() === 0; drawSpeakingRadar();
  }
  function calcTotalScore() {
    var keys = evalDimensions.map(function (dim) { return dim.id; });
    if (keys.some(function (key) { return !(state.selfEvalScores[key] > 0); })) return 0;
    var sum = keys.reduce(function (acc, key) { return acc + state.selfEvalScores[key]; }, 0);
    return (sum / (keys.length * 5)) * 100;
  }
  function adoptAIScore() { if (!state.aiEvaluation) return; persist({ score: state.aiEvaluation.totalScore, scoreSource: 'ai', completed: true, aiEvaluation: state.aiEvaluation, transcript: state.transcript }); App.showToast('已采用 AI 评分并完成：' + state.aiEvaluation.totalScore + ' 分', 'success'); refreshPhase(); }
  function submitEval() {
    saveTranscript(); var score = calcTotalScore(); if (score === 0) { App.showToast('请完成全部 5 项人工自评', 'warning'); return; }
    var scores = JSON.parse(JSON.stringify(state.selfEvalScores)); state.submitted = true;
    persist({ score: Math.round(score), scoreSource: 'self', completed: true, selfEval: scores, selfEvaluation: { score: Math.round(score), scores: scores, savedAt: new Date().toISOString() } });
    App.showToast('口语自评已保存：' + Math.round(score) + ' 分', 'success'); refreshPhase();
  }
  function drawSpeakingRadar() { var canvas = document.getElementById('speakingRadarChart'); if (!canvas) return; AppCharts.radarChart(canvas, evalDimensions.map(function (dim) { return dim.label.split(' ')[0]; }), evalDimensions.map(function (dim) { return state.selfEvalScores[dim.id] || 0; }), { maxVal: 5, color: AppCharts.colors.speaking }); }
  function playKeySentence(text) { AppTTS.speak(text, { rate: 0.9 }); }
  function refreshPhase() { var dayContent = AppContent.days[AppStorage.getCurrentDay() - 1], el = document.getElementById('speaking-phase-content'); if (el) el.innerHTML = renderPhase(dayContent.speaking); document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) { btn.classList.toggle('active', btn.getAttribute('data-tab') === state.phase); }); if (state.phase === 'eval') setTimeout(drawSpeakingRadar, 50); }
  function getCurrentDayKeywords() { var dayContent = AppContent.days[AppStorage.getCurrentDay() - 1]; return dayContent ? dayContent.listening.keywords.slice(0, 6) : []; }
  function afterRender() { if (state.phase === 'eval') setTimeout(drawSpeakingRadar, 50); AppAIScoring.health().then(function () { var el = document.getElementById('speaking-ai-status'); if (el) { var s = AppAIScoring.getStatus(); el.textContent = AppAIScoring.statusText('speaking'); el.className = 'ai-status ' + (s.speakingConfigured ? 'configured' : 'unconfigured'); } }); }
  function onLeave() { AppTTS.stop(); saveTranscript(); if (state.isRecording) state.isRecording = false; AppRecorder.cleanup(); state.audioBlob = null; state.audioUrl = null; }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  return { render: render, afterRender: afterRender, switchPhase: switchPhase, toggleRecord: toggleRecord, requestAIScore: requestAIScore, setStar: setStar, adoptAIScore: adoptAIScore, submitEval: submitEval, playKeySentence: playKeySentence, onLeave: onLeave };
})();
