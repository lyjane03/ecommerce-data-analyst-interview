var PageWriting = (function () {
  var state = {
    phase: 'template',
    userEmail: '',
    structureResult: null,
    showReference: false
  };

  function render() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    var W = dayContent.writing;

    return '<div class="page-writing">' +
      '<h2 class="page-title">写作训练 — Day ' + currentDay + '</h2>' +
      '<div class="writing-topic-bar">' +
        '<strong>' + W.title + '</strong>' +
        '<span class="day-theme-badge">' + dayContent.themeZh + '</span>' +
      '</div>' +

      '<div class="tab-bar">' +
        tabBtn('template', '📋 模板学习', state.phase) +
        tabBtn('practice', '✍️ 改写练习', state.phase) +
        tabBtn('score', '📊 结构评分', state.phase) +
      '</div>' +

      '<div id="writing-phase-content">' + renderPhase(W, dayContent) + '</div>' +
    '</div>';
  }

  function tabBtn(id, label, active) {
    return '<button class="tab-btn' + (active === id ? ' active' : '') +
      '" data-tab="' + id + '" onclick="PageWriting.switchPhase(\'' + id + '\')">' + label + '</button>';
  }

  function renderPhase(W, dayContent) {
    if (state.phase === 'template') return renderTemplate(W);
    if (state.phase === 'practice') return renderPractice(W);
    if (state.phase === 'score') return renderScore(W);
    return '';
  }

  function renderTemplate(W) {
    return '<div class="template-section">' +
      '<div class="instruction-box">' +
        '<strong>场景：</strong>' + W.scenario +
      '</div>' +
      '<div class="template-card">' +
        '<div class="template-title">📧 邮件结构模板</div>' +
        W.template.structure.map(function (item) {
          return '<div class="template-item">' +
            '<div class="template-label">' + item.label + '</div>' +
            '<div class="template-text">' + item.text.replace(/\n/g, '<br>') + '</div>' +
            (item.textZh ? '<div class="zh-translation">' + item.textZh.replace(/\n/g, '<br>') + '</div>' : '') +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="subject-line">' +
        '<strong>主题行示例：</strong>' +
        '<span class="subject-text">' + W.template.subject + '</span>' +
      '</div>' +

      '<div class="template-tips">' +
        '<div class="tips-title">✅ 优质商务邮件结构要素</div>' +
        '<div class="tips-grid">' +
          '<div class="tip-item"><span class="tip-icon">①</span><span>主题行：清晰、行动导向</span></div>' +
          '<div class="tip-item"><span class="tip-icon">②</span><span>开场白：称呼 + 热身语</span></div>' +
          '<div class="tip-item"><span class="tip-icon">③</span><span>写作目的：第一句即点明</span></div>' +
          '<div class="tip-item"><span class="tip-icon">④</span><span>关键要点：分段/列举清晰</span></div>' +
          '<div class="tip-item"><span class="tip-icon">⑤</span><span>行动项：明确 who/what/when</span></div>' +
          '<div class="tip-item"><span class="tip-icon">⑥</span><span>结尾礼貌：专业语气</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="template-vocab">' +
        '<div class="tips-title">📝 高频商务邮件句型</div>' +
        '<ul class="phrase-list">' +
          '<li>"I\'m writing to..." / "I\'d like to..." <span class="zh-translation">我写信是为了…… / 我想要……</span></li>' +
          '<li>"Please find attached..." / "As discussed..." <span class="zh-translation">请查收附件…… / 如我们讨论的……</span></li>' +
          '<li>"Could you please..." / "Action required:" <span class="zh-translation">能否请您…… / 需要采取行动：</span></li>' +
          '<li>"Best regards" / "Warm regards" / "Kind regards" <span class="zh-translation">此致敬礼（三种常用结尾敬语）</span></li>' +
          '<li>"I look forward to..." / "Looking forward to hearing from you" <span class="zh-translation">我期待…… / 期待您的回复</span></li>' +
          '<li>"Please don\'t hesitate to reach out..." <span class="zh-translation">请随时联系我……</span></li>' +
        '</ul>' +
      '</div>' +

      '<button class="btn btn-primary" onclick="PageWriting.switchPhase(\'practice\')" style="margin-top:1rem">开始练习 →</button>' +
    '</div>';
  }

  function renderPractice(W) {
    return '<div class="practice-section">' +
      '<div class="instruction-box">' +
        '<strong>练习任务：</strong>' + W.task +
      '</div>' +

      '<div class="practice-editor">' +
        '<label class="input-label">在此用英文写你的邮件（建议 150–250 字）：</label>' +
        '<textarea id="emailEditor" class="email-textarea" rows="16" ' +
          'placeholder="Subject: \n\n[开始写你的邮件...]\n\nBest regards,\nXueyan Xu">' +
          (state.userEmail || '') +
        '</textarea>' +
        '<div class="word-count" id="wordCount">0 词</div>' +
      '</div>' +

      '<div class="action-row">' +
        '<button class="btn btn-primary btn-large" onclick="PageWriting.analyzeEmail()">📊 分析结构 & 评分</button>' +
        '<button class="btn btn-secondary" onclick="PageWriting.toggleReference()">' +
          (state.showReference ? '隐藏参考范文' : '查看参考范文') +
        '</button>' +
        '<button class="btn btn-secondary" onclick="PageWriting.clearEmail()">清空</button>' +
      '</div>' +

      (state.showReference ?
        '<div class="reference-email">' +
          '<div class="ref-title">📖 参考范文</div>' +
          '<pre class="ref-content">' + W.reference + '</pre>' +
          (W.referenceZh ?
            '<div class="ref-content-zh">' +
              '<span class="ref-zh-label">📖 中文对照翻译</span>' +
              W.referenceZh +
            '</div>' : '') +
        '</div>' : '') +
    '</div>';
  }

  function renderScore(W) {
    var result = state.structureResult;
    if (!result) {
      return '<div class="score-empty">' +
        '<p>请先完成写作练习并提交评分。</p>' +
        '<button class="btn btn-primary" onclick="PageWriting.switchPhase(\'practice\')">去写作练习</button>' +
      '</div>';
    }
    var labels = { subject: '主题行', opening: '开场白', purpose: '写作目的', keyPoints: '关键要点', actionItems: '行动项', tone: '语气结尾' };
    var maxPer = 5;
    return '<div class="score-section">' +
      '<div class="result-box">' +
        '<div class="result-title">📊 邮件结构评分</div>' +
        '<div class="score-overview">' +
          '<div class="score-big" style="color:' + scoreColor(result.percentage) + '">' + result.percentage + '</div>' +
          '<div class="score-label">综合得分（满分100）</div>' +
        '</div>' +

        '<div class="radar-wrapper">' +
          '<canvas id="writingRadarChart" style="width:260px;height:260px;"></canvas>' +
        '</div>' +

        '<div class="dimension-scores">' +
          Object.keys(result.scores).map(function (k) {
            var s = result.scores[k];
            var pct = Math.round((s / maxPer) * 100);
            return '<div class="dim-item">' +
              '<span class="dim-label">' + labels[k] + '</span>' +
              '<div class="dim-bar">' +
                '<div class="dim-fill" style="width:' + pct + '%;background:' + scoreColor(pct) + '"></div>' +
              '</div>' +
              '<span class="dim-score">' + s + '/' + maxPer + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +

        '<div class="score-tips">' +
          '<div class="tips-title">改进建议</div>' +
          Object.keys(result.scores).map(function (k) {
            var s = result.scores[k];
            var tip = '';
            if (k === 'subject' && s < 4) tip = '主题行建议格式化：动词开头 + 具体内容，例如"Proposal: [主题]"';
            if (k === 'opening' && s < 4) tip = '开场白使用"Hi [Name]"或"Dear [Name]"，避免"To Whom It May Concern"';
            if (k === 'purpose' && s < 4) tip = '邮件第一段首句即应说明写信目的，用"I\'m writing to..."';
            if (k === 'keyPoints' && s < 4) tip = '关键要点建议使用编号列表（1. 2. 3.）或项目符号（-）';
            if (k === 'actionItems' && s < 4) tip = '行动项需包含：谁做什么、截止时间，用"Could you please..."或"Action required:"';
            if (k === 'tone' && s < 4) tip = '结尾加"Best regards"/"Warm regards"，并感谢收件人的时间';
            return tip ? '<li>' + labels[k] + '：' + tip + '</li>' : '';
          }).filter(Boolean).join('') ||
          '<li>结构完整！继续保持良好格式习惯。</li>' +
        '</div>' +

        '<div class="action-row">' +
          '<button class="btn btn-primary" onclick="PageWriting.saveWritingScore(' + result.percentage + ')">✓ 保存得分并完成</button>' +
          '<button class="btn btn-secondary" onclick="PageWriting.switchPhase(\'practice\')">返回修改</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function switchPhase(phase) {
    var emailEl = document.getElementById('emailEditor');
    if (emailEl) state.userEmail = emailEl.value;
    state.phase = phase;
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var el = document.getElementById('writing-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.writing, dayContent);
    if (phase === 'score' && state.structureResult) {
      setTimeout(drawRadar, 50);
    }
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === phase);
    });
    if (phase === 'practice') {
      var ta = document.getElementById('emailEditor');
      if (ta) ta.addEventListener('input', updateWordCount);
    }
  }

  function analyzeEmail() {
    var emailEl = document.getElementById('emailEditor');
    if (!emailEl || !emailEl.value.trim()) {
      App.showToast('请先写一封邮件再评分', 'warning');
      return;
    }
    state.userEmail = emailEl.value;
    var result = AppScoring.scoreEmailStructure(state.userEmail);
    state.structureResult = result;
    state.phase = 'score';

    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var el = document.getElementById('writing-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.writing, dayContent);
    setTimeout(drawRadar, 50);
  }

  function drawRadar() {
    var canvas = document.getElementById('writingRadarChart');
    if (!canvas || !state.structureResult) return;
    var labels = ['主题行', '开场白', '目的', '要点', '行动项', '语气'];
    var s = state.structureResult.scores;
    var data = [s.subject, s.opening, s.purpose, s.keyPoints, s.actionItems, s.tone];
    AppCharts.radarChart(canvas, labels, data, { maxVal: 5, color: AppCharts.colors.writing });
  }

  function toggleReference() {
    var emailEl = document.getElementById('emailEditor');
    if (emailEl) state.userEmail = emailEl.value;
    state.showReference = !state.showReference;
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var el = document.getElementById('writing-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.writing, dayContent);
    if (state.phase === 'practice') {
      var ta = document.getElementById('emailEditor');
      if (ta) ta.addEventListener('input', updateWordCount);
    }
  }

  function clearEmail() {
    state.userEmail = '';
    state.structureResult = null;
    var ta = document.getElementById('emailEditor');
    if (ta) ta.value = '';
    updateWordCount();
  }

  function updateWordCount() {
    var ta = document.getElementById('emailEditor');
    var wc = document.getElementById('wordCount');
    if (!ta || !wc) return;
    var words = ta.value.trim().split(/\s+/).filter(Boolean).length;
    wc.textContent = words + ' 词';
  }

  function saveWritingScore(score) {
    var currentDay = AppStorage.getCurrentDay();
    var structureScores = state.structureResult ? state.structureResult.scores : {};
    AppStorage.saveDayProgress(currentDay, 'writing', {
      score: score,
      completed: true,
      timeSpent: 0,
      structureScores: structureScores
    });
    App.showToast('写作得分已保存：' + score + ' 分', 'success');
  }

  function scoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }

  function afterRender() {
    var ta = document.getElementById('emailEditor');
    if (ta) ta.addEventListener('input', updateWordCount);
    if (state.phase === 'score' && state.structureResult) setTimeout(drawRadar, 50);
  }

  function onLeave() {
    var emailEl = document.getElementById('emailEditor');
    if (emailEl) state.userEmail = emailEl.value;
  }

  return {
    render: render,
    afterRender: afterRender,
    switchPhase: switchPhase,
    analyzeEmail: analyzeEmail,
    toggleReference: toggleReference,
    clearEmail: clearEmail,
    saveWritingScore: saveWritingScore,
    onLeave: onLeave
  };
})();
