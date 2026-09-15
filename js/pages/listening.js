var PageListening = (function () {
  var RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  var state = {
    phase: 'dictation',
    dayContent: null,
    showText: false,
    dictationInput: '',
    keywordsInput: '',
    dictationResult: null,
    keywordResult: null,
    comprehensionAnswers: [],
    comprehensionResult: null,
    sentenceIndex: 0,
    speakCtrl: null,
    // 播放器状态
    playerStatus: 'stopped',   // 'stopped' | 'playing' | 'paused'
    playerRate: 1.0,
    playerSentenceIdx: 0,
    playerTotalSentences: 0,
    playerCtrl: null,
    selectedSentenceIdx: -1
  };

  // 拖动进度条时的临时状态
  var _seekDragInfo = null;

  function render() {
    var currentDay = AppStorage.getCurrentDay();
    state.dayContent = AppContent.days[currentDay - 1];
    if (!state.dayContent) return '<p class="error">内容加载失败</p>';
    var L = state.dayContent.listening;

    return '<div class="page-listening">' +
      '<h2 class="page-title">听力训练 — Day ' + currentDay + '</h2>' +
      '<div class="listening-topic-bar">' +
        '<strong>' + L.title + '</strong>' +
        '<span class="day-theme-badge">' + state.dayContent.themeZh + '</span>' +
      '</div>' +
      '<div class="source-strip"><strong>来源依据：</strong>' + sourceLinks(state.dayContent.sourceIds) + '</div>' +

      '<div class="tab-bar">' +
        tabBtn('dictation', '📝 听写练习', state.phase) +
        tabBtn('followRead', '🔁 跟读训练', state.phase) +
        tabBtn('comprehension', '🧠 听力理解', state.phase) +
      '</div>' +

      '<div id="listening-phase-content">' + renderPhase(L) + '</div>' +
    '</div>';
  }

  function tabBtn(id, label, active) {
    return '<button class="tab-btn' + (active === id ? ' active' : '') +
      '" data-tab="' + id + '" onclick="PageListening.switchPhase(\'' + id + '\')">' + label + '</button>';
  }

  function sourceLinks(ids) {
    return (ids || []).map(function (id) {
      var source = AppSources && AppSources.get(id);
      return source ? '<a href="' + source.url + '" target="_blank" rel="noopener">' + source.publisher + '</a>' : '';
    }).filter(Boolean).join(' · ');
  }

  function renderPhase(L) {
    if (state.phase === 'dictation') return renderDictation(L);
    if (state.phase === 'followRead') return renderFollowRead(L);
    if (state.phase === 'comprehension') return renderComprehension(L);
    return '';
  }

  function renderPlayerBar(L) {
    var total = L.text.length;
    var cur = state.playerSentenceIdx;
    var pct = total > 0 ? Math.round(cur / total * 100) : 0;
    var status = state.playerStatus;

    var ticks = '';
    for (var ti = 1; ti < total; ti++) {
      var tickPct = Math.round(ti / total * 100);
      ticks += '<div class="progress-tick" style="left:' + tickPct + '%"' +
        ' title="第' + (ti + 1) + '句"' +
        ' onmousedown="event.stopPropagation()"' +
        ' onclick="event.stopPropagation();PageListening.seekToSentenceIdx(' + ti + ')"></div>';
    }

    return '<div class="tts-player">' +
      '<div class="rate-pills">' +
        RATES.map(function (r) {
          var active = state.playerRate === r ? ' active' : '';
          return '<button class="rate-pill' + active + '" onclick="PageListening.setRate(' + r + ')">' + r + 'x</button>';
        }).join('') +
      '</div>' +
      '<div class="player-bar">' +
        '<div class="progress-track" onmousedown="PageListening.startSeekDrag(event, this)">' +
          '<div class="progress-fill" style="width:' + pct + '%"></div>' +
          ticks +
        '</div>' +
        '<span class="progress-label">' + cur + ' / ' + total + '</span>' +
        (status === 'playing'
          ? '<button class="player-btn" onclick="PageListening.pauseTTS()" title="暂停">⏸</button>'
          : '<button class="player-btn primary" onclick="PageListening.playAll()" title="播放">▶</button>') +
        '<button class="player-btn" onclick="PageListening.stopTTS()" title="停止">■</button>' +
      '</div>' +
    '</div>';
  }

  function renderDictation(L) {
    var result = state.dictationResult;
    return '<div class="dictation-section">' +
      '<div class="instruction-box">' +
        '<strong>听写练习</strong>：先播放音频，在文本框中写出你听到的内容，然后点击"评分"查看结果。' +
      '</div>' +

      renderPlayerBar(L) +

      '<div class="show-text-row">' +
        '<button class="btn btn-secondary btn-sm" onclick="PageListening.toggleText()">' +
          (state.showText ? '隐藏原文' : '显示原文') +
        '</button>' +
      '</div>' +

      (state.showText ?
        '<div class="original-text">' + L.text.map(function(s, i) {
          var selCls = state.selectedSentenceIdx === i ? ' selected' : '';
          return '<p class="sentence' + selCls + '" id="sent-' + i + '"' +
            ' onclick="PageListening.seekToSentence(' + i + ')" title="点击跳转到此句">' + s +
            (L.textZh && L.textZh[i] ? '<span class="zh-translation">' + L.textZh[i] + '</span>' : '') +
          '</p>';
        }).join('') + '</div>' : '') +

      '<div class="dictation-input-area">' +
        '<label class="input-label">请在下方写出你听到的内容（英文）：</label>' +
        '<textarea id="dictationTextarea" class="dictation-textarea" rows="8" placeholder="在此输入你听到的英文内容...">' +
          (state.dictationInput || '') +
        '</textarea>' +
        '<div class="keyword-section">' +
          '<label class="input-label">关键词抓取（逗号分隔，写出你认为的关键词）：</label>' +
          '<input type="text" id="keywordsInput" class="keywords-input" placeholder="例如：conversion, cohort, data quality" value="' + (state.keywordsInput || '') + '">' +
        '</div>' +
        '<div class="action-row">' +
          '<button class="btn btn-primary btn-large" onclick="PageListening.scoreDictation()">📊 提交评分</button>' +
          '<button class="btn btn-secondary" onclick="PageListening.clearDictation()">清空</button>' +
        '</div>' +
      '</div>' +

      (result ? renderDictationResult(result, L) : '') +
    '</div>';
  }

  function renderDictationResult(result, L) {
    var dr = result.dictation, kr = result.keywords;
    var totalScore = Math.round(dr.accuracy * 0.6 + kr.score * 0.4);
    return '<div class="result-box">' +
      '<div class="result-title">📊 评分结果</div>' +
      '<div class="score-overview">' +
        '<div class="score-big" style="color:' + scoreColor(totalScore) + '">' + totalScore + '</div>' +
        '<div class="score-label">综合得分</div>' +
      '</div>' +
      '<div class="score-details">' +
        '<div class="score-item">' +
          '<span class="score-item-label">听写准确率</span>' +
          '<span class="score-item-val">' + dr.accuracy + '%</span>' +
          '<div class="mini-bar"><div class="mini-fill" style="width:' + dr.accuracy + '%;background:' + AppCharts.colors.listening + '"></div></div>' +
        '</div>' +
        '<div class="score-item">' +
          '<span class="score-item-label">关键词抓取</span>' +
          '<span class="score-item-val">' + kr.found + '/' + kr.total + '</span>' +
          '<div class="mini-bar"><div class="mini-fill" style="width:' + kr.score + '%;background:' + AppCharts.colors.quiz + '"></div></div>' +
        '</div>' +
      '</div>' +
      (dr.missed.length > 0 ?
        '<div class="missed-words">' +
          '<strong>未听出的词：</strong>' +
          dr.missed.slice(0, 15).map(function (w) {
            return '<span class="missed-tag">' + w + '</span>';
          }).join('') +
        '</div>' : '') +
      (kr.missedWords.length > 0 ?
        '<div class="missed-words">' +
          '<strong>遗漏关键词：</strong>' +
          kr.missedWords.map(function (w) {
            return '<span class="missed-tag kw">' + w + '</span>';
          }).join('') +
        '</div>' : '') +
      '<div class="original-text collapsed">' +
        '<div class="collapsed-title">查看原文 ▼</div>' +
        '<div class="original-content">' +
          L.text.map(function (s, i) {
            return '<p>' + s +
              (L.textZh && L.textZh[i] ? '<span class="zh-translation">' + L.textZh[i] + '</span>' : '') +
            '</p>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<button class="btn btn-primary" onclick="PageListening.saveListeningScore(' + totalScore + ')">✓ 保存得分并完成</button>' +
    '</div>';
  }

  function renderFollowRead(L) {
    var idx = state.sentenceIndex;
    var sentences = L.text;
    return '<div class="follow-read-section">' +
      '<div class="instruction-box">' +
        '<strong>跟读训练</strong>：逐句播放，跟读后点击下一句。' +
      '</div>' +
      '<div class="sentence-nav">' +
        '<span class="sentence-counter">' + (idx + 1) + ' / ' + sentences.length + '</span>' +
      '</div>' +
      '<div class="current-sentence-box">' +
        '<p class="current-sentence" id="currentSentence">' + sentences[idx] +
          (L.textZh && L.textZh[idx] ? '<span class="zh-translation">' + L.textZh[idx] + '</span>' : '') +
        '</p>' +
      '</div>' +
      '<div class="follow-controls">' +
        '<button class="btn btn-secondary" onclick="PageListening.prevSentence()" ' + (idx === 0 ? 'disabled' : '') + '>← 上一句</button>' +
        '<button class="btn btn-primary" onclick="PageListening.playSentence()">▶ 播放此句</button>' +
        '<button class="btn btn-secondary" onclick="PageListening.nextSentence()" ' + (idx >= sentences.length - 1 ? 'disabled' : '') + '>下一句 →</button>' +
      '</div>' +
      '<div class="all-sentences">' +
        '<div class="all-title">全文对照：</div>' +
        sentences.map(function (s, i) {
          return '<p class="follow-sentence' + (i === idx ? ' active' : '') + '" onclick="PageListening.jumpSentence(' + i + ')">' +
            '<span class="sent-num">' + (i + 1) + '.</span> ' + s +
            (L.textZh && L.textZh[i] ? '<span class="zh-translation">' + L.textZh[i] + '</span>' : '') +
          '</p>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderComprehension(L) {
    var qs = L.comprehension;
    var result = state.comprehensionResult;
    return '<div class="comprehension-section">' +
      '<div class="instruction-box">' +
        '<strong>听力理解</strong>：先播放音频，再回答以下问题。' +
      '</div>' +
      renderPlayerBar(L) +
      '<div class="questions-list">' +
      qs.map(function (q, qi) {
        return '<div class="question-block">' +
          '<div class="question-text"><strong>Q' + (qi+1) + '：</strong>' + q.question + '</div>' +
          '<div class="options-list">' +
          q.options.map(function (opt, oi) {
            var isSelected = state.comprehensionAnswers[qi] === oi;
            var isCorrect = result && oi === q.answer;
            var isWrong = result && isSelected && oi !== q.answer;
            var cls = 'option' + (isSelected ? ' selected' : '') + (isCorrect && result ? ' correct' : '') + (isWrong ? ' wrong' : '');
            return '<div class="' + cls + '" onclick="PageListening.selectAnswer(' + qi + ',' + oi + ')">' +
              '<span class="opt-letter">' + ['A','B','C','D'][oi] + '</span>' +
              '<span class="opt-text">' + opt + '</span>' +
            '</div>';
          }).join('') +
          '</div>' +
          (result ?
            '<div class="answer-explanation">' +
              (state.comprehensionAnswers[qi] === q.answer ? '✅ 正确！' : '❌ 正确答案：' + q.options[q.answer]) +
              (q.explanationZh ? '<span class="zh-translation">' + q.explanationZh + '</span>' : '') +
            '</div>' : '') +
        '</div>';
      }).join('') +
      '</div>' +
      (!result ?
        '<button class="btn btn-primary btn-large" onclick="PageListening.scoreComprehension()">提交答案</button>' :
        '<div class="result-summary">得分：' + result.score + '分（' + result.correct + '/' + result.total + ' 题正确）</div>') +
    '</div>';
  }

  function switchPhase(phase) {
    // 切换 tab 时停止当前播放
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';
    state.playerSentenceIdx = 0;

    state.phase = phase;
    var el = document.getElementById('listening-phase-content');
    if (el) el.innerHTML = renderPhase(state.dayContent.listening);
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === phase);
    });
  }

  function updateProgressUI() {
    var L = state.dayContent ? state.dayContent.listening : null;
    if (!L) return;
    var total = L.text.length;
    var cur = state.playerSentenceIdx;
    var pct = total > 0 ? Math.round(cur / total * 100) : 0;

    var fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = pct + '%';
    var label = document.querySelector('.progress-label');
    if (label) label.textContent = cur + ' / ' + total;

    var oldPlay = document.querySelector('.player-btn.primary');
    var oldPause = document.querySelector('.player-btn[title="暂停"]');
    if (state.playerStatus === 'playing') {
      if (oldPlay) {
        oldPlay.textContent = '⏸';
        oldPlay.title = '暂停';
        oldPlay.onclick = function () { PageListening.pauseTTS(); };
        oldPlay.classList.remove('primary');
      }
    } else {
      if (oldPause) {
        oldPause.textContent = '▶';
        oldPause.title = '播放';
        oldPause.onclick = function () { PageListening.playAll(); };
        oldPause.classList.add('primary');
      }
      if (oldPlay) {
        oldPlay.textContent = '▶';
        oldPlay.title = '播放';
        oldPlay.onclick = function () { PageListening.playAll(); };
      }
    }

    document.querySelectorAll('.sentence').forEach(function (el) { el.classList.remove('speaking'); });
    if (state.playerStatus === 'playing') {
      var sentEl = document.getElementById('sent-' + (cur - 1));
      if (sentEl) sentEl.classList.add('speaking');
    }
  }

  function playAll() {
    var L = state.dayContent.listening;
    var sentences = L.text;

    if (state.playerStatus === 'paused') {
      AppTTS.resume();
      state.playerStatus = 'playing';
      updateProgressUI();
      return;
    }

    AppTTS.stop();
    state.playerStatus = 'playing';
    state.playerTotalSentences = sentences.length;
    var startIdx = state.playerSentenceIdx;
    var playRate = state.playerRate;

    // 部分浏览器（Chrome/macOS）在 synth.cancel() 后立即调用 synth.speak()
    // 会静默丢弃新语音，需延迟一帧确保取消操作真正完成
    setTimeout(function () {
      if (state.playerStatus !== 'playing') return;
      state.playerCtrl = AppTTS.speakSentences(sentences.slice(startIdx), {
        rate: playRate,
        pause: 600,
        onSentenceStart: function (relIdx) {
          state.playerSentenceIdx = startIdx + relIdx + 1;
          updateProgressUI();
        },
        onAllEnd: function () {
          state.playerStatus = 'stopped';
          state.playerSentenceIdx = 0;
          updateProgressUI();
        }
      });
    }, 50);
  }

  function pauseTTS() {
    if (state.playerStatus !== 'playing') return;
    AppTTS.pause();
    state.playerStatus = 'paused';
    updateProgressUI();
  }

  function playSentence() {
    var L = state.dayContent.listening;
    AppTTS.stop();
    AppTTS.speak(L.text[state.sentenceIndex], { rate: state.playerRate || 1.0 });
  }

  function stopTTS() {
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';
    state.playerSentenceIdx = 0;
    updateProgressUI();
  }

  function setRate(val) {
    state.playerRate = parseFloat(val);
    AppTTS.setRate(state.playerRate);
    var wasPlaying = state.playerStatus === 'playing';
    if (wasPlaying) {
      // playerSentenceIdx 是"已开始的句数"（当前句 index + 1），
      // 减 1 可回到当前句的起点重新播放
      var savedIdx = Math.max(0, state.playerSentenceIdx - 1);
      stopTTS();
      state.playerSentenceIdx = savedIdx;
      playAll();
    }
    document.querySelectorAll('.rate-pill').forEach(function (btn) {
      btn.classList.toggle('active', parseFloat(btn.textContent) === state.playerRate);
    });
  }

  function seekProgress(e, trackEl) {
    var L = state.dayContent.listening;
    var rect = trackEl.getBoundingClientRect();
    var ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    var targetIdx = Math.round(ratio * L.text.length);
    var wasPlaying = state.playerStatus === 'playing' || state.playerStatus === 'paused';
    stopTTS();
    state.playerSentenceIdx = targetIdx;
    if (wasPlaying) playAll();
    else updateProgressUI();
  }

  function _calcSeekIdx(clientX, trackEl) {
    var L = state.dayContent.listening;
    var rect = trackEl.getBoundingClientRect();
    var ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return { idx: Math.round(ratio * L.text.length), pct: Math.round(ratio * 100) };
  }

  function _updateSeekVisual(idx, pct, total) {
    var fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = pct + '%';
    var label = document.querySelector('.progress-label');
    if (label) label.textContent = idx + ' / ' + total;
  }

  function startSeekDrag(e, trackEl) {
    if (e.button !== 0) return;
    var L = state.dayContent.listening;
    var wasPlaying = state.playerStatus === 'playing' || state.playerStatus === 'paused';

    // 立即停止 TTS，防止播放回调覆盖拖动进度条视觉
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';

    var result = _calcSeekIdx(e.clientX, trackEl);
    state.playerSentenceIdx = result.idx;
    _updateSeekVisual(result.idx, result.pct, L.text.length);
    _seekDragInfo = { trackEl: trackEl, wasPlaying: wasPlaying };

    function onMove(ev) {
      if (!_seekDragInfo) return;
      var r = _calcSeekIdx(ev.clientX, _seekDragInfo.trackEl);
      state.playerSentenceIdx = r.idx;
      _updateSeekVisual(r.idx, r.pct, L.text.length);
    }

    function onUp(ev) {
      if (!_seekDragInfo) return;
      var r = _calcSeekIdx(ev.clientX, _seekDragInfo.trackEl);
      var shouldPlay = _seekDragInfo.wasPlaying;
      _seekDragInfo = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      state.playerSentenceIdx = r.idx;
      if (shouldPlay) playAll();
      else updateProgressUI();
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  }

  // 从进度条 tick 点击跳转（按句子序号）
  function seekToSentenceIdx(i) {
    var wasPlaying = state.playerStatus === 'playing' || state.playerStatus === 'paused';
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';
    state.playerSentenceIdx = i;
    if (wasPlaying) playAll();
    else updateProgressUI();
  }

  // 从原文点击某句跳转播放位置
  function seekToSentence(i) {
    state.selectedSentenceIdx = i;
    var wasPlaying = state.playerStatus === 'playing' || state.playerStatus === 'paused';
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';
    state.playerSentenceIdx = i;
    if (wasPlaying) playAll();
    else updateProgressUI();
    document.querySelectorAll('.sentence').forEach(function (el) { el.classList.remove('selected'); });
    var sentEl = document.getElementById('sent-' + i);
    if (sentEl) {
      sentEl.classList.add('selected');
      sentEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function toggleText() {
    state.showText = !state.showText;
    var el = document.getElementById('listening-phase-content');
    if (el) el.innerHTML = renderPhase(state.dayContent.listening);
  }

  function prevSentence() {
    if (state.sentenceIndex > 0) { state.sentenceIndex--; refreshPhase(); }
  }

  function nextSentence() {
    var L = state.dayContent.listening;
    if (state.sentenceIndex < L.text.length - 1) { state.sentenceIndex++; refreshPhase(); }
  }

  function jumpSentence(i) {
    state.sentenceIndex = i;
    refreshPhase();
  }

  function refreshPhase() {
    var el = document.getElementById('listening-phase-content');
    if (el) el.innerHTML = renderPhase(state.dayContent.listening);
  }

  function scoreDictation() {
    var textarea = document.getElementById('dictationTextarea');
    var kwInput = document.getElementById('keywordsInput');
    if (!textarea) return;
    state.dictationInput = textarea.value;
    state.keywordsInput = kwInput ? kwInput.value : '';

    var L = state.dayContent.listening;
    var fullText = L.text.join(' ');
    var dr = AppScoring.scoreDictation(fullText, state.dictationInput);
    var userKW = state.keywordsInput.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var kr = AppScoring.scoreKeywords(L.keywords, userKW);

    dr.missed.forEach(function (w) { if (w.length > 3) AppStorage.addWeakVocabulary(w); });
    kr.missedWords.forEach(function (w) { AppStorage.addWeakVocabulary(w); });

    state.dictationResult = { dictation: dr, keywords: kr };
    refreshPhase();
  }

  function clearDictation() {
    state.dictationInput = '';
    state.keywordsInput = '';
    state.dictationResult = null;
    refreshPhase();
  }

  function selectAnswer(qi, oi) {
    if (state.comprehensionResult) return;
    state.comprehensionAnswers[qi] = oi;
    refreshPhase();
  }

  function scoreComprehension() {
    var L = state.dayContent.listening;
    var result = AppScoring.scoreComprehension(L.comprehension, state.comprehensionAnswers);
    state.comprehensionResult = result;
    refreshPhase();
  }

  function saveListeningScore(score) {
    var currentDay = AppStorage.getCurrentDay();
    AppStorage.saveDayProgress(currentDay, 'listening', {
      score: score,
      completed: true,
      timeSpent: 0,
      dictationAccuracy: state.dictationResult ? state.dictationResult.dictation.accuracy : 0,
      keywordsFound: state.dictationResult ? state.dictationResult.keywords.found : 0
    });
    App.showToast('听力得分已保存：' + score + ' 分', 'success');
  }

  function scoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }

  function onLeave() {
    AppTTS.stop();
    if (state.playerCtrl) { state.playerCtrl.stop(); state.playerCtrl = null; }
    state.playerStatus = 'stopped';
    state.playerSentenceIdx = 0;
    state.dictationResult = null;
    state.comprehensionResult = null;
    state.comprehensionAnswers = [];
    state.showText = false;
    state.sentenceIndex = 0;
    state.selectedSentenceIdx = -1;
    _seekDragInfo = null;
  }

  return {
    render: render,
    switchPhase: switchPhase,
    playAll: playAll,
    pauseTTS: pauseTTS,
    stopTTS: stopTTS,
    setRate: setRate,
    startSeekDrag: startSeekDrag,
    seekToSentenceIdx: seekToSentenceIdx,
    seekToSentence: seekToSentence,
    playSentence: playSentence,
    toggleText: toggleText,
    prevSentence: prevSentence,
    nextSentence: nextSentence,
    jumpSentence: jumpSentence,
    scoreDictation: scoreDictation,
    clearDictation: clearDictation,
    selectAnswer: selectAnswer,
    scoreComprehension: scoreComprehension,
    saveListeningScore: saveListeningScore,
    onLeave: onLeave
  };
})();
