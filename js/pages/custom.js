var PageCustom = (function () {
  var state = {
    tab: 'cases',
    editingCase: null,
    editingMethod: null,
    translating: false,
    previewData: null,
    previewType: null,
    previewIdx: null,
    pendingCaseForm: null,
    pendingMethodForm: null,
    // speaking practice state
    practiceCase: null,
    practicePhase: 'outline',
    practiceRecording: false,
    practiceAudioUrl: null,
    practiceScores: {},
    practiceSubmitted: false
  };

  var evalDimensions = [
    { id: 'fluency', label: '流利度 Fluency', hint: '语言是否流畅，停顿是否自然' },
    { id: 'vocabulary', label: '词汇丰富度 Vocabulary', hint: '是否使用了专业词汇和多样表达' },
    { id: 'structure', label: '结构清晰度 Structure', hint: '逻辑是否清晰，是否按提纲组织' },
    { id: 'pronunciation', label: '发音准确度 Pronunciation', hint: '关键词发音是否清晰准确' },
    { id: 'confidence', label: '自信度 Confidence', hint: '是否表现出自信和对内容的掌握' }
  ];

  // ===== Render =====

  function render() {
    return '<div class="page-custom">' +
      '<h2 class="page-title">我的素材库</h2>' +
      '<p class="page-desc">添加你的营销案例和方法论，支持中英文输入，系统可自动翻译为英文并生成口语练习。</p>' +
      '<div class="tab-bar">' +
        tabBtn('cases', '📁 我的案例', state.tab) +
        tabBtn('methodologies', '📚 我的方法论', state.tab) +
        tabBtn('speaking', '🎤 口语练习', state.tab) +
      '</div>' +
      '<div id="custom-tab-content">' + renderTab() + '</div>' +
    '</div>';
  }

  function tabBtn(id, label, active) {
    return '<button class="tab-btn' + (active === id ? ' active' : '') +
      '" data-tab="' + id + '" onclick="PageCustom.switchTab(\'' + id + '\')">' + label + '</button>';
  }

  function renderTab() {
    if (state.tab === 'cases') return renderCases();
    if (state.tab === 'methodologies') return renderMethodologies();
    if (state.tab === 'speaking') return renderSpeakingTab();
    return '';
  }

  // ===== Cases Tab =====

  function renderCases() {
    var data = AppStorage.getAll();
    var cases = (data.customContent && data.customContent.cases) || [];

    return '<div class="custom-section">' +
      '<div class="custom-header">' +
        '<div class="custom-hint">添加你的真实营销案例素材，支持中文/英文/中英混合输入。</div>' +
        '<button class="btn btn-primary" onclick="PageCustom.newCase()">+ 新增案例</button>' +
      '</div>' +
      (state.editingCase !== null ? renderCaseForm(cases) : '') +
      (state.previewType === 'case' ? renderTranslatePreview() : '') +
      (cases.length === 0 ?
        '<div class="empty-state">' +
          '<div class="empty-icon">📁</div>' +
          '<div class="empty-text">还没有案例素材</div>' +
          '<div class="empty-hint">点击"新增案例"添加你的第一个营销案例</div>' +
        '</div>' :
        '<div class="cards-grid">' +
          cases.map(function (c, i) { return renderCaseCard(c, i); }).join('') +
        '</div>') +
      '<div class="template-guide">' +
        '<div class="guide-title">💡 案例结构建议（STAR 法则）</div>' +
        '<ul class="guide-list">' +
          '<li><strong>Situation：</strong>市场背景、品牌挑战、时间节点</li>' +
          '<li><strong>Task：</strong>你的具体职责和目标</li>' +
          '<li><strong>Action：</strong>你采取的 3 个关键行动（越具体越好）</li>' +
          '<li><strong>Result：</strong>可量化的成果（% 增长、绝对值、时间节点）</li>' +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  function renderCaseForm(cases) {
    var isNew = state.editingCase === 'new';
    var c = isNew ? {} : cases[state.editingCase] || {};
    var p = state.pendingCaseForm;
    var rawVal = function (field) {
      if (p) return p[field + 'Raw'] || '';
      return c[field + 'Raw'] || c[field] || '';
    };
    var titleVal = p ? p.title : (c.title || '');
    var kwVal = p ? p.keywordsRaw : (isNew ? '' : (c.keywordsRaw || (c.keywords || []).join(', ')));

    return '<div class="edit-form-overlay">' +
      '<div class="edit-form">' +
        '<div class="form-title">' + (isNew ? '新增案例' : '编辑案例') + '</div>' +
        formField('案例名称', 'caseTitle', titleVal, '例如：脉动夏季营销活动案例 2023') +
        formField('一句话场景描述（中文/英文均可）', 'caseScenario', rawVal('scenario'), '例如：2023年Q2针对Z世代消费者的品牌重新定位项目') +
        formTextarea('Situation — 情况背景（中文/英文均可）', 'caseSituation', rawVal('situation'), '描述市场环境、品牌挑战和你的角色...\n例如：脉动在年轻消费群体中的品牌认知度持续下降，连续三年销量走低。') +
        formTextarea('Task — 任务目标（中文/英文均可）', 'caseTask', rawVal('task'), '描述你的具体职责和目标...\n例如：我的目标是扭转品牌下滑趋势，在6个月内实现销量正增长。') +
        formTextarea('Action — 关键行动（中文/英文均可）', 'caseAction', rawVal('action'), '描述你采取的关键行动...\n例如：\n1. 我主导了消费者调研，发现健康意识是关键驱动因素\n2. 我们重新设计了产品包装和传播策略\n3. 我联合数字团队发起了社交媒体营销活动') +
        formTextarea('Result — 成果数据（中文/英文均可）', 'caseResult', rawVal('result'), '描述可量化的成果...\n例如：品牌知名度提升了15%，销量在6个月内增长了23%，市场份额从12%提升到15%。') +
        formField('关键词（中文/英文均可，逗号分隔）', 'caseKeywords', kwVal, '例如：品牌重新定位, 消费者洞察, 数字营销') +
        '<div class="form-actions">' +
          '<button class="btn btn-primary" onclick="PageCustom.saveCase(\'' + (isNew ? 'new' : state.editingCase) + '\')">保存原文</button>' +
          '<button class="btn btn-translate' + (state.translating ? ' loading' : '') + '" onclick="PageCustom.translateAndSaveCase(\'' + (isNew ? 'new' : state.editingCase) + '\')"' +
            (state.translating ? ' disabled' : '') + '>' +
            (state.translating ? '<span class="translating-spinner"></span> 翻译中...' : '🌐 翻译为英文') +
          '</button>' +
          '<button class="btn btn-secondary" onclick="PageCustom.cancelEdit()">取消</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderCaseCard(c, i) {
    var hasEnglish = c.situation && !AppTranslator.hasChinese(c.situation);
    return '<div class="custom-card">' +
      '<div class="card-title">' + (c.title || '（未命名案例）') + '</div>' +
      (c.scenario ? '<div class="card-scenario">' + c.scenario + '</div>' : '') +
      (c.keywords && c.keywords.length > 0 ?
        '<div class="card-tags">' + c.keywords.map(function (k) {
          return '<span class="card-tag">' + k + '</span>';
        }).join('') + '</div>' : '') +
      '<div class="card-date">' + (c.createdAt ? c.createdAt.split('T')[0] : '') + '</div>' +
      '<div class="card-actions">' +
        '<button class="btn btn-secondary btn-sm" onclick="PageCustom.editCase(' + i + ')">编辑</button>' +
        '<button class="btn btn-danger btn-sm" onclick="PageCustom.deleteCase(' + i + ')">删除</button>' +
        '<button class="btn btn-secondary btn-sm" onclick="PageCustom.playCase(' + i + ')">▶ 朗读</button>' +
        (hasEnglish ? '<button class="btn btn-primary btn-sm" onclick="PageCustom.startPractice(' + i + ')">🎤 口语练习</button>' : '') +
      '</div>' +
    '</div>';
  }

  // ===== Methodologies Tab =====

  function renderMethodologies() {
    var data = AppStorage.getAll();
    var methods = (data.customContent && data.customContent.methodologies) || [];

    return '<div class="custom-section">' +
      '<div class="custom-header">' +
        '<div class="custom-hint">整理你掌握的营销方法论框架，支持中文/英文/中英混合输入。</div>' +
        '<button class="btn btn-primary" onclick="PageCustom.newMethod()">+ 新增方法论</button>' +
      '</div>' +
      (state.editingMethod !== null ? renderMethodForm(methods) : '') +
      (state.previewType === 'method' ? renderTranslatePreview() : '') +
      (methods.length === 0 ?
        '<div class="empty-state">' +
          '<div class="empty-icon">📚</div>' +
          '<div class="empty-text">还没有方法论要点</div>' +
          '<div class="empty-hint">点击"新增方法论"添加你掌握的营销框架</div>' +
        '</div>' :
        '<div class="cards-grid">' +
          methods.map(function (m, i) { return renderMethodCard(m, i); }).join('') +
        '</div>') +
      '<div class="template-guide">' +
        '<div class="guide-title">💡 常用营销方法论参考</div>' +
        '<ul class="guide-list">' +
          '<li>4P Framework (Product, Price, Place, Promotion)</li>' +
          '<li>Brand Positioning Statement Template</li>' +
          '<li>Consumer Journey Mapping</li>' +
          '<li>STAR Storytelling Method</li>' +
          '<li>SCR Presentation Framework (Situation, Complication, Resolution)</li>' +
          '<li>Long and Short of It — Brand vs. Activation Investment</li>' +
        '</ul>' +
      '</div>' +
    '</div>';
  }

  function renderMethodForm(methods) {
    var isNew = state.editingMethod === 'new';
    var m = isNew ? {} : methods[state.editingMethod] || {};
    var p = state.pendingMethodForm;
    var titleVal = p ? p.title : (m.title || '');
    var summaryVal = p ? p.summaryRaw : (m.summaryRaw || m.summary || '');
    var pointsVal = p ? p.pointsRaw : (isNew ? '' : (m.pointsRaw || (m.points || []).join('\n')));

    return '<div class="edit-form-overlay">' +
      '<div class="edit-form">' +
        '<div class="form-title">' + (isNew ? '新增方法论' : '编辑方法论') + '</div>' +
        formField('方法论名称', 'methodTitle', titleVal, '例如：4P 营销组合框架') +
        formField('一句话描述（中文/英文均可）', 'methodSummary', summaryVal, '例如：通过四个维度分析品牌战略的框架...') +
        formTextarea('核心要点（中文/英文均可，每行一条）', 'methodPoints', pointsVal, '例如：\n产品：定义核心产品和差异化优势\n价格：设定反映品牌定位的价格策略\n渠道：选择最佳分销渠道\n推广：制定整合营销传播方案') +
        '<div class="form-actions">' +
          '<button class="btn btn-primary" onclick="PageCustom.saveMethod(\'' + (isNew ? 'new' : state.editingMethod) + '\')">保存原文</button>' +
          '<button class="btn btn-translate' + (state.translating ? ' loading' : '') + '" onclick="PageCustom.translateAndSaveMethod(\'' + (isNew ? 'new' : state.editingMethod) + '\')"' +
            (state.translating ? ' disabled' : '') + '>' +
            (state.translating ? '<span class="translating-spinner"></span> 翻译中...' : '🌐 翻译为英文') +
          '</button>' +
          '<button class="btn btn-secondary" onclick="PageCustom.cancelEdit()">取消</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderMethodCard(m, i) {
    return '<div class="custom-card">' +
      '<div class="card-title">' + (m.title || '（未命名）') + '</div>' +
      (m.summary ? '<div class="card-scenario">' + m.summary + '</div>' : '') +
      (m.points && m.points.length > 0 ?
        '<ul class="card-points">' + m.points.slice(0, 3).map(function (p) {
          return '<li>' + p + '</li>';
        }).join('') + (m.points.length > 3 ? '<li>...</li>' : '') + '</ul>' : '') +
      '<div class="card-actions">' +
        '<button class="btn btn-secondary btn-sm" onclick="PageCustom.editMethod(' + i + ')">编辑</button>' +
        '<button class="btn btn-danger btn-sm" onclick="PageCustom.deleteMethod(' + i + ')">删除</button>' +
        '<button class="btn btn-secondary btn-sm" onclick="PageCustom.playMethod(' + i + ')">▶ 朗读</button>' +
      '</div>' +
    '</div>';
  }

  // ===== Translation Preview Panel =====

  function renderTranslatePreview() {
    if (!state.previewData) return '';
    var d = state.previewData;

    var fieldsHtml = '';
    if (state.previewType === 'case') {
      var labels = { scenario: '场景描述 Scenario', situation: '情况背景 Situation', task: '任务目标 Task', action: '关键行动 Action', result: '成果数据 Result', keywords: '关键词 Keywords' };
      ['scenario', 'situation', 'task', 'action', 'result', 'keywords'].forEach(function (key) {
        var val = d[key] || '';
        if (key === 'keywords' && Array.isArray(val)) val = val.join(', ');
        fieldsHtml += '<div class="preview-field">' +
          '<label class="preview-label">' + labels[key] + '</label>' +
          (key === 'keywords' ?
            '<input type="text" class="form-input" id="preview_' + key + '" value="' + String(val).replace(/"/g, '&quot;') + '">' :
            '<textarea class="form-textarea" id="preview_' + key + '" rows="3">' + escapeTextarea(val) + '</textarea>') +
        '</div>';
      });
    } else {
      fieldsHtml += '<div class="preview-field">' +
        '<label class="preview-label">一句话描述 Summary</label>' +
        '<input type="text" class="form-input" id="preview_summary" value="' + (d.summary || '').replace(/"/g, '&quot;') + '">' +
      '</div>';
      fieldsHtml += '<div class="preview-field">' +
        '<label class="preview-label">核心要点 Key Points</label>' +
        '<textarea class="form-textarea" id="preview_points" rows="4">' + escapeTextarea((d.points || []).join('\n')) + '</textarea>' +
      '</div>';
    }

    return '<div class="translate-preview-overlay">' +
      '<div class="translate-preview">' +
        '<div class="form-title">英文翻译预览 — 可编辑修正</div>' +
        '<div class="preview-hint">以下是自动翻译结果，请检查并修正后确认保存。</div>' +
        fieldsHtml +
        '<div class="form-actions">' +
          '<button class="btn btn-primary" onclick="PageCustom.confirmPreview()">确认保存</button>' +
          '<button class="btn btn-secondary" onclick="PageCustom.cancelPreview()">取消</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ===== Speaking Practice Tab =====

  function renderSpeakingTab() {
    if (state.practiceCase !== null) {
      return renderSpeakingPractice();
    }
    var data = AppStorage.getAll();
    var cases = (data.customContent && data.customContent.cases) || [];
    var practiceable = [];
    cases.forEach(function (c, i) {
      if (c.situation && !AppTranslator.hasChinese(c.situation)) {
        practiceable.push({ case: c, index: i });
      }
    });

    if (practiceable.length === 0) {
      return '<div class="custom-section">' +
        '<div class="empty-state">' +
          '<div class="empty-icon">🎤</div>' +
          '<div class="empty-text">还没有可练习的案例</div>' +
          '<div class="empty-hint">请先在"我的案例"中添加案例，并使用"翻译为英文"生成英文版本</div>' +
        '</div>' +
      '</div>';
    }

    return '<div class="custom-section">' +
      '<div class="custom-hint">选择一个案例开始口语练习，按 STAR 结构进行汇报训练。</div>' +
      '<div class="cards-grid">' +
        practiceable.map(function (item) {
          var c = item.case;
          return '<div class="custom-card">' +
            '<div class="card-title">' + (c.title || '（未命名案例）') + '</div>' +
            (c.scenario ? '<div class="card-scenario">' + c.scenario + '</div>' : '') +
            '<div class="card-actions">' +
              '<button class="btn btn-primary" onclick="PageCustom.startPractice(' + item.index + ')">🎤 开始练习</button>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</div>';
  }

  function generateSpeakingData(c) {
    return {
      title: 'STAR Practice: ' + (c.title || 'Custom Case'),
      outline: [
        { point: '1. Situation (0:00–0:30)', note: c.situation || '', noteZh: c.situationRaw || '' },
        { point: '2. Task (0:30–0:50)', note: c.task || '', noteZh: c.taskRaw || '' },
        { point: '3. Action (0:50–1:30)', note: c.action || '', noteZh: c.actionRaw || '' },
        { point: '4. Result (1:30–2:00)', note: c.result || '', noteZh: c.resultRaw || '' }
      ],
      keySentences: extractKeySentences(c),
      keySentencesZh: extractKeySentencesZh(c)
    };
  }

  function extractKeySentences(c) {
    var fields = ['situation', 'task', 'action', 'result'];
    var sentences = [];
    fields.forEach(function (f) {
      var text = c[f] || '';
      var parts = text.split(/[.!?]/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 20; });
      if (parts.length > 0) sentences.push(parts[0] + '.');
    });
    return sentences;
  }

  function extractKeySentencesZh(c) {
    var fields = ['situationRaw', 'taskRaw', 'actionRaw', 'resultRaw'];
    var sentences = [];
    fields.forEach(function (f) {
      var text = c[f] || '';
      if (!AppTranslator.hasChinese(text)) { sentences.push(''); return; }
      var parts = text.split(/[。！？]/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length >= 5; });
      sentences.push(parts.length > 0 ? parts[0] : '');
    });
    return sentences;
  }

  function renderSpeakingPractice() {
    var data = AppStorage.getAll();
    var cases = (data.customContent && data.customContent.cases) || [];
    var c = cases[state.practiceCase];
    if (!c) return '<p class="error">案例不存在</p>';
    var S = generateSpeakingData(c);

    return '<div class="page-speaking">' +
      '<div class="speaking-back-bar">' +
        '<button class="btn btn-secondary btn-sm" onclick="PageCustom.exitPractice()">← 返回案例列表</button>' +
      '</div>' +
      '<h2 class="page-title">口语练习 — ' + (c.title || '自定义案例') + '</h2>' +
      '<div class="speaking-topic-bar">' +
        '<strong>' + S.title + '</strong>' +
      '</div>' +
      '<div class="tab-bar">' +
        practiceTabBtn('outline', '📋 汇报提纲') +
        practiceTabBtn('record', '🎙️ 录音练习') +
        practiceTabBtn('eval', '📊 自评打分') +
      '</div>' +
      '<div id="practice-phase-content">' + renderPracticePhase(S) + '</div>' +
    '</div>';
  }

  function practiceTabBtn(id, label) {
    return '<button class="tab-btn practice-tab-btn' + (state.practicePhase === id ? ' active' : '') +
      '" data-ptab="' + id + '" onclick="PageCustom.switchPracticePhase(\'' + id + '\')">' + label + '</button>';
  }

  function renderPracticePhase(S) {
    if (state.practicePhase === 'outline') return renderPracticeOutline(S);
    if (state.practicePhase === 'record') return renderPracticeRecord(S);
    if (state.practicePhase === 'eval') return renderPracticeEval(S);
    return '';
  }

  function renderPracticeOutline(S) {
    return '<div class="outline-section">' +
      '<div class="instruction-box">' +
        '<strong>任务：</strong>用 STAR 法则汇报这个案例<br>' +
        '建议用时：2 分钟（约 200–350 词），录音前熟悉以下提纲和关键句型。' +
      '</div>' +
      '<div class="outline-card">' +
        '<div class="outline-title">📋 汇报提纲</div>' +
        S.outline.map(function (item) {
          return '<div class="outline-item">' +
            '<div class="outline-point">' + item.point + '</div>' +
            '<div class="outline-note">' + item.note + '</div>' +
            (item.noteZh && AppTranslator.hasChinese(item.noteZh) ? '<div class="zh-translation">' + item.noteZh + '</div>' : '') +
          '</div>';
        }).join('') +
      '</div>' +
      (S.keySentences.length > 0 ?
        '<div class="key-sentences-card">' +
          '<div class="ks-title">💬 关键句型参考</div>' +
          '<ul class="ks-list">' +
            S.keySentences.map(function (s, i) {
              return '<li class="ks-item">' +
                '<div class="ks-en-row">' +
                  '<span class="ks-text">' + s + '</span>' +
                  '<button class="btn-play-ks" onclick="PageCustom.playKeySentence(\'' + s.replace(/'/g, "\\'").replace(/"/g, '&quot;') + '\')" title="试听">▶</button>' +
                '</div>' +
                (S.keySentencesZh[i] ? '<div class="zh-translation">' + S.keySentencesZh[i] + '</div>' : '') +
              '</li>';
            }).join('') +
          '</ul>' +
        '</div>' : '') +
      '<button class="btn btn-primary" onclick="PageCustom.switchPracticePhase(\'record\')" style="margin-top:1.5rem">开始录音 🎙️</button>' +
    '</div>';
  }

  function renderPracticeRecord(S) {
    return '<div class="record-section">' +
      '<div class="instruction-box">' +
        '<strong>录音说明：</strong>点击"开始录音"，按提纲完整汇报一遍。录完后可回听，满意后进入自评。' +
      '</div>' +
      '<div class="record-center">' +
        '<div class="record-btn-wrap">' +
          '<button class="btn-record ' + (state.practiceRecording ? 'recording' : '') + '" onclick="PageCustom.togglePracticeRecord()">' +
            (state.practiceRecording ? '■ 停止录音' : '● 开始录音') +
          '</button>' +
          (state.practiceRecording ? '<div class="recording-indicator"><span class="rec-dot"></span> 录制中...</div>' : '') +
        '</div>' +
        (state.practiceAudioUrl ?
          '<div class="playback-area">' +
            '<div class="playback-title">录音回放：</div>' +
            '<audio controls src="' + state.practiceAudioUrl + '" class="audio-player"></audio>' +
          '</div>' : '') +
      '</div>' +
      '<div class="record-outline-mini">' +
        '<div class="mini-title">提纲速览：</div>' +
        S.outline.map(function (item) {
          return '<div class="mini-point">• ' + item.point + '</div>';
        }).join('') +
      '</div>' +
      (!AppRecorder.isSupported() ?
        '<div class="warn-box">⚠️ 浏览器不支持录音功能。请使用 Chrome 或 Edge 浏览器。</div>' : '') +
      (state.practiceAudioUrl ?
        '<button class="btn btn-primary" onclick="PageCustom.switchPracticePhase(\'eval\')" style="margin-top:1rem">录音满意，进入自评 →</button>' : '') +
    '</div>';
  }

  function renderPracticeEval(S) {
    var totalScore = calcPracticeScore();
    return '<div class="eval-section">' +
      '<div class="instruction-box">' +
        '<strong>自评说明：</strong>回听录音后，对每个维度打分（1–5分），然后提交保存。' +
      '</div>' +
      '<div class="eval-form">' +
        evalDimensions.map(function (dim) {
          var current = state.practiceScores[dim.id] || 0;
          return '<div class="eval-row">' +
            '<div class="eval-dim-label">' +
              '<span>' + dim.label + '</span>' +
              '<span class="eval-hint">' + dim.hint + '</span>' +
            '</div>' +
            '<div class="star-rating" id="pstars-' + dim.id + '">' +
              [1,2,3,4,5].map(function (n) {
                return '<span class="star' + (n <= current ? ' active' : '') + '" onclick="PageCustom.setPracticeStar(\'' + dim.id + '\',' + n + ')">' +
                  (n <= current ? '★' : '☆') +
                '</span>';
              }).join('') +
            '</div>' +
            '<div class="eval-score-display">' + (current > 0 ? current + '/5' : '未评') + '</div>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div class="eval-total">' +
        '综合自评得分：<strong>' + (totalScore > 0 ? Math.round(totalScore) + '/100 分' : '请先完成所有维度评分') + '</strong>' +
      '</div>' +
      '<div class="action-row">' +
        '<button class="btn btn-primary btn-large" onclick="PageCustom.submitPracticeEval()" ' +
          (totalScore === 0 ? 'disabled' : '') + '>✓ 提交自评并保存</button>' +
        (state.practiceAudioUrl ? '<button class="btn btn-secondary" onclick="PageCustom.switchPracticePhase(\'record\')">返回回听</button>' : '') +
      '</div>' +
      (state.practiceSubmitted ?
        '<div class="success-banner">✅ 口语练习已完成！</div>' : '') +
    '</div>';
  }

  // ===== Form Helpers =====

  function formField(label, id, value, placeholder) {
    return '<div class="form-field">' +
      '<label class="form-label">' + label + '</label>' +
      '<input type="text" id="' + id + '" class="form-input" value="' + (value || '').replace(/"/g, '&quot;') + '" placeholder="' + placeholder + '">' +
    '</div>';
  }

  function escapeTextarea(str) {
    return (str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formTextarea(label, id, value, placeholder) {
    return '<div class="form-field">' +
      '<label class="form-label">' + label + '</label>' +
      '<textarea id="' + id + '" class="form-textarea" rows="4" placeholder="' + placeholder + '">' + escapeTextarea(value) + '</textarea>' +
    '</div>';
  }

  // ===== Actions: Tab / Edit =====

  function switchTab(tab) {
    state.tab = tab;
    state.editingCase = null;
    state.editingMethod = null;
    state.previewData = null;
    state.previewType = null;
    state.pendingCaseForm = null;
    state.pendingMethodForm = null;
    if (tab !== 'speaking') {
      state.practiceCase = null;
    }
    var el = document.getElementById('custom-tab-content');
    if (el) el.innerHTML = renderTab();
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
  }

  function newCase() { state.editingCase = 'new'; refreshTab(); }
  function editCase(i) { state.editingCase = i; refreshTab(); }

  function newMethod() { state.editingMethod = 'new'; refreshTab(); }
  function editMethod(i) { state.editingMethod = i; refreshTab(); }

  function cancelEdit() {
    state.editingCase = null;
    state.editingMethod = null;
    state.translating = false;
    state.pendingCaseForm = null;
    state.pendingMethodForm = null;
    refreshTab();
  }

  // ===== Actions: Save Case =====

  function readCaseForm() {
    return {
      title: (document.getElementById('caseTitle') || {}).value || '',
      scenarioRaw: (document.getElementById('caseScenario') || {}).value || '',
      situationRaw: (document.getElementById('caseSituation') || {}).value || '',
      taskRaw: (document.getElementById('caseTask') || {}).value || '',
      actionRaw: (document.getElementById('caseAction') || {}).value || '',
      resultRaw: (document.getElementById('caseResult') || {}).value || '',
      keywordsRaw: (document.getElementById('caseKeywords') || {}).value || ''
    };
  }

  function saveCase(idx) {
    var raw = readCaseForm();
    var entry = {
      title: raw.title,
      scenario: raw.scenarioRaw,
      scenarioRaw: raw.scenarioRaw,
      situation: raw.situationRaw,
      situationRaw: raw.situationRaw,
      task: raw.taskRaw,
      taskRaw: raw.taskRaw,
      action: raw.actionRaw,
      actionRaw: raw.actionRaw,
      result: raw.resultRaw,
      resultRaw: raw.resultRaw,
      keywords: raw.keywordsRaw.split(/[,，]/).map(function (k) { return k.trim(); }).filter(Boolean),
      keywordsRaw: raw.keywordsRaw,
      createdAt: new Date().toISOString()
    };
    persistCase(idx, entry);
    state.editingCase = null;
    state.pendingCaseForm = null;
    App.showToast('案例已保存（原文）', 'success');
    refreshTab();
  }

  function translateAndSaveCase(idx) {
    var raw = readCaseForm();
    if (!raw.title && !raw.scenarioRaw && !raw.situationRaw) {
      App.showToast('请至少填写一个字段', 'warning');
      return;
    }
    state.pendingCaseForm = raw;
    state.translating = true;
    refreshTab();

    var toTranslate = {
      scenario: raw.scenarioRaw,
      situation: raw.situationRaw,
      task: raw.taskRaw,
      action: raw.actionRaw,
      result: raw.resultRaw,
      keywords: raw.keywordsRaw
    };

    AppTranslator.translateFields(toTranslate).then(function (translated) {
      state.translating = false;
      translated.keywords = translated.keywords.split(/[,，]/).map(function (k) { return k.trim(); }).filter(Boolean);
      state.previewData = translated;
      state.previewData._raw = raw;
      state.previewType = 'case';
      state.previewIdx = idx;
      state.editingCase = null;
      refreshTab();
    }).catch(function (err) {
      state.translating = false;
      App.showToast('翻译失败，请检查网络连接或手动修改为英文。错误：' + err.message, 'error');
      refreshTab();
    });
  }

  function confirmPreview() {
    if (state.previewType === 'case') {
      var raw = state.previewData._raw;
      var entry = {
        title: raw.title,
        scenario: (document.getElementById('preview_scenario') || {}).value || state.previewData.scenario,
        scenarioRaw: raw.scenarioRaw,
        situation: (document.getElementById('preview_situation') || {}).value || state.previewData.situation,
        situationRaw: raw.situationRaw,
        task: (document.getElementById('preview_task') || {}).value || state.previewData.task,
        taskRaw: raw.taskRaw,
        action: (document.getElementById('preview_action') || {}).value || state.previewData.action,
        actionRaw: raw.actionRaw,
        result: (document.getElementById('preview_result') || {}).value || state.previewData.result,
        resultRaw: raw.resultRaw,
        keywords: ((document.getElementById('preview_keywords') || {}).value || '').split(/[,，]/).map(function (k) { return k.trim(); }).filter(Boolean),
        keywordsRaw: raw.keywordsRaw,
        createdAt: new Date().toISOString()
      };
      persistCase(state.previewIdx, entry);
      App.showToast('案例已保存（英文翻译版）', 'success');
    } else if (state.previewType === 'method') {
      var rawM = state.previewData._raw;
      var entry = {
        title: rawM.title,
        summary: (document.getElementById('preview_summary') || {}).value || state.previewData.summary,
        summaryRaw: rawM.summaryRaw,
        points: ((document.getElementById('preview_points') || {}).value || '').split('\n').map(function (p) { return p.trim(); }).filter(Boolean),
        pointsRaw: rawM.pointsRaw,
        createdAt: new Date().toISOString()
      };
      persistMethod(state.previewIdx, entry);
      App.showToast('方法论已保存（英文翻译版）', 'success');
    }
    state.previewData = null;
    state.previewType = null;
    state.previewIdx = null;
    state.pendingCaseForm = null;
    state.pendingMethodForm = null;
    refreshTab();
  }

  function cancelPreview() {
    if (state.previewType === 'case' && state.previewData && state.previewData._raw) {
      state.pendingCaseForm = state.previewData._raw;
      state.editingCase = state.previewIdx;
    } else if (state.previewType === 'method' && state.previewData && state.previewData._raw) {
      state.pendingMethodForm = state.previewData._raw;
      state.editingMethod = state.previewIdx;
    }
    state.previewData = null;
    state.previewType = null;
    state.previewIdx = null;
    refreshTab();
  }

  function persistCase(idx, entry) {
    var data = AppStorage.getAll();
    if (!data.customContent) data.customContent = { cases: [], methodologies: [] };
    if (!data.customContent.cases) data.customContent.cases = [];
    if (idx === 'new') {
      data.customContent.cases.push(entry);
    } else {
      entry.createdAt = (data.customContent.cases[idx] || {}).createdAt || entry.createdAt;
      data.customContent.cases[idx] = entry;
    }
    AppStorage.saveAll(data);
  }

  function deleteCase(i) {
    if (!confirm('确定要删除这个案例吗？')) return;
    var data = AppStorage.getAll();
    data.customContent.cases.splice(i, 1);
    AppStorage.saveAll(data);
    refreshTab();
  }

  function playCase(i) {
    var data = AppStorage.getAll();
    var c = data.customContent.cases[i];
    if (!c) return;
    var text = [c.scenario, c.situation, c.task, c.action, c.result].filter(Boolean).join(' ');
    AppTTS.speak(text.trim());
  }

  // ===== Actions: Save Method =====

  function readMethodForm() {
    return {
      title: (document.getElementById('methodTitle') || {}).value || '',
      summaryRaw: (document.getElementById('methodSummary') || {}).value || '',
      pointsRaw: (document.getElementById('methodPoints') || {}).value || ''
    };
  }

  function saveMethod(idx) {
    var raw = readMethodForm();
    var entry = {
      title: raw.title,
      summary: raw.summaryRaw,
      summaryRaw: raw.summaryRaw,
      points: raw.pointsRaw.split('\n').map(function (p) { return p.trim(); }).filter(Boolean),
      pointsRaw: raw.pointsRaw,
      createdAt: new Date().toISOString()
    };
    persistMethod(idx, entry);
    state.editingMethod = null;
    state.pendingMethodForm = null;
    App.showToast('方法论已保存（原文）', 'success');
    refreshTab();
  }

  function translateAndSaveMethod(idx) {
    var raw = readMethodForm();
    if (!raw.title && !raw.summaryRaw && !raw.pointsRaw) {
      App.showToast('请至少填写一个字段', 'warning');
      return;
    }
    state.pendingMethodForm = raw;
    state.translating = true;
    refreshTab();

    var pointLines = raw.pointsRaw.split('\n').map(function (p) { return p.trim(); }).filter(Boolean);
    var pointPromises = pointLines.map(function (line) {
      return AppTranslator.toEnglish(line);
    });

    Promise.all([
      AppTranslator.toEnglish(raw.summaryRaw),
      Promise.all(pointPromises)
    ]).then(function (results) {
      state.translating = false;
      state.previewData = {
        summary: results[0],
        points: results[1]
      };
      state.previewData._raw = raw;
      state.previewType = 'method';
      state.previewIdx = idx;
      state.editingMethod = null;
      refreshTab();
    }).catch(function (err) {
      state.translating = false;
      App.showToast('翻译失败，请检查网络连接或手动修改为英文。错误：' + err.message, 'error');
      refreshTab();
    });
  }

  function persistMethod(idx, entry) {
    var data = AppStorage.getAll();
    if (!data.customContent) data.customContent = { cases: [], methodologies: [] };
    if (!data.customContent.methodologies) data.customContent.methodologies = [];
    if (idx === 'new') {
      data.customContent.methodologies.push(entry);
    } else {
      entry.createdAt = (data.customContent.methodologies[idx] || {}).createdAt || entry.createdAt;
      data.customContent.methodologies[idx] = entry;
    }
    AppStorage.saveAll(data);
  }

  function deleteMethod(i) {
    if (!confirm('确定要删除这个方法论要点吗？')) return;
    var data = AppStorage.getAll();
    data.customContent.methodologies.splice(i, 1);
    AppStorage.saveAll(data);
    refreshTab();
  }

  function playMethod(i) {
    var data = AppStorage.getAll();
    var m = data.customContent.methodologies[i];
    if (!m) return;
    var text = (m.summary || '') + ' ' + (m.points || []).join(' ');
    AppTTS.speak(text.trim());
  }

  // ===== Actions: Speaking Practice =====

  function startPractice(i) {
    state.practiceCase = i;
    state.practicePhase = 'outline';
    state.practiceRecording = false;
    state.practiceAudioUrl = null;
    state.practiceScores = {};
    state.practiceSubmitted = false;
    state.tab = 'speaking';
    var el = document.getElementById('custom-tab-content');
    if (el) el.innerHTML = renderTab();
    document.querySelectorAll('.tab-btn[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === 'speaking');
    });
  }

  function exitPractice() {
    AppTTS.stop();
    if (state.practiceRecording) {
      AppRecorder.stop().catch(function () {});
      state.practiceRecording = false;
    }
    state.practiceCase = null;
    refreshTab();
  }

  function switchPracticePhase(phase) {
    state.practicePhase = phase;
    var data = AppStorage.getAll();
    var cases = (data.customContent && data.customContent.cases) || [];
    var c = cases[state.practiceCase];
    if (!c) return;
    var S = generateSpeakingData(c);
    var el = document.getElementById('practice-phase-content');
    if (el) el.innerHTML = renderPracticePhase(S);
    document.querySelectorAll('.practice-tab-btn[data-ptab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-ptab') === phase);
    });
  }

  function togglePracticeRecord() {
    if (state.practiceRecording) {
      AppRecorder.stop().then(function (result) {
        state.practiceRecording = false;
        if (result) state.practiceAudioUrl = result.url;
        refreshPracticePhase();
      });
    } else {
      AppRecorder.start().then(function () {
        state.practiceRecording = true;
        refreshPracticePhase();
      }).catch(function (err) {
        App.showToast('录音失败：' + err.message, 'error');
      });
    }
  }

  function setPracticeStar(dimId, score) {
    state.practiceScores[dimId] = score;
    var container = document.getElementById('pstars-' + dimId);
    if (container) {
      container.querySelectorAll('.star').forEach(function (s, i) {
        s.textContent = i < score ? '★' : '☆';
        s.classList.toggle('active', i < score);
      });
    }
    var parent = container ? container.parentElement : null;
    if (parent) {
      var display = parent.querySelector('.eval-score-display');
      if (display) display.textContent = score + '/5';
    }
    var totalEl = document.querySelector('.eval-total strong');
    if (totalEl) {
      var t = calcPracticeScore();
      totalEl.textContent = t > 0 ? Math.round(t) + '/100 分' : '请先完成所有维度评分';
    }
    var submitBtn = document.querySelector('.eval-section .btn-primary');
    if (submitBtn) submitBtn.disabled = calcPracticeScore() === 0;
  }

  function calcPracticeScore() {
    var keys = evalDimensions.map(function (d) { return d.id; });
    var filled = keys.filter(function (k) { return state.practiceScores[k] > 0; });
    if (filled.length === 0) return 0;
    var sum = filled.reduce(function (acc, k) { return acc + state.practiceScores[k]; }, 0);
    return (sum / (keys.length * 5)) * 100;
  }

  function submitPracticeEval() {
    var score = calcPracticeScore();
    if (score === 0) { App.showToast('请先完成所有维度评分', 'warning'); return; }
    var data = AppStorage.getAll();
    if (!data.customContent.speakingPractices) data.customContent.speakingPractices = [];
    data.customContent.speakingPractices.push({
      caseIndex: state.practiceCase,
      score: Math.round(score),
      selfEval: JSON.parse(JSON.stringify(state.practiceScores)),
      date: new Date().toISOString()
    });
    AppStorage.saveAll(data);
    state.practiceSubmitted = true;
    App.showToast('口语练习自评已保存：' + Math.round(score) + ' 分', 'success');
    refreshPracticePhase();
  }

  function playKeySentence(text) {
    AppTTS.speak(text, { rate: 0.9 });
  }

  function refreshPracticePhase() {
    var data = AppStorage.getAll();
    var cases = (data.customContent && data.customContent.cases) || [];
    var c = cases[state.practiceCase];
    if (!c) return;
    var S = generateSpeakingData(c);
    var el = document.getElementById('practice-phase-content');
    if (el) el.innerHTML = renderPracticePhase(S);
  }

  function refreshTab() {
    var el = document.getElementById('custom-tab-content');
    if (el) el.innerHTML = renderTab();
  }

  function onLeave() {
    AppTTS.stop();
    if (state.practiceRecording) {
      AppRecorder.stop().catch(function () {});
      state.practiceRecording = false;
    }
  }

  return {
    render: render,
    switchTab: switchTab,
    newCase: newCase,
    editCase: editCase,
    saveCase: saveCase,
    translateAndSaveCase: translateAndSaveCase,
    deleteCase: deleteCase,
    playCase: playCase,
    newMethod: newMethod,
    editMethod: editMethod,
    saveMethod: saveMethod,
    translateAndSaveMethod: translateAndSaveMethod,
    deleteMethod: deleteMethod,
    playMethod: playMethod,
    cancelEdit: cancelEdit,
    confirmPreview: confirmPreview,
    cancelPreview: cancelPreview,
    startPractice: startPractice,
    exitPractice: exitPractice,
    switchPracticePhase: switchPracticePhase,
    togglePracticeRecord: togglePracticeRecord,
    setPracticeStar: setPracticeStar,
    submitPracticeEval: submitPracticeEval,
    playKeySentence: playKeySentence,
    onLeave: onLeave
  };
})();
