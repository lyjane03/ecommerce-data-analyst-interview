var PageQuiz = (function () {
  var state = {
    answers: [],
    submitted: false,
    result: null,
    currentQ: 0
  };

  function render() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    if (!dayContent) return '<p class="error">内容加载失败</p>';
    var questions = dayContent.quiz.questions;

    if (!state.submitted) {
      return renderQuiz(questions, currentDay);
    } else {
      return renderResult(questions, currentDay);
    }
  }

  function renderQuiz(questions, currentDay) {
    return '<div class="page-quiz">' +
      '<h2 class="page-title">每日测验 — Day ' + currentDay + '</h2>' +
      '<div class="quiz-meta">' +
        '<span class="quiz-count">' + questions.length + ' 道题</span>' +
        '<span class="quiz-time">建议用时：15 分钟</span>' +
      '</div>' +
      '<div class="progress-indicator">' +
        questions.map(function (q, i) {
          var answered = state.answers[i] !== undefined && state.answers[i] !== null && state.answers[i] !== '';
          return '<div class="q-dot' + (answered ? ' answered' : '') + (state.currentQ === i ? ' current' : '') +
            '" onclick="PageQuiz.jumpTo(' + i + ')">' + (i + 1) + '</div>';
        }).join('') +
      '</div>' +

      '<div class="questions-container">' +
        questions.map(function (q, qi) {
          return renderQuestion(q, qi);
        }).join('') +
      '</div>' +

      '<div class="quiz-footer">' +
        '<button class="btn btn-primary btn-large" onclick="PageQuiz.submitQuiz()">提交答案 →</button>' +
        '<div class="answered-count">' +
          '已答：' + state.answers.filter(function(a) { return a !== undefined && a !== null && a !== ''; }).length +
          '/' + questions.length +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderQuestion(q, qi) {
    var answer = state.answers[qi];
    if (q.type === 'mcq') return renderMCQ(q, qi, answer);
    if (q.type === 'fillblank') return renderFillBlank(q, qi, answer);
    if (q.type === 'correction') return renderCorrection(q, qi, answer);
    return '';
  }

  function renderMCQ(q, qi, answer) {
    return '<div class="question-block" id="q-' + qi + '">' +
      '<div class="q-header">' +
        '<span class="q-num">Q' + (qi + 1) + '</span>' +
        '<span class="q-type-badge mcq">选择题</span>' +
      '</div>' +
      '<div class="q-text">' + q.question + '</div>' +
      '<div class="options-list">' +
        q.options.map(function (opt, oi) {
          var selected = answer === oi;
          return '<div class="option' + (selected ? ' selected' : '') + '" onclick="PageQuiz.selectMCQ(' + qi + ',' + oi + ')">' +
            '<span class="opt-circle">' + ['A','B','C','D'][oi] + '</span>' +
            '<span class="opt-text">' + opt + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function renderFillBlank(q, qi, answer) {
    return '<div class="question-block" id="q-' + qi + '">' +
      '<div class="q-header">' +
        '<span class="q-num">Q' + (qi + 1) + '</span>' +
        '<span class="q-type-badge fill">填空题</span>' +
      '</div>' +
      '<div class="q-text">' + q.question + '</div>' +
      '<div class="fill-input-wrap">' +
        '<input type="text" class="fill-input" placeholder="输入答案..." value="' + (answer || '') + '" ' +
          'oninput="PageQuiz.setFill(' + qi + ', this.value)">' +
      '</div>' +
    '</div>';
  }

  function renderCorrection(q, qi, answer) {
    return '<div class="question-block" id="q-' + qi + '">' +
      '<div class="q-header">' +
        '<span class="q-num">Q' + (qi + 1) + '</span>' +
        '<span class="q-type-badge correction">改错题</span>' +
      '</div>' +
      '<div class="q-text">' + q.question + '</div>' +
      '<div class="correction-orig">' +
        '<strong>原句：</strong>' + q.question.replace('Correct: ', '').replace('Correct this sentence: ', '').replace(/"/g, '') +
      '</div>' +
      '<div class="fill-input-wrap">' +
        '<label>改正后：</label>' +
        '<input type="text" class="fill-input" placeholder="写出改正后的句子..." value="' + (answer || '') + '" ' +
          'oninput="PageQuiz.setFill(' + qi + ', this.value)">' +
      '</div>' +
    '</div>';
  }

  function renderResult(questions, currentDay) {
    var result = state.result;
    return '<div class="page-quiz">' +
      '<h2 class="page-title">测验结果 — Day ' + currentDay + '</h2>' +

      '<div class="result-box">' +
        '<div class="result-title">📊 测验得分</div>' +
        '<div class="score-overview">' +
          '<div class="score-big" style="color:' + scoreColor(result.score) + '">' + result.score + '</div>' +
          '<div class="score-label">总分（' + result.correct + '/' + result.total + ' 题正确）</div>' +
        '</div>' +
        '<div class="score-bar">' +
          '<div class="score-fill" style="width:' + result.score + '%;background:' + scoreColor(result.score) + '"></div>' +
        '</div>' +
      '</div>' +

      '<div class="answers-review">' +
        '<div class="review-title">题目解析</div>' +
        questions.map(function (q, qi) {
          var r = result.results[qi];
          return renderReview(q, qi, r);
        }).join('') +
      '</div>' +

      '<div class="action-row">' +
        '<button class="btn btn-primary" onclick="PageQuiz.saveQuizScore()">✓ 保存得分</button>' +
        '<button class="btn btn-secondary" onclick="PageQuiz.retake()">重做</button>' +
      '</div>' +
    '</div>';
  }

  function renderReview(q, qi, r) {
    var cls = r.correct ? 'review-correct' : 'review-wrong';
    var icon = r.correct ? '✅' : '❌';
    var userAnswerStr = '';
    if (q.type === 'mcq') {
      userAnswerStr = r.userAnswer !== undefined && r.userAnswer !== null
        ? q.options[r.userAnswer] : '（未作答）';
    } else {
      userAnswerStr = r.userAnswer || '（未作答）';
    }

    return '<div class="review-block ' + cls + '">' +
      '<div class="review-header">' +
        '<span class="review-icon">' + icon + '</span>' +
        '<span class="review-q">Q' + (qi + 1) + ' — ' + typeLabel(q.type) + '</span>' +
      '</div>' +
      '<div class="review-question">' + q.question + '</div>' +
      '<div class="review-your-answer">你的答案：<span>' + userAnswerStr + '</span></div>' +
      (!r.correct ?
        '<div class="review-correct-answer">正确答案：<span>' +
          (q.type === 'mcq' ? q.options[q.answer] : (q.type === 'correction' ? q.corrected : q.answer)) +
        '</span></div>' : '') +
      '<div class="review-explanation">💡 ' + q.explanation +
        (q.explanationZh ? '<div class="zh-translation">' + q.explanationZh + '</div>' : '') +
      '</div>' +
    '</div>';
  }

  function typeLabel(type) {
    if (type === 'mcq') return '选择题';
    if (type === 'fillblank') return '填空题';
    if (type === 'correction') return '改错题';
    return '';
  }

  function selectMCQ(qi, oi) {
    if (state.submitted) return;
    state.answers[qi] = oi;
    var block = document.getElementById('q-' + qi);
    if (block) {
      block.querySelectorAll('.option').forEach(function (el, i) {
        el.classList.toggle('selected', i === oi);
      });
    }
    updateAnsweredCount();
  }

  function setFill(qi, val) {
    state.answers[qi] = val;
    updateAnsweredCount();
  }

  function jumpTo(i) {
    state.currentQ = i;
    var block = document.getElementById('q-' + i);
    if (block) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.q-dot').forEach(function (el, idx) {
      el.classList.toggle('current', idx === i);
    });
  }

  function updateAnsweredCount() {
    var el = document.querySelector('.answered-count');
    if (!el) return;
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var total = dayContent.quiz.questions.length;
    var answered = state.answers.filter(function (a) { return a !== undefined && a !== null && a !== ''; }).length;
    el.textContent = '已答：' + answered + '/' + total;
  }

  function submitQuiz() {
    var currentDay = AppStorage.getCurrentDay();
    var dayContent = AppContent.days[currentDay - 1];
    var questions = dayContent.quiz.questions;
    var unanswered = questions.length - state.answers.filter(function (a) {
      return a !== undefined && a !== null && a !== '';
    }).length;
    if (unanswered > 0 && !confirm('还有 ' + unanswered + ' 道题未作答，确定提交吗？')) return;

    var result = AppScoring.scoreQuiz(questions, state.answers);
    state.result = result;
    state.submitted = true;

    result.results.forEach(function (r, i) {
      if (!r.correct) {
        AppStorage.addQuizError(currentDay, i, questions[i].type);
        if (questions[i].type === 'vocabulary' || questions[i].type === 'fillblank') {
          var correctAns = typeof questions[i].answer === 'string' ? questions[i].answer : '';
          if (correctAns) AppStorage.addWeakVocabulary(correctAns);
        }
      }
    });

    var el = document.getElementById('app-content');
    if (el) el.innerHTML = render();
  }

  function saveQuizScore() {
    if (!state.result) return;
    var currentDay = AppStorage.getCurrentDay();
    AppStorage.saveDayProgress(currentDay, 'quiz', {
      score: state.result.score,
      completed: true,
      correct: state.result.correct,
      total: state.result.total,
      details: state.result.results
    });
    App.showToast('测验得分已保存：' + state.result.score + ' 分', 'success');
  }

  function retake() {
    state.answers = [];
    state.submitted = false;
    state.result = null;
    state.currentQ = 0;
    var el = document.querySelector('#app-content');
    if (el) el.innerHTML = render();
  }

  function scoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }

  function onLeave() {
    state.answers = [];
    state.submitted = false;
    state.result = null;
    state.currentQ = 0;
  }

  return {
    render: render,
    selectMCQ: selectMCQ,
    setFill: setFill,
    jumpTo: jumpTo,
    submitQuiz: submitQuiz,
    saveQuizScore: saveQuizScore,
    retake: retake,
    onLeave: onLeave
  };
})();
