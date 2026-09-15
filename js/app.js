var App = (function () {
  var currentPage = 'dashboard';
  var pages = {
    guide:     { label: '使用说明', icon: '📖', module: 'PageGuide' },
    overview:  { label: '课程总览', icon: '📅', module: 'PageOverview' },
    dashboard: { label: '进度看板', icon: '📊', module: 'PageDashboard' },
    today:     { label: '今日训练', icon: '🗓️', module: 'PageToday' },
    listening: { label: '听力训练', icon: '🎧', module: 'PageListening' },
    writing:   { label: '写作训练', icon: '✍️', module: 'PageWriting' },
    speaking:  { label: '口语训练', icon: '🎙️', module: 'PageSpeaking' },
    quiz:      { label: '每日测验', icon: '📝', module: 'PageQuiz' },
    custom:    { label: '我的素材', icon: '📁', module: 'PageCustom' },
    settings:  { label: '设置',     icon: '⚙️', module: 'PageSettings' }
  };

  function init() {
    AppStorage.init();
    renderSidebar();
    renderTopbar();
    navigate('guide');
    window.addEventListener('resize', onResize);
  }

  function renderSidebar() {
    var data = AppStorage.getAll();
    var currentDay = AppStorage.getCurrentDay();
    var progress = data.dailyProgress || {};

    function navItem(id, extraDot) {
      var p = pages[id];
      return '<button class="nav-item ' + (currentPage === id ? 'active' : '') + '" onclick="App.navigate(\'' + id + '\')">' +
        '<span class="nav-icon">' + p.icon + '</span>' +
        '<span>' + p.label + '</span>' +
        (extraDot ? '<span class="nav-done-dot"></span>' : '') +
      '</button>';
    }

    var dayProgress = progress[currentDay] || {};
    var navHTML = '';

    // 入门区
    navHTML += '<div class="nav-section-label">入门</div>';
    navHTML += navItem('guide');
    navHTML += navItem('overview');

    // 训练区
    navHTML += '<div class="nav-section-label" style="margin-top:.4rem">训练模块</div>';
    ['today', 'listening', 'writing', 'speaking', 'quiz'].forEach(function (id) {
      var done = dayProgress[id] && dayProgress[id].completed;
      navHTML += navItem(id, done);
    });

    // 其他区
    navHTML += '<div class="nav-section-label" style="margin-top:.4rem">其他</div>';
    ['dashboard', 'custom', 'settings'].forEach(function (id) {
      navHTML += navItem(id);
    });

    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.innerHTML =
      '<div class="sidebar-brand">' +
        '<div class="brand-title">🎯 脉动品牌经理<br>英语面试训练</div>' +
        '<div class="brand-sub">Danone Mizone · Brand Manager</div>' +
      '</div>' +
      '<div class="sidebar-day-badge">Day ' + currentDay + ' / 14 · 🔥 ' + data.streakDays + ' 天连续</div>' +
      '<nav class="sidebar-nav">' + navHTML + '</nav>' +
      '<div class="sidebar-footer">本地离线应用 · 数据仅存于本机</div>';
  }

  function renderTopbar() {
    var data = AppStorage.getAll();
    var currentDay = AppStorage.getCurrentDay();
    var realDay = AppStorage.getRealCurrentDay();
    var isOverride = AppStorage.getViewDay() !== null;
    var topbar = document.getElementById('topbar');
    if (!topbar) return;
    var pageInfo = pages[currentPage] || { label: '', icon: '' };

    var dayOptions = '';
    for (var d = 1; d <= 14; d++) {
      dayOptions += '<option value="' + d + '"' + (d === currentDay ? ' selected' : '') + '>Day ' + d + '</option>';
    }

    topbar.innerHTML =
      '<div class="topbar-title">' + pageInfo.icon + ' ' + pageInfo.label + '</div>' +
      '<div class="topbar-right">' +
        '<span class="streak-badge">🔥 ' + data.streakDays + ' 天连续</span>' +
        '<div class="day-switcher">' +
          '<button class="day-switch-btn" onclick="App.switchDay(' + (currentDay - 1) + ')" ' + (currentDay <= 1 ? 'disabled' : '') + '>‹</button>' +
          '<div class="day-switch-center">' +
            '<select class="day-select" onchange="App.switchDay(this.value)">' + dayOptions + '</select>' +
            (isOverride ? '<div class="day-override-tip">浏览模式（真实进度：Day ' + realDay + '）</div>' : '') +
          '</div>' +
          '<button class="day-switch-btn" onclick="App.switchDay(' + (currentDay + 1) + ')" ' + (currentDay >= 14 ? 'disabled' : '') + '>›</button>' +
          (isOverride ? '<button class="day-reset-btn" onclick="App.resetDay()" title="回到今天">↩ 今天</button>' : '') +
        '</div>' +
      '</div>';
  }

  function navigate(pageId) {
    if (!pages[pageId]) pageId = 'dashboard';

    var prevModule = pages[currentPage] ? window[pages[currentPage].module] : null;
    if (prevModule && prevModule.onLeave) prevModule.onLeave();

    currentPage = pageId;

    renderSidebar();
    renderTopbar();

    var module = window[pages[pageId].module];
    if (!module) {
      document.getElementById('app-content').innerHTML = '<p style="color:red">页面模块未加载：' + pages[pageId].module + '</p>';
      return;
    }

    var html = module.render();
    document.getElementById('app-content').innerHTML = html;

    if (module.afterRender) {
      setTimeout(function () { module.afterRender(); }, 50);
    }

    window.scrollTo(0, 0);
  }

  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 3000);
  }

  function switchDay(day) {
    var d = parseInt(day, 10);
    if (isNaN(d) || d < 1 || d > 14) return;
    var realDay = AppStorage.getRealCurrentDay();
    if (d === realDay) {
      AppStorage.clearViewDay();
    } else {
      AppStorage.setViewDay(d);
    }
    renderSidebar();
    renderTopbar();
    // 重新渲染当前页面内容（听力/写作/口语/测验 都要刷新）
    var module = window[pages[currentPage].module];
    if (module && module.render) {
      document.getElementById('app-content').innerHTML = module.render();
      if (module.afterRender) setTimeout(function () { module.afterRender(); }, 50);
    }
    var label = AppStorage.getViewDay() !== null ? ('已切换至 Day ' + d) : '已回到今天 Day ' + realDay;
    showToast(label, 'success');
  }

  function resetDay() {
    AppStorage.clearViewDay();
    renderSidebar();
    renderTopbar();
    var module = window[pages[currentPage].module];
    if (module && module.render) {
      document.getElementById('app-content').innerHTML = module.render();
      if (module.afterRender) setTimeout(function () { module.afterRender(); }, 50);
    }
    showToast('已回到今天 Day ' + AppStorage.getRealCurrentDay(), 'success');
  }

  function onResize() {
    if (window.innerWidth > 900) {
      var sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  }

  return {
    init: init,
    navigate: navigate,
    switchDay: switchDay,
    resetDay: resetDay,
    showToast: showToast
  };
})();

document.addEventListener('DOMContentLoaded', function () {
  App.init();
});
