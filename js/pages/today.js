var PageToday = (function () {
  var timerRunning = false;
  var timerElapsed = 0;
  var timerInterval = null;

  function render() {
    var currentDay = AppStorage.getCurrentDay();
    var data = AppStorage.getAll();
    var progress = data.dailyProgress[currentDay] || {};
    var dayContent = AppContent.days[currentDay - 1];

    var phases = [
      {
        id: 'listening',
        icon: '🎧',
        label: '听力训练',
        duration: '90 分钟',
        desc: '精听 30min → 跟读 30min → 理解练习 30min',
        color: 'blue',
        done: !!(progress.listening && progress.listening.completed),
        page: 'listening'
      },
      {
        id: 'writing',
        icon: '✍️',
        label: '案例分析',
        duration: '80 分钟',
        desc: '读数据情境 20min → 英文作答 40min → 五维 rubric 自评 20min',
        color: 'purple',
        done: !!(progress.writing && progress.writing.completed),
        page: 'writing'
      },
      {
        id: 'speaking',
        icon: '🎙️',
        label: '口语训练',
        duration: '50 分钟',
        desc: '提纲准备 15min → 录音练习 25min → 自评复盘 10min',
        color: 'orange',
        done: !!(progress.speaking && progress.speaking.completed),
        page: 'speaking'
      },
      {
        id: 'quiz',
        icon: '📝',
        label: '每日测验',
        duration: '20 分钟',
        desc: '综合测验 15min → 错题回顾 5min',
        color: 'green',
        done: !!(progress.quiz && progress.quiz.completed),
        page: 'quiz'
      }
    ];

    var completedCount = phases.filter(function (p) { return p.done; }).length;

    var html = '<div class="page-today">' +
      '<div class="today-header">' +
        '<div class="today-header-top">' +
          '<div class="today-day-badge">Day ' + currentDay + ' / 14</div>' +
          '<button class="overview-shortcut-btn" onclick="App.navigate(\'overview\')">📈 查看学习进度</button>' +
        '</div>' +
        '<h2 class="page-title">今日训练计划</h2>' +
        '<div class="today-theme">' +
          '<span class="theme-tag">今日主题</span>' +
          '<span class="theme-text">' + (dayContent ? dayContent.themeZh : '') + '</span>' +
        '</div>' +
        '<div class="today-theme en">' +
          '<span class="theme-text-en">' + (dayContent ? dayContent.theme : '') + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="timer-section">' +
        '<div class="timer-display" id="todayTimerDisplay">0:00</div>' +
        '<div class="timer-label">今日累计学习时间（目标 240 分钟）</div>' +
        '<div class="timer-controls">' +
          '<button class="btn btn-primary" id="timerStartBtn" onclick="PageToday.toggleTimer()">开始计时</button>' +
          '<button class="btn btn-secondary" onclick="PageToday.resetTimer()">重置</button>' +
        '</div>' +
        '<div class="timer-progress-bar"><div class="timer-progress-fill" id="timerProgressFill" style="width:0%"></div></div>' +
        '<div class="timer-progress-label"><span id="timerProgressLabel">0 / 240 分钟</span></div>' +
      '</div>' +

      '<div class="phase-progress-summary">' +
        '<span class="summary-text">今日进度：</span>' +
        '<span class="summary-count">' + completedCount + '/4 模块完成</span>' +
      '</div>' +

      '<div class="phases-grid">' +
      phases.map(function (phase, idx) {
        return '<div class="phase-card phase-' + phase.color + (phase.done ? ' done' : '') + '">' +
          '<div class="phase-header">' +
            '<span class="phase-icon">' + phase.icon + '</span>' +
            '<div class="phase-info">' +
              '<div class="phase-label">' + phase.label + '</div>' +
              '<div class="phase-duration">' + phase.duration + '</div>' +
            '</div>' +
            (phase.done ? '<span class="phase-done-badge">✓ 已完成</span>' : '') +
          '</div>' +
          '<div class="phase-desc">' + phase.desc + '</div>' +
          '<div class="phase-score">' +
            (progress[phase.id] && progress[phase.id].score != null ?
              '<span class="score-badge">得分：' + progress[phase.id].score + '分</span>' + (AppStorage.scoreSourceLabel(progress[phase.id]) ? '<span class="score-source-badge ' + (progress[phase.id].scoreSource === 'ai' ? 'ai' : 'self') + '">' + AppStorage.scoreSourceLabel(progress[phase.id]) + '</span>' : '') : '') +
          '</div>' +
          '<button class="btn btn-' + phase.color + ' phase-btn" onclick="App.navigate(\'' + phase.page + '\')">' +
            (phase.done ? '复习' : '开始') + ' ' + phase.label +
          '</button>' +
        '</div>';
      }).join('') +
      '</div>' +

      '<div class="daily-tips">' +
        '<div class="tips-title">💡 今日学习建议</div>' +
        '<ul class="tips-list">' +
          '<li>先完成听力训练，趁注意力最集中时处理最难的模块</li>' +
          '<li>案例分析先独立定义口径，再查看参考答案</li>' +
          '<li>口语录音后一定要回听，注意停顿和语调</li>' +
          '<li>测验前不要复习答案，测真实水平</li>' +
        '</ul>' +
      '</div>' +
    '</div>';

    return html;
  }

  function afterRender() {
    var data = AppStorage.getAll();
    var currentDay = AppStorage.getCurrentDay();
    var p = data.dailyProgress[currentDay] || {};
    var elapsed = p.timerElapsed || 0;
    timerElapsed = elapsed;
    updateTimerDisplay();
  }

  function toggleTimer() {
    var btn = document.getElementById('timerStartBtn');
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
      if (btn) btn.textContent = '继续计时';
      saveTimerElapsed();
    } else {
      timerRunning = true;
      if (btn) btn.textContent = '暂停';
      timerInterval = setInterval(function () {
        timerElapsed++;
        updateTimerDisplay();
        if (timerElapsed % 30 === 0) saveTimerElapsed();
      }, 1000);
    }
  }

  function resetTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    }
    timerElapsed = 0;
    updateTimerDisplay();
    saveTimerElapsed();
    var btn = document.getElementById('timerStartBtn');
    if (btn) btn.textContent = '开始计时';
  }

  function updateTimerDisplay() {
    var el = document.getElementById('todayTimerDisplay');
    var fill = document.getElementById('timerProgressFill');
    var label = document.getElementById('timerProgressLabel');
    var minutes = Math.floor(timerElapsed / 60);
    var seconds = timerElapsed % 60;
    var str = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    if (el) el.textContent = str;
    var pct = Math.min((timerElapsed / 14400) * 100, 100);
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = minutes + ' / 240 分钟';
  }

  function saveTimerElapsed() {
    var data = AppStorage.getAll();
    var currentDay = AppStorage.getCurrentDay();
    if (!data.dailyProgress[currentDay]) data.dailyProgress[currentDay] = { date: new Date().toISOString().split('T')[0] };
    data.dailyProgress[currentDay].timerElapsed = timerElapsed;
    AppStorage.saveAll(data);
  }

  return {
    render: render,
    afterRender: afterRender,
    toggleTimer: toggleTimer,
    resetTimer: resetTimer
  };
})();
