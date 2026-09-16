var PageOutline = (function () {
  var stages = [
    {
      number: '01',
      days: 'Day 1–3',
      title: '建立业务与指标底座',
      desc: '先学会把业务问题、数据粒度和指标口径说清楚。',
      result: '能从业务目标出发搭建 KPI tree，并避免最常见的口径混淆。',
      color: 'blue'
    },
    {
      number: '02',
      days: 'Day 4–6',
      title: '读懂增长与客户行为',
      desc: '从漏斗、渠道、归因走到 cohort、留存与 LTV。',
      result: '能定位转化损失，解释渠道效率，并把复购问题连接到客户生命周期。',
      color: 'purple'
    },
    {
      number: '03',
      days: 'Day 7–10',
      title: '做出可靠的分析判断',
      desc: '覆盖实验、商品、库存、履约与高级 SQL。',
      result: '能验证假设、识别供给约束，并用可复用的 SQL 方法支持决策。',
      color: 'orange'
    },
    {
      number: '04',
      days: 'Day 11–14',
      title: '把分析讲成面试答案',
      desc: '训练看板叙事、数据质量、异常诊断，最后完成完整模拟面试。',
      result: '能用结论 → 证据 → 限制 → 建议 → 下一步的结构，完成 5 分钟英文 case。',
      color: 'green'
    }
  ];

  var dayOutcomes = {
    1: { focus: '岗位叙事、北极星指标与 KPI tree' },
    2: { focus: '订单、商品、客户的 grain、主键与 join 基数' },
    3: { focus: 'GMV、NMV、Revenue、AOV、UPT 的定义与关系' },
    4: { focus: 'view → cart → checkout → purchase 漏斗' },
    5: { focus: '获客、归因、CAC、ROAS、ACOS 与利润约束' },
    6: { focus: 'cohort、留存、复购与 LTV' },
    7: { focus: 'A/B 测试、随机化、样本量、SRM 与 guardrail' },
    8: { focus: '商品、搜索、品类、价格与促销' },
    9: { focus: '库存、缺货、履约、取消与退货' },
    10: { focus: '窗口函数、滚动指标、Top-N、去重与 NULL' },
    11: { focus: '看板、业务叙事与跨部门沟通' },
    12: { focus: '埋点、口径、时区、币种与数据质量' },
    13: { focus: '收入下滑与大促异常的系统化排查' },
    14: { focus: '完整模拟面试：SQL、case、实验与高管汇报' }
  };

  function render() {
    var days = AppContent.days || [];
    return '<div class="page-outline">' +
      '<section class="outline-hero">' +
        '<div class="outline-hero-copy">' +
          '<div class="outline-eyebrow">14-DAY LEARNING PATH</div>' +
          '<h2 class="outline-hero-title">从理解业务，到用英语说清楚数据</h2>' +
          '<p class="outline-hero-desc">这是一套面向 E-commerce Data Analyst 面试的 14 天训练路径。你会围绕真实面试中的业务问题，逐步练习口径、SQL、判断和英文表达。</p>' +
          '<div class="outline-meta">' +
            outlineMeta('14 天', '循序渐进') +
            outlineMeta('240 分钟/天', '四个训练模块') +
            outlineMeta('Day 14', '完整模拟面试') +
          '</div>' +
          '<div class="outline-hero-actions">' +
            '<button class="btn btn-primary btn-large" onclick="PageOutline.startCourse()">开始当前学习日 →</button>' +
            '<button class="btn btn-secondary btn-large" onclick="App.navigate(\'overview\')">查看学习进度</button>' +
          '</div>' +
        '</div>' +
        '<div class="outline-hero-visual" aria-hidden="true">' +
          '<div class="outline-hero-number">14</div>' +
          '<div class="outline-hero-number-label">days to interview-ready thinking</div>' +
          '<div class="outline-hero-route"><span></span><span></span><span></span><span></span></div>' +
        '</div>' +
      '</section>' +

      '<section class="outline-block outline-results">' +
        sectionHeading('学完之后', '你将取得什么成果？', '完成 14 天训练后，你将能够独立分析常见的电商业务问题，并在面试中用英语清楚地说明自己的思路和建议。') +
        '<div class="outline-result-grid">' +
          resultCard('01', '清楚定义业务问题', '面对业务问题时，你能够先明确业务目标、关键指标、统计口径和沟通对象，再选择合适的分析方法。') +
          resultCard('02', '得出可信的分析结论', '你能够检查数据粒度和指标口径，找到转化漏斗中的关键问题，并识别实验设计或数据质量带来的风险。') +
          resultCard('03', '提出可落地的行动建议', '你能够根据分析证据提出有优先级的建议，并说明由谁负责、何时完成，以及如何验证效果。') +
          resultCard('04', '用英语完整表达分析思路', '你能够用结构清晰的英语完成自我介绍、业务案例分析、SQL 思路讲解和面向管理层的汇报。') +
        '</div>' +
      '</section>' +

      '<section class="outline-block">' +
        sectionHeading('每天怎么学', '四个模块，形成一个完整闭环', '每天围绕同一个主题训练：先输入，再分析，再表达，最后用测验检查掌握程度。') +
        '<div class="outline-module-grid">' +
          moduleCard('🎧', '听力训练', '90 分钟', '精听 → 跟读 → 理解练习', '听懂真实分析沟通中的指标、判断和行动表达。', '留下关键词、句型和听力理解结果。', 'blue') +
          moduleCard('✍️', '案例分析', '80 分钟', '阅读数据情境 → 英文作答 → 五维自评', '把业务问题写成结论、证据、限制与建议。', '完成一份可交付的英文 case readout。', 'purple') +
          moduleCard('🎙️', '口语训练', '50 分钟', '提纲准备 → 录音 → 回听与自评', '在限时内组织观点，并说出自然、专业的英文。', '完成一段带结构的面试回答。', 'orange') +
          moduleCard('📝', '每日测验', '20 分钟', '综合测验 → 错题回顾', '检查指标、SQL、漏斗、实验和数据质量概念。', '形成当天的得分与薄弱点记录。', 'green') +
        '</div>' +
      '</section>' +

      '<section class="outline-block">' +
        sectionHeading('学习路径', '四个阶段，从基础到综合面试', '不用一开始就记住所有知识点；沿着这条路径，你会先建立框架，再练判断，最后练速度和表达。') +
        '<div class="outline-stage-grid">' + stages.map(renderStage).join('') + '</div>' +
      '</section>' +

      '<section class="outline-block outline-days-section">' +
        sectionHeading('14 天课程', '每天会学习什么？', '这里展示课程主题和核心能力；学习状态、得分和复习入口统一放在「学习进度」中。') +
        '<div class="outline-syllabus">' +
          '<div class="outline-syllabus-head"><span>天数</span><span>课程主题</span><span>核心能力</span></div>' +
          days.map(renderDay).join('') +
        '</div>' +
      '</section>' +

      '<div class="outline-footer-cta">' +
        '<div><strong>准备好开始了吗？</strong><span>新用户建议从 Day 1 开始；已有进度会保存在本机。</span></div>' +
        '<button class="btn btn-primary" onclick="PageOutline.startCourse()">进入训练 →</button>' +
      '</div>' +
    '</div>';
  }

  function outlineMeta(value, label) {
    return '<div class="outline-meta-item"><strong>' + value + '</strong><span>' + label + '</span></div>';
  }

  function sectionHeading(eyebrow, title, desc) {
    return '<div class="outline-section-heading"><div><div class="outline-section-eyebrow">' + eyebrow + '</div><h3>' + title + '</h3></div><p>' + desc + '</p></div>';
  }

  function resultCard(number, title, desc) {
    return '<div class="outline-result-card"><span class="outline-card-number">' + number + '</span><h4>' + title + '</h4><p>' + desc + '</p></div>';
  }

  function moduleCard(icon, title, duration, flow, ability, output, color) {
    return '<div class="outline-module-card outline-accent-' + color + '">' +
      '<div class="outline-module-top"><span class="outline-module-icon">' + icon + '</span><span class="outline-module-duration">' + duration + '</span></div>' +
      '<h4>' + title + '</h4><div class="outline-module-flow">' + flow + '</div><p>' + ability + '</p>' +
      '<div class="outline-module-output"><span>当天产出</span>' + output + '</div>' +
    '</div>';
  }

  function renderStage(stage) {
    return '<div class="outline-stage-card outline-stage-' + stage.color + '">' +
      '<div class="outline-stage-head"><span class="outline-stage-number">' + stage.number + '</span><span class="outline-stage-days">' + stage.days + '</span></div>' +
      '<h4>' + stage.title + '</h4><p>' + stage.desc + '</p>' +
      '<div class="outline-stage-result"><span>阶段结果</span>' + stage.result + '</div>' +
    '</div>';
  }

  function renderDay(day) {
    var outcome = dayOutcomes[day.day] || { focus: '围绕当天主题完成四个训练模块' };
    return '<div class="outline-syllabus-row">' +
      '<div class="outline-syllabus-day">Day ' + day.day + '</div>' +
      '<div class="outline-syllabus-topic"><strong>' + day.themeZh + '</strong><span>' + day.theme + '</span></div>' +
      '<div class="outline-syllabus-skill">' + outcome.focus + '</div>' +
    '</div>';
  }

  function startCourse() {
    App.navigate('today');
  }

  return { render: render, startCourse: startCourse };
})();
