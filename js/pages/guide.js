var PageGuide = (function () {

  function render() {
    return '<div class="page-guide">' +
      '<h2 class="page-title">使用说明</h2>' +
      '<p class="guide-intro">欢迎使用脉动 Brand Manager 英语面试训练系统。请先完成以下初始设置，再开始学习。</p>' +

      section('🚀 第一步：设置学习开始日期',
        '<p>系统会根据你设置的开始日期自动计算当前学习天数（Day 1–14）。</p>' +
        '<div class="guide-date-row">' +
          '<label class="guide-date-label">学习开始日期：</label>' +
          '<input type="date" id="guideDateInput" class="guide-date-input" value="' + getStartDate() + '">' +
          '<button class="btn btn-primary btn-sm" onclick="PageGuide.saveStartDate()">保存</button>' +
        '</div>' +
        '<p class="guide-hint">提示：通常设置为今天，系统会自动进入 Day 1。</p>'
      ) +

      section('📅 第二步：了解14天课程结构',
        '<p>本训练系统共 14 天，每天 240 分钟，包含以下模块：</p>' +
        '<div class="guide-modules">' +
          guideModule('🎧', '听力训练', '90分钟', '精听 → 跟读 → 理解练习，配合TTS语音播放') +
          guideModule('✍️', '写作训练', '80分钟', '商务邮件模板学习 → 改写练习 → 结构评分') +
          guideModule('🎙️', '口语训练', '50分钟', '汇报提纲 → 浏览器录音 → 自评打分') +
          guideModule('📝', '每日测验', '20分钟', '选择题 + 填空题 + 改错题混合测验') +
        '</div>'
      ) +

      section('🗺️ 第三步：如何使用导航',
        '<ul class="guide-list">' +
          '<li><strong>课程总览</strong>：浏览全部14天的内容摘要，点击任意天可直接进入训练</li>' +
          '<li><strong>今日训练</strong>：查看当天的训练计划，按模块顺序完成练习</li>' +
          '<li><strong>听力 / 写作 / 口语 / 测验</strong>：直接进入对应训练模块</li>' +
          '<li><strong>进度看板</strong>：查看得分趋势、连续学习天数和薄弱词汇</li>' +
          '<li><strong>我的素材</strong>：添加你自己的案例素材和方法论要点</li>' +
          '<li><strong>顶部天数切换器</strong>：可自由浏览任意天的内容，不影响真实进度</li>' +
        '</ul>'
      ) +

      section('💡 第四步：学习建议',
        '<ul class="guide-list">' +
          '<li>每天按<strong>听力 → 写作 → 口语 → 测验</strong>的顺序完成，趁注意力最集中时做听力</li>' +
          '<li>听力训练时先不看原文，完成听写后再对照原文</li>' +
          '<li>写作练习时先独立完成，再点击"查看参考范文"对照</li>' +
          '<li>口语录音后一定要回听，注意停顿和关键词覆盖</li>' +
          '<li>每天完成测验并点击"保存得分"，进度才会计入看板</li>' +
        '</ul>'
      ) +

      section('💾 数据说明',
        '<ul class="guide-list">' +
          '<li>所有学习进度保存在<strong>本机浏览器</strong>中，清除浏览器缓存会丢失数据</li>' +
          '<li>建议定期在「设置」页面导出 JSON 备份</li>' +
          '<li>换设备使用时，导入之前的 JSON 备份文件即可恢复进度</li>' +
          '<li>每位用户的数据完全独立，不会互相影响</li>' +
        '</ul>'
      ) +

      '<div class="guide-start-btn-wrap">' +
        '<button class="btn btn-primary btn-large" onclick="App.navigate(\'overview\')">📅 查看课程总览，开始学习 →</button>' +
      '</div>' +
    '</div>';
  }

  function section(title, content) {
    return '<div class="guide-section">' +
      '<div class="guide-section-title">' + title + '</div>' +
      '<div class="guide-section-body">' + content + '</div>' +
    '</div>';
  }

  function guideModule(icon, label, duration, desc) {
    return '<div class="guide-module-item">' +
      '<div class="guide-module-icon">' + icon + '</div>' +
      '<div class="guide-module-body">' +
        '<div class="guide-module-label">' + label + ' <span class="guide-module-duration">' + duration + '</span></div>' +
        '<div class="guide-module-desc">' + desc + '</div>' +
      '</div>' +
    '</div>';
  }

  function getStartDate() {
    var data = AppStorage.getAll();
    return (data && data.settings && data.settings.startDate) || new Date().toISOString().split('T')[0];
  }

  function saveStartDate() {
    var input = document.getElementById('guideDateInput');
    if (!input || !input.value) { App.showToast('请选择日期', 'warning'); return; }
    AppStorage.set('settings.startDate', input.value);
    AppStorage.clearViewDay();
    App.showToast('开始日期已保存，当前学习天数已更新', 'success');
    // 刷新侧边栏天数显示
    var appEl = document.getElementById('app-content');
    if (appEl) appEl.innerHTML = render();
  }

  return {
    render: render,
    saveStartDate: saveStartDate
  };
})();
