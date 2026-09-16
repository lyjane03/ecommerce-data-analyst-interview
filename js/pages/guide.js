var PageGuide = (function () {
  function render() {
    return '<div class="page-guide">' +
      '<h2 class="page-title">使用说明</h2>' +
      '<p class="guide-intro"><strong>第一次使用，只需按下面四步完成设置并开始训练。</strong><span>AI 评分是可选功能，不影响课程的基本使用。</span></p>' +
      '<div class="guide-flow" aria-label="使用流程">' +
        flowStep('1', '看课程大纲', '了解学什么') +
        flowStep('2', '设置日期', '确定 Day 1') +
        flowStep('3', '完成训练', '每天四个模块') +
        flowStep('4', '查看复盘', '跟踪进步') +
      '</div>' +

      section('🧭 第一步：先看课程大纲',
        '<p>先花几分钟了解 14 天的学习路径、每天的主题，以及完成课程后应具备的能力。你不需要现在记住所有知识点，只要知道课程会如何从基础推进到完整模拟面试。</p>' +
        '<div class="guide-action-row"><button class="btn btn-primary btn-sm" onclick="App.navigate(\'outline\')">打开课程大纲 →</button><span>浏览大纲不会改变学习进度。</span></div>') +

      section('📅 第二步：设置学习开始日期',
        '<p>系统会根据开始日期自动计算今天对应 Day 1–14 中的哪一天。</p>' +
        '<div class="guide-date-row"><label class="guide-date-label">学习开始日期：</label><input type="date" id="guideDateInput" class="guide-date-input" value="' + getStartDate() + '"><button class="btn btn-primary btn-sm" onclick="PageGuide.saveStartDate()">保存日期</button></div>' +
        '<p class="guide-hint">顶部的 Day 切换器可以预览任意一天；预览不会改写真实日期或完成记录。</p>') +

      section('🗓️ 第三步：完成当天训练',
        '<p>每天从「今日训练」进入，建议按下面顺序完成四个模块。四个模块围绕同一个电商分析主题，形成输入 → 分析 → 表达 → 检查的闭环。</p>' +
        '<div class="guide-modules">' +
          guideModule('🎧', '听力训练', '90 分钟', '精听 → 跟读 → 听力理解，熟悉真实分析沟通语境') +
          guideModule('✍️', '案例分析', '80 分钟', '阅读数据情境 → 独立写结论 → 五维自评') +
          guideModule('🎙️', '口语训练', '50 分钟', '准备提纲 → 录音回答 → 回听与自评') +
          guideModule('📝', '每日测验', '20 分钟', '完成综合题 → 查看解析 → 回顾错题') +
        '</div>' +
        '<div class="guide-action-row"><button class="btn btn-primary btn-sm" onclick="App.navigate(\'today\')">进入今日训练 →</button><span>完成状态、得分和错题会自动保存在本机。</span></div>') +

      section('📊 第四步：训练结束后查看复盘',
        '<p>完成当天训练后，根据需要打开下面两个页面：</p>' +
        '<div class="guide-destination-grid">' +
          destination('📈', '学习进度', '查看每天的完成状态、模块得分、能力趋势和当前薄弱点。', 'overview') +
          destination('📁', '我的素材', '保存自己的项目案例、分析框架和常用英文表达。', 'custom') +
        '</div>') +

      section('🤖 可选功能：AI 评分与录音转写',
        '<div class="guide-notice"><strong>不配置 AI 也能完成整套课程。</strong><span>案例练习、录音回放、测验和人工自评都可以直接使用。</span></div>' +
        '<ul class="guide-list"><li>只有页面显示“AI 服务已就绪”时，AI 评分和口语转写按钮才可用。</li><li>案例答案只会在你主动点击 AI 评分后发送；口语录音只会在你点击“转写并由 AI 评分”后发送。</li><li>口语 AI 根据 transcript 评估内容、结构和英文清晰度，不评估发音、口音、语调或自信度。</li><li>AI 服务未连接或调用失败时，继续使用人工自评即可，不会影响进度记录。</li></ul>') +

      section('🔒 使用环境、数据与备份',
        '<ul class="guide-list"><li>学习进度和已采用的评分结果保存在当前浏览器中；更换浏览器或清理缓存前，请先到「设置」导出 JSON 备份。</li><li>录音建议使用 Chrome 或 Edge，并允许网页访问麦克风。</li><li>通过 GitHub Pages 打开时，课程、测验、录音回放和人工自评可用；AI 功能仍需要后台服务。</li><li>课程中的公司、金额、订单量和实验结果均为 synthetic / 模拟数据。</li></ul>') +

      '<div class="guide-start-btn-wrap"><button class="btn btn-primary btn-large" onclick="App.navigate(\'outline\')">🧭 从课程大纲开始 →</button></div>' +
    '</div>';
  }
  function section(title, content) { return '<div class="guide-section"><div class="guide-section-title">' + title + '</div><div class="guide-section-body">' + content + '</div></div>'; }
  function guideModule(icon, label, duration, desc) { return '<div class="guide-module-item"><div class="guide-module-icon">' + icon + '</div><div class="guide-module-body"><div class="guide-module-label">' + label + ' <span class="guide-module-duration">' + duration + '</span></div><div class="guide-module-desc">' + desc + '</div></div></div>'; }
  function flowStep(number, label, desc) { return '<div class="guide-flow-step"><span class="guide-flow-number">' + number + '</span><div><strong>' + label + '</strong><small>' + desc + '</small></div></div>'; }
  function destination(icon, title, desc, page) { return '<button class="guide-destination" onclick="App.navigate(\'' + page + '\')"><span class="guide-destination-icon">' + icon + '</span><span><strong>' + title + '</strong><small>' + desc + '</small></span><span class="guide-destination-arrow">→</span></button>'; }
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
