var PageGuide = (function () {
  function render() {
    return '<div class="page-guide">' +
      '<h2 class="page-title">使用说明</h2>' +
      '<p class="guide-intro">欢迎使用 E-commerce Data Analyst 英语面试训练。课程把电商分析方法、英文表达和面试决策放在同一条训练路径里。</p>' +
      section('🚀 第一步：设置学习开始日期',
        '<p>系统按开始日期自动计算当前学习天数（Day 1–14）。你可以在顶部切换器浏览任意一天，浏览模式不会改写真实进度。</p>' +
        '<div class="guide-date-row"><label class="guide-date-label">学习开始日期：</label><input type="date" id="guideDateInput" class="guide-date-input" value="' + getStartDate() + '"><button class="btn btn-primary btn-sm" onclick="PageGuide.saveStartDate()">保存</button></div>' +
        '<p class="guide-hint">建议设置为开始系统学习的日期，进度会在当天从 Day 1 开始。</p>') +
      section('📅 第二步：了解 14 天课程结构',
        '<p>每天 240 分钟，四个模块围绕同一个电商分析主题：</p>' +
        '<div class="guide-modules">' +
          guideModule('🎧', '听力训练', '90 分钟', '精听 → 跟读 → 听力理解，熟悉真实分析沟通语境') +
          guideModule('✍️', '案例分析', '80 分钟', '阅读模拟数据情境 → 写分析结论 → 可选 AI 评分或五维自评') +
          guideModule('🎙️', '口语训练', '50 分钟', '分析提纲 → 浏览器录音 → 可选转写与内容评分 → 自评') +
          guideModule('📝', '每日测验', '20 分钟', '指标、SQL、漏斗、实验和数据质量混合题') +
        '</div>') +
      section('🗺️ 第三步：推荐学习顺序',
        '<ul class="guide-list"><li><strong>课程总览</strong>：先看 14 天能力地图，点击任意天开始。</li><li><strong>今日训练</strong>：按听力 → 案例分析 → 口语 → 测验完成当天闭环。</li><li><strong>案例分析</strong>：先定义 grain、口径和限制，再写方法与建议。</li><li><strong>进度看板</strong>：查看模块得分、连续学习天数和错题记录。</li><li><strong>我的素材</strong>：保存自己的项目案例、分析框架和英文表达。</li></ul>') +
      section('💡 面试分析习惯',
        '<ul class="guide-list"><li>先确认业务目标与指标分母，再开始计算。</li><li>解释 SQL 时先说每张表的 grain，再说 join 和去重。</li><li>实验结论同时说明效果量、不确定性、SRM 和 guardrail。</li><li>汇报遵循结论 → 证据 → 风险 → 建议 → 下一步。</li></ul>') +
      section('💾 数据说明',
        '<ul class="guide-list"><li>学习进度和 AI 评分结果保存在本机浏览器；只有主动点击 AI 按钮后，案例答案才会发送给 DeepSeek，口语录音才会发送给 GLM 转写并由 DeepSeek 评分。</li><li>AI 评分未配置、网络失败或不愿发送内容时，人工自评仍可用。</li><li>口语 AI 只根据 transcript 评估内容，不是发音、口音、语调或自信度测评。</li><li>导出备份包含应用身份和版本号，其他版本的文件会被拒绝导入。</li><li>页面中的业务公司、金额、订单量和实验结果均为 synthetic / 模拟数据。</li><li>建议在完成重要练习后到「设置」导出 JSON 备份。</li></ul>') +
      '<div class="guide-start-btn-wrap"><button class="btn btn-primary btn-large" onclick="App.navigate(\'overview\')">📅 查看课程总览，开始学习 →</button></div>' +
    '</div>';
  }
  function section(title, content) { return '<div class="guide-section"><div class="guide-section-title">' + title + '</div><div class="guide-section-body">' + content + '</div></div>'; }
  function guideModule(icon, label, duration, desc) { return '<div class="guide-module-item"><div class="guide-module-icon">' + icon + '</div><div class="guide-module-body"><div class="guide-module-label">' + label + ' <span class="guide-module-duration">' + duration + '</span></div><div class="guide-module-desc">' + desc + '</div></div></div>'; }
  function getStartDate() { var data = AppStorage.getAll(); return data && data.settings ? data.settings.startDate : new Date().toISOString().split('T')[0]; }
  function saveStartDate() {
    var input = document.getElementById('guideDateInput');
    if (!input || !input.value) { App.showToast('请选择日期', 'warning'); return; }
    AppStorage.set('settings.startDate', input.value); AppStorage.clearViewDay();
    App.showToast('开始日期已保存，当前学习天数已更新', 'success');
    var appEl = document.getElementById('app-content'); if (appEl) appEl.innerHTML = render();
  }
  return { render: render, saveStartDate: saveStartDate };
})();
