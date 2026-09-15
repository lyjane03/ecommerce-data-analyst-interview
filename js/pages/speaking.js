var PageSpeaking = (function () {
  var state = {
    phase: 'outline',
    isRecording: false,
    audioUrl: null,
    selfEvalScores: {},
    submitted: false
  };

  var evalDimensions = [
    { id: 'fluency', label: '流利度 Fluency', hint: '语言是否流畅，停顿是否自然' },
    { id: 'vocabulary', label: '词汇丰富度 Vocabulary', hint: '是否使用了专业词汇和多样表达' },
    { id: 'structure', label: '结构清晰度 Structure', hint: '逻辑是否清晰，是否按提纲组织' },
    { id: 'pronunciation', label: '发音准确度 Pronunciation', hint: '关键词发音是否清晰准确' },
    { id: 'confidence', label: '自信度 Confidence', hint: '是否表现出自信和对内容的掌握' }
  ];

  function render() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    var S = dayContent.speaking;

    return '<div class="page-speaking">' +
      '<h2 class="page-title">口语训练 — Day ' + currentDay + '</h2>' +
      '<div class="speaking-topic-bar">' +
        '<strong>' + S.title + '</strong>' +
        '<span class="day-theme-badge">' + dayContent.themeZh + '</span>' +
      '</div>' +

      '<div class="tab-bar">' +
        tabBtn('outline', '📋 汇报提纲', state.phase) +
        tabBtn('record', '🎙️ 录音练习', state.phase) +
        tabBtn('eval', '📊 自评打分', state.phase) +
      '</div>' +

      '<div id="speaking-phase-content">' + renderPhase(S) + '</div>' +
    '</div>';
  }

  function tabBtn(id, label, active) {
    return '<button class="tab-btn' + (active === id ? ' active' : '') +
      '" data-tab="' + id + '" onclick="PageSpeaking.switchPhase(\'' + id + '\')">' + label + '</button>';
  }

  function renderPhase(S) {
    if (state.phase === 'outline') return renderOutline(S);
    if (state.phase === 'record') return renderRecord(S);
    if (state.phase === 'eval') return renderEval(S);
    return '';
  }

  function renderOutline(S) {
    return '<div class="outline-section">' +
      '<div class="instruction-box">' +
        '<strong>任务：</strong>' + S.title + '<br>' +
        '建议用时：2–3分钟（约 200–350 词），录音前熟悉以下提纲和关键句型。' +
      '</div>' +

      '<div class="outline-card">' +
        '<div class="outline-title">📋 汇报提纲</div>' +
        S.outline.map(function (item, i) {
          return '<div class="outline-item">' +
            '<div class="outline-point">' + item.point + '</div>' +
            '<div class="outline-note">' + item.note + '</div>' +
            (item.noteZh ? '<div class="zh-translation">' + item.noteZh + '</div>' : '') +
          '</div>';
        }).join('') +
      '</div>' +

      '<div class="key-sentences-card">' +
        '<div class="ks-title">💬 关键句型参考</div>' +
        '<ul class="ks-list">' +
          S.keySentences.map(function (s, i) {
            return '<li class="ks-item">' +
              '<div class="ks-en-row">' +
                '<span class="ks-text">' + s + '</span>' +
                '<button class="btn-play-ks" onclick="PageSpeaking.playKeySentence(\'' + s.replace(/'/g, "\\'") + '\')" title="试听">▶</button>' +
              '</div>' +
              (S.keySentencesZh && S.keySentencesZh[i] ? '<div class="zh-translation">' + S.keySentencesZh[i] + '</div>' : '') +
            '</li>';
          }).join('') +
        '</ul>' +
      '</div>' +

      '<div class="vocab-reminder">' +
        '<div class="vr-title">🔑 当日重点词汇提醒</div>' +
        '<div class="vr-tags">' +
          getCurrentDayKeywords().map(function (kw) {
            return '<span class="vr-tag">' + kw + '</span>';
          }).join('') +
        '</div>' +
      '</div>' +

      '<button class="btn btn-primary" onclick="PageSpeaking.switchPhase(\'record\')" style="margin-top:1.5rem">开始录音 🎙️</button>' +
    '</div>';
  }

  function renderRecord(S) {
    return '<div class="record-section">' +
      '<div class="instruction-box">' +
        '<strong>录音说明：</strong>点击"开始录音"，按提纲完整汇报一遍。录完后可回听，满意后进入自评。' +
      '</div>' +

      '<div class="record-center">' +
        '<div class="record-btn-wrap">' +
          '<button class="btn-record ' + (state.isRecording ? 'recording' : '') + '" id="recordBtn" onclick="PageSpeaking.toggleRecord()">' +
            (state.isRecording ? '■ 停止录音' : '● 开始录音') +
          '</button>' +
          (state.isRecording ? '<div class="recording-indicator"><span class="rec-dot"></span> 录制中...</div>' : '') +
        '</div>' +

        (state.audioUrl ?
          '<div class="playback-area">' +
            '<div class="playback-title">录音回放：</div>' +
            '<audio controls src="' + state.audioUrl + '" class="audio-player"></audio>' +
            '<div class="playback-tips">回听时注意：发音是否清晰？逻辑是否流畅？关键词是否都用到了？</div>' +
          '</div>' : '') +
      '</div>' +

      '<div class="record-outline-mini">' +
        '<div class="mini-title">提纲速览：</div>' +
        S.outline.map(function (item) {
          return '<div class="mini-point">• ' + item.point + '</div>';
        }).join('') +
      '</div>' +

      (!AppRecorder.isSupported() ?
        '<div class="warn-box">⚠️ 浏览器不支持录音功能。请使用 Chrome 或 Edge 浏览器。</div>' : '') +

      (state.audioUrl ?
        '<button class="btn btn-primary" onclick="PageSpeaking.switchPhase(\'eval\')" style="margin-top:1rem">录音满意，进入自评 →</button>' : '') +
    '</div>';
  }

  function renderEval(S) {
    var totalScore = calcTotalScore();
    return '<div class="eval-section">' +
      '<div class="instruction-box">' +
        '<strong>自评说明：</strong>回听录音后，对每个维度打分（1–5分），然后提交保存。' +
      '</div>' +

      '<div class="eval-form">' +
        evalDimensions.map(function (dim) {
          var current = state.selfEvalScores[dim.id] || 0;
          return '<div class="eval-row">' +
            '<div class="eval-dim-label">' +
              '<span>' + dim.label + '</span>' +
              '<span class="eval-hint">' + dim.hint + '</span>' +
            '</div>' +
            '<div class="star-rating" id="stars-' + dim.id + '">' +
              [1,2,3,4,5].map(function (n) {
                return '<span class="star' + (n <= current ? ' active' : '') + '" onclick="PageSpeaking.setStar(\'' + dim.id + '\',' + n + ')">' +
                  (n <= current ? '★' : '☆') +
                '</span>';
              }).join('') +
            '</div>' +
            '<div class="eval-score-display">' + (current > 0 ? current + '/5' : '未评') + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

      (Object.keys(state.selfEvalScores).length > 0 ?
        '<div class="eval-radar-wrap">' +
          '<canvas id="speakingRadarChart" style="width:260px;height:260px;"></canvas>' +
        '</div>' : '') +

      '<div class="eval-total">' +
        '综合自评得分：<strong>' + (totalScore > 0 ? Math.round(totalScore) + '/100 分' : '请先完成所有维度评分') + '</strong>' +
      '</div>' +

      '<div class="action-row">' +
        '<button class="btn btn-primary btn-large" onclick="PageSpeaking.submitEval()" ' +
          (totalScore === 0 ? 'disabled' : '') + '>✓ 提交自评并保存</button>' +
        (state.audioUrl ? '<button class="btn btn-secondary" onclick="PageSpeaking.switchPhase(\'record\')">返回回听</button>' : '') +
      '</div>' +

      (state.submitted ?
        '<div class="success-banner">✅ 今日口语训练已完成！</div>' : '') +
    '</div>';
  }

  function switchPhase(phase) {
    state.phase = phase;
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var el = document.getElementById('speaking-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.speaking);
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === phase);
    });
    if (phase === 'eval') setTimeout(drawSpeakingRadar, 50);
  }

  function toggleRecord() {
    if (state.isRecording) {
      AppRecorder.stop().then(function (result) {
        state.isRecording = false;
        if (result) state.audioUrl = result.url;
        refreshPhase();
      });
    } else {
      AppRecorder.start().then(function () {
        state.isRecording = true;
        refreshPhase();
      }).catch(function (err) {
        App.showToast('录音失败：' + err.message, 'error');
      });
    }
  }

  function setStar(dimId, score) {
    state.selfEvalScores[dimId] = score;
    var container = document.getElementById('stars-' + dimId);
    if (container) {
      var stars = container.querySelectorAll('.star');
      stars.forEach(function (s, i) {
        s.textContent = i < score ? '★' : '☆';
        s.classList.toggle('active', i < score);
      });
    }
    var parent = container ? container.parentElement : null;
    if (parent) {
      var display = parent.querySelector('.eval-score-display');
      if (display) display.textContent = score + '/5';
    }
    var totalEl = document.querySelector('.eval-total strong');
    if (totalEl) {
      var t = calcTotalScore();
      totalEl.textContent = t > 0 ? Math.round(t) + '/100 分' : '请先完成所有维度评分';
    }
    var submitBtn = document.querySelector('.eval-section .btn-primary');
    if (submitBtn) submitBtn.disabled = calcTotalScore() === 0;
    drawSpeakingRadar();
  }

  function calcTotalScore() {
    var keys = evalDimensions.map(function (d) { return d.id; });
    var filled = keys.filter(function (k) { return state.selfEvalScores[k] > 0; });
    if (filled.length === 0) return 0;
    var sum = filled.reduce(function (acc, k) { return acc + state.selfEvalScores[k]; }, 0);
    return (sum / (keys.length * 5)) * 100;
  }

  function drawSpeakingRadar() {
    var canvas = document.getElementById('speakingRadarChart');
    if (!canvas) return;
    var labels = evalDimensions.map(function (d) { return d.label.split(' ')[0]; });
    var data = evalDimensions.map(function (d) { return state.selfEvalScores[d.id] || 0; });
    AppCharts.radarChart(canvas, labels, data, { maxVal: 5, color: AppCharts.colors.speaking });
  }

  function submitEval() {
    var score = calcTotalScore();
    if (score === 0) { App.showToast('请先完成所有维度评分', 'warning'); return; }
    var currentDay = AppStorage.getCurrentDay();
    AppStorage.saveDayProgress(currentDay, 'speaking', {
      score: Math.round(score),
      completed: true,
      timeSpent: 0,
      selfEval: JSON.parse(JSON.stringify(state.selfEvalScores))
    });
    state.submitted = true;
    App.showToast('口语自评已保存：' + Math.round(score) + ' 分', 'success');
    refreshPhase();
  }

  function playKeySentence(text) {
    AppTTS.speak(text, { rate: 0.9 });
  }

  function refreshPhase() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var el = document.getElementById('speaking-phase-content');
    if (el) el.innerHTML = renderPhase(dayContent.speaking);
    if (state.phase === 'eval') setTimeout(drawSpeakingRadar, 50);
  }

  function getCurrentDayKeywords() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    return dayContent ? dayContent.listening.keywords.slice(0, 6) : [];
  }

  function afterRender() {
    if (state.phase === 'eval') setTimeout(drawSpeakingRadar, 50);
  }

  function onLeave() {
    AppTTS.stop();
    if (state.isRecording) {
      AppRecorder.stop().catch(function () {});
      state.isRecording = false;
    }
  }

  return {
    render: render,
    afterRender: afterRender,
    switchPhase: switchPhase,
    toggleRecord: toggleRecord,
    setStar: setStar,
    submitEval: submitEval,
    playKeySentence: playKeySentence,
    onLeave: onLeave
  };
})();
