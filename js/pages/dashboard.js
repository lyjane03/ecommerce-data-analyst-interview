var PageDashboard = (function () {

  function render() {
    var data = AppStorage.getAll();
    var currentDay = AppStorage.getCurrentDay();
    var allDays = Object.keys(data.dailyProgress || {});

    var scores = { listening: [], writing: [], speaking: [], quiz: [] };
    for (var d = 1; d <= 14; d++) {
      var p = data.dailyProgress[d];
      scores.listening.push(p && p.listening ? p.listening.score : null);
      scores.writing.push(p && p.writing ? p.writing.score : null);
      scores.speaking.push(p && p.speaking ? p.speaking.score : null);
      scores.quiz.push(p && p.quiz ? p.quiz.score : null);
    }

    var todayP = data.dailyProgress[currentDay] || {};
    var yesterdayP = data.dailyProgress[currentDay - 1] || {};

    var weakVocab = (data.weakPoints && data.weakPoints.vocabulary) ? data.weakPoints.vocabulary.slice(-10) : [];
    var weakSentences = (data.weakPoints && data.weakPoints.sentences) ? data.weakPoints.sentences.slice(-5) : [];

    var completedDays = allDays.filter(function (d) {
      var p = data.dailyProgress[d];
      return p && (p.listening && p.listening.completed) &&
        (p.writing && p.writing.completed) &&
        (p.speaking && p.speaking.completed) &&
        (p.quiz && p.quiz.completed);
    }).length;

    return '<div class="page-dashboard">' +
      '<h2 class="page-title">学习进度看板</h2>' +

      '<div class="stats-row">' +
        '<div class="stat-card accent-blue">' +
          '<div class="stat-number">' + data.streakDays + '</div>' +
          '<div class="stat-label">连续学习天数</div>' +
          '<div class="stat-icon">🔥</div>' +
        '</div>' +
        '<div class="stat-card accent-green">' +
          '<div class="stat-number">' + completedDays + '</div>' +
          '<div class="stat-label">已完成天数</div>' +
          '<div class="stat-icon">✅</div>' +
        '</div>' +
        '<div class="stat-card accent-purple">' +
          '<div class="stat-number">Day ' + currentDay + '</div>' +
          '<div class="stat-label">当前学习天</div>' +
          '<div class="stat-icon">📅</div>' +
        '</div>' +
        '<div class="stat-card accent-orange">' +
          '<div class="stat-number">' + Math.round((completedDays / 14) * 100) + '%</div>' +
          '<div class="stat-label">总体完成率</div>' +
          '<div class="stat-icon">📊</div>' +
        '</div>' +
      '</div>' +

      '<div class="progress-bar-section">' +
        '<div class="section-title">14天进度概览</div>' +
        '<div class="day-progress-grid">' +
        generateDayGrid(data, currentDay) +
        '</div>' +
      '</div>' +

      '<div class="today-vs-yesterday">' +
        '<div class="section-title">今日 vs 昨日对比</div>' +
        '<div class="compare-grid">' +
          compareCard('听力', todayP.listening, yesterdayP.listening) +
          compareCard('案例分析', todayP.writing, yesterdayP.writing) +
          compareCard('口语', todayP.speaking, yesterdayP.speaking) +
          compareCard('测验', todayP.quiz, yesterdayP.quiz) +
        '</div>' +
      '</div>' +

      '<div class="chart-section">' +
        '<div class="section-title">各模块得分趋势（14天）</div>' +
        '<div class="chart-container">' +
          '<canvas id="scoreLineChart" style="width:100%;height:220px;"></canvas>' +
        '</div>' +
      '</div>' +

      '<div class="weak-section">' +
        '<div class="section-title">薄弱词汇记录</div>' +
        (weakVocab.length === 0 ?
          '<p class="empty-hint">暂无记录，完成听力/测验后自动收录薄弱词汇</p>' :
          '<div class="weak-tags">' + weakVocab.map(function (w) {
            return '<span class="weak-tag">' + w + '</span>';
          }).join('') + '</div>') +
      '</div>' +

      (weakSentences.length > 0 ?
        '<div class="weak-section">' +
          '<div class="section-title">待强化句型</div>' +
          '<ul class="weak-list">' + weakSentences.map(function (s) {
            return '<li class="weak-item">' + s + '</li>';
          }).join('') + '</ul>' +
        '</div>' : '') +

    '</div>';
  }

  function generateDayGrid(data, currentDay) {
    var html = '';
    for (var d = 1; d <= 14; d++) {
      var p = data.dailyProgress[d] || {};
      var done = p.listening && p.listening.completed &&
                 p.writing && p.writing.completed &&
                 p.speaking && p.speaking.completed &&
                 p.quiz && p.quiz.completed;
      var partial = !done && (p.listening || p.writing || p.speaking || p.quiz);
      var isCurrent = d === currentDay;
      var cls = 'day-dot' + (done ? ' done' : '') + (partial ? ' partial' : '') + (isCurrent ? ' current' : '');
      html += '<div class="' + cls + '" title="Day ' + d + '">' +
        '<span>' + d + '</span>' +
      '</div>';
    }
    return html;
  }

  function compareCard(label, today, yesterday) {
    var todayScore = today ? (today.score || 0) : null;
    var yestScore = yesterday ? (yesterday.score || 0) : null;
    var diff = (todayScore != null && yestScore != null) ? todayScore - yestScore : null;
    var diffStr = diff === null ? '--' : (diff >= 0 ? '+' + diff : '' + diff);
    var diffClass = diff === null ? '' : (diff >= 0 ? 'up' : 'down');
    return '<div class="compare-card">' +
      '<div class="compare-label">' + label + '</div>' +
      '<div class="compare-today">' + (todayScore != null ? todayScore + '分' : '--') + '</div>' +
      '<div class="compare-diff ' + diffClass + '">' + diffStr + '</div>' +
      '<div class="compare-yesterday">昨日: ' + (yestScore != null ? yestScore + '分' : '--') + '</div>' +
    '</div>';
  }

  function afterRender() {
    var data = AppStorage.getAll();
    var scores = { listening: [], writing: [], speaking: [], quiz: [] };
    for (var d = 1; d <= 14; d++) {
      var p = data.dailyProgress[d];
      scores.listening.push(p && p.listening ? p.listening.score : null);
      scores.writing.push(p && p.writing ? p.writing.score : null);
      scores.speaking.push(p && p.speaking ? p.speaking.score : null);
      scores.quiz.push(p && p.quiz ? p.quiz.score : null);
    }

    var canvas = document.getElementById('scoreLineChart');
    if (canvas) {
      AppCharts.lineChart(canvas, [
        { label: '听力', data: scores.listening, color: AppCharts.colors.listening },
        { label: '写作', data: scores.writing, color: AppCharts.colors.writing },
        { label: '口语', data: scores.speaking, color: AppCharts.colors.speaking },
        { label: '测验', data: scores.quiz, color: AppCharts.colors.quiz }
      ], {
        xLabels: ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14'],
        maxVal: 100,
        minVal: 0
      });
    }
  }

  return { render: render, afterRender: afterRender };
})();
