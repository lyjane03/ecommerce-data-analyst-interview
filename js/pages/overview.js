var PageOverview = (function () {
  var state = {
    viewMode: 'grid',   // 'grid' | 'list'
    filter: 'all'       // 'all' | 'done' | 'partial' | 'none'
  };

  function getDayStatus(day, progress) {
    var p = progress[day] || {};
    var modules = ['listening', 'writing', 'speaking', 'quiz'];
    var completed = modules.filter(function (m) { return p[m] && p[m].completed; }).length;
    if (completed === 4) return 'done';
    if (completed > 0) return 'partial';
    return 'none';
  }

  function getCompletedCount(day, progress) {
    var p = progress[day] || {};
    var modules = ['listening', 'writing', 'speaking', 'quiz'];
    return modules.filter(function (m) { return p[m] && p[m].completed; }).length;
  }

  function getQuizSummary(dayContent) {
    if (!dayContent || !dayContent.quiz || !dayContent.quiz.questions) return '综合测验';
    var qs = dayContent.quiz.questions;
    var types = {};
    qs.forEach(function (q) {
      var label = q.type === 'mcq' ? '选择' : q.type === 'fillblank' ? '填空' : '改错';
      types[label] = (types[label] || 0) + 1;
    });
    var parts = Object.keys(types).map(function (t) { return types[t] + '道' + t; });
    return qs.length + '题：' + parts.join(' / ');
  }

  function render() {
    var data = AppStorage.getAll();
    var progress = (data && data.dailyProgress) || {};
    var realDay = AppStorage.getRealCurrentDay();

    var days = AppContent.days;

    var filteredDays = days.filter(function (d) {
      var status = getDayStatus(d.day, progress);
      if (state.filter === 'all') return true;
      if (state.filter === 'done') return status === 'done';
      if (state.filter === 'partial') return status === 'partial';
      if (state.filter === 'none') return status === 'none';
      return true;
    });

    return '<div class="page-overview">' +
      '<div class="overview-header">' +
        '<div>' +
          '<h2 class="page-title">课程总览</h2>' +
          '<p class="overview-subtitle">14天完整训练计划 · 点击任意天卡片可直接进入训练</p>' +
        '</div>' +
        '<div class="overview-controls">' +
          '<div class="view-toggle">' +
            '<button class="view-btn' + (state.viewMode === 'grid' ? ' active' : '') + '" onclick="PageOverview.setView(\'grid\')" title="网格视图">▦</button>' +
            '<button class="view-btn' + (state.viewMode === 'list' ? ' active' : '') + '" onclick="PageOverview.setView(\'list\')" title="列表视图">☰</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="overview-filter-bar">' +
        filterBtn('all', '全部', progress, days) +
        filterBtn('done', '已完成', progress, days) +
        filterBtn('partial', '进行中', progress, days) +
        filterBtn('none', '未开始', progress, days) +
      '</div>' +

      '<div class="overview-stats">' +
        renderStats(days, progress, realDay) +
      '</div>' +

      (filteredDays.length === 0 ?
        '<div class="overview-empty">当前筛选条件下没有匹配的天数</div>' :
        '<div class="overview-cards ' + state.viewMode + '-mode">' +
          filteredDays.map(function (d) {
            return renderDayCard(d, progress, realDay);
          }).join('') +
        '</div>'
      ) +
    '</div>';
  }

  function filterBtn(id, label, progress, days) {
    var count = days.filter(function (d) {
      var status = getDayStatus(d.day, progress);
      if (id === 'all') return true;
      return status === id;
    }).length;
    return '<button class="filter-btn' + (state.filter === id ? ' active' : '') + '" onclick="PageOverview.setFilter(\'' + id + '\')">' +
      label + ' <span class="filter-count">' + count + '</span>' +
    '</button>';
  }

  function renderStats(days, progress, realDay) {
    var done = days.filter(function (d) { return getDayStatus(d.day, progress) === 'done'; }).length;
    var partial = days.filter(function (d) { return getDayStatus(d.day, progress) === 'partial'; }).length;
    var pct = Math.round((done / 14) * 100);
    return '<div class="overview-stat-row">' +
      '<div class="overview-stat">' +
        '<div class="stat-num">' + done + '</div>' +
        '<div class="stat-lbl">天已完成</div>' +
      '</div>' +
      '<div class="overview-stat">' +
        '<div class="stat-num">' + partial + '</div>' +
        '<div class="stat-lbl">天进行中</div>' +
      '</div>' +
      '<div class="overview-stat">' +
        '<div class="stat-num">' + realDay + '</div>' +
        '<div class="stat-lbl">今日 Day</div>' +
      '</div>' +
      '<div class="overview-stat overview-stat-progress">' +
        '<div class="overview-progress-bar"><div class="overview-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="stat-lbl">' + pct + '% 整体完成率</div>' +
      '</div>' +
    '</div>';
  }

  function renderDayCard(d, progress, realDay) {
    var status = getDayStatus(d.day, progress);
    var completedCount = getCompletedCount(d.day, progress);
    var isToday = d.day === realDay;

    var statusClass = 'status-' + status;
    var todayClass = isToday ? ' today-card' : '';

    var statusBadge = '';
    if (status === 'done') statusBadge = '<span class="ov-badge badge-done">✓ 已完成</span>';
    else if (status === 'partial') statusBadge = '<span class="ov-badge badge-partial">' + completedCount + '/4 模块</span>';
    else statusBadge = '<span class="ov-badge badge-none">未开始</span>';

    var todayBadge = isToday ? '<span class="ov-badge badge-today">📍 今天</span>' : '';

    return '<div class="ov-card ' + statusClass + todayClass + '">' +
      '<div class="ov-card-head">' +
        '<div class="ov-day-num">Day ' + d.day + '</div>' +
        '<div class="ov-badges">' + todayBadge + statusBadge + '</div>' +
      '</div>' +
      '<div class="ov-theme-zh">' + d.themeZh + '</div>' +
      '<div class="ov-theme-en">' + d.theme + '</div>' +
      '<div class="ov-modules">' +
        renderModule('🎧', '听力训练', d.listening ? d.listening.title : '—', progress[d.day] && progress[d.day].listening) +
        renderModule('✍️', '案例分析', d.writing ? d.writing.title : '—', progress[d.day] && progress[d.day].writing) +
        renderModule('🎙️', '口语训练', d.speaking ? d.speaking.title : '—', progress[d.day] && progress[d.day].speaking) +
        renderModule('📝', '每日测验', getQuizSummary(d), progress[d.day] && progress[d.day].quiz) +
      '</div>' +
      '<button class="btn btn-primary ov-enter-btn" onclick="PageOverview.enterDay(' + d.day + ')">' +
        (isToday ? '进入今日训练' : '进入 Day ' + d.day + ' 训练') +
      '</button>' +
    '</div>';
  }

  function renderModule(icon, label, summary, moduleProgress) {
    var done = moduleProgress && moduleProgress.completed;
    var score = moduleProgress && moduleProgress.score != null ? moduleProgress.score : null;
    return '<div class="ov-module' + (done ? ' ov-module-done' : '') + '">' +
      '<span class="ov-mod-icon">' + icon + '</span>' +
      '<div class="ov-mod-body">' +
        '<div class="ov-mod-label">' + label + (done ? ' <span class="ov-mod-check">✓</span>' : '') + (score !== null ? ' <span class="ov-mod-score">' + score + '分</span>' : '') + '</div>' +
        '<div class="ov-mod-summary">' + summary + '</div>' +
      '</div>' +
    '</div>';
  }

  function setView(mode) {
    state.viewMode = mode;
    var el = document.getElementById('app-content');
    if (el) el.innerHTML = render();
  }

  function setFilter(filter) {
    state.filter = filter;
    var el = document.getElementById('app-content');
    if (el) el.innerHTML = render();
  }

  function enterDay(day) {
    App.switchDay(day);
    App.navigate('today');
  }

  return {
    render: render,
    setView: setView,
    setFilter: setFilter,
    enterDay: enterDay
  };
})();
