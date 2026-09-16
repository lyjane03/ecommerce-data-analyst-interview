var PageSettings = (function () {

  function render() {
    var data = AppStorage.getAll();
    var settings = data.settings || {};

    return '<div class="page-settings">' +
      '<h2 class="page-title">设置</h2>' +

      '<div class="settings-section">' +
        '<div class="section-title">📅 学习计划设置</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">学习开始日期</label>' +
          '<div class="setting-control">' +
            '<input type="date" id="startDateInput" class="setting-input" value="' + (settings.startDate || '') + '">' +
            '<button class="btn btn-primary btn-sm" onclick="PageSettings.saveStartDate()">保存</button>' +
          '</div>' +
          '<div class="setting-hint">修改后将重新计算当前学习天数（Day 1–14）</div>' +
        '</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">当前学习天</label>' +
          '<div class="setting-info">Day ' + AppStorage.getCurrentDay() + ' / 14</div>' +
        '</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">连续学习天数</label>' +
          '<div class="setting-info">🔥 ' + data.streakDays + ' 天</div>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="section-title">💾 数据备份</div>' +
        '<div class="backup-grid">' +
          '<div class="backup-card">' +
            '<div class="backup-title">导出数据</div>' +
            '<div class="backup-desc">将所有学习进度、得分记录、自定义素材导出为 JSON 文件，保存到本地。</div>' +
            '<button class="btn btn-primary" onclick="PageSettings.exportData()">📤 导出 JSON 备份</button>' +
          '</div>' +
          '<div class="backup-card">' +
            '<div class="backup-title">导入数据</div>' +
          '<div class="backup-desc">从本版本导出的 JSON 文件恢复学习进度（会覆盖当前数据）。其他版本的文件会被拒绝。</div>' +
            '<input type="file" id="importFile" accept=".json" style="display:none" onchange="PageSettings.importData(this)">' +
            '<button class="btn btn-secondary" onclick="document.getElementById(\'importFile\').click()">📥 导入 JSON 文件</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="section-title">📊 数据概览</div>' +
        '<div class="data-stats">' +
          '<div class="data-stat">' +
            '<div class="stat-label">已记录学习天</div>' +
            '<div class="stat-val">' + Object.keys(data.dailyProgress || {}).length + ' 天</div>' +
          '</div>' +
          '<div class="data-stat">' +
            '<div class="stat-label">薄弱词汇</div>' +
            '<div class="stat-val">' + ((data.weakPoints && data.weakPoints.vocabulary) ? data.weakPoints.vocabulary.length : 0) + ' 个</div>' +
          '</div>' +
          '<div class="data-stat">' +
            '<div class="stat-label">测验错题</div>' +
            '<div class="stat-val">' + ((data.weakPoints && data.weakPoints.quizErrors) ? data.weakPoints.quizErrors.length : 0) + ' 条</div>' +
          '</div>' +
          '<div class="data-stat">' +
            '<div class="stat-label">自定义案例</div>' +
            '<div class="stat-val">' + ((data.customContent && data.customContent.cases) ? data.customContent.cases.length : 0) + ' 个</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="section-title">🤖 AI 辅助评分</div>' +
        '<div class="setting-row"><label class="setting-label">服务状态</label><div id="ai-config-status" class="setting-info">正在检查 AI 服务…</div></div>' +
        '<div class="setting-row"><label class="setting-label">数据传输说明</label><div class="setting-hint">案例答案只在主动点击后发送给 DeepSeek；口语录音先发送给 GLM 转写，transcript 再发送给 DeepSeek 评分。原始录音不会保存到浏览器进度，临时转换文件会在请求后删除。</div></div>' +
      '</div>' +

      '<div class="settings-section">' +
        '<div class="section-title">🔊 语音设置</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">TTS 支持状态</label>' +
          '<div class="setting-info ' + (AppTTS.isSupported() ? 'status-ok' : 'status-err') + '">' +
            (AppTTS.isSupported() ? '✅ 支持（浏览器语音合成可用）' : '❌ 不支持，请使用 Chrome 或 Edge') +
          '</div>' +
        '</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">录音支持状态</label>' +
          '<div class="setting-info ' + (AppRecorder.isSupported() ? 'status-ok' : 'status-err') + '">' +
            (AppRecorder.isSupported() ? '✅ 支持（麦克风录音可用）' : '❌ 不支持，需要 HTTPS 或本地服务器') +
          '</div>' +
        '</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">测试语音</label>' +
          '<button class="btn btn-secondary btn-sm" onclick="AppTTS.speak(\'I am an e-commerce data analyst. I turn customer and order data into clear business decisions.\')">▶ 试听英文 TTS</button>' +
        '</div>' +
      '</div>' +

      '<div class="settings-section danger-zone">' +
        '<div class="section-title">⚠️ 危险操作</div>' +
        '<div class="setting-row">' +
          '<label class="setting-label">重置所有数据</label>' +
          '<div>' +
            '<button class="btn btn-danger" onclick="PageSettings.resetAll()">🗑️ 清空全部数据（不可恢复）</button>' +
          '</div>' +
          '<div class="setting-hint danger">此操作将清空所有学习进度、得分记录和自定义素材。请先导出备份！</div>' +
        '</div>' +
      '</div>' +

      '<div class="settings-footer">' +
        '<div class="footer-info">E-commerce Data Analyst 英语面试训练 · 学习进度存储于本地浏览器 · AI 仅在主动点击后发送</div>' +
      '</div>' +
    '</div>';
  }

  function saveStartDate() {
    var input = document.getElementById('startDateInput');
    if (!input || !input.value) return;
    AppStorage.set('settings.startDate', input.value);
    App.showToast('开始日期已保存：' + input.value, 'success');
    var el = document.querySelector('#app-content');
    if (el) el.innerHTML = render();
  }

  function afterRender() {
    AppAIScoring.health().then(function () {
      var el = document.getElementById('ai-config-status');
      if (!el) return;
      var status = AppAIScoring.getStatus();
      el.className = 'setting-info ' + (status.scoringConfigured && status.transcriptionConfigured ? 'status-ok' : 'status-warn');
      var scoring = status.scoringConfigured ? 'DeepSeek ✅ ' + status.scoringModel : 'DeepSeek ⚠️ 未配置';
      var transcription = status.transcriptionConfigured ? 'GLM ✅ ' + status.transcribeModel : 'GLM ⚠️ 未配置';
      el.textContent = scoring + '；' + transcription;
    });
  }

  function exportData() {
    AppStorage.exportJSON();
    App.showToast('数据导出成功！请保存到安全位置。', 'success');
  }

  function importData(input) {
    var file = input.files[0];
    if (!file) return;
    AppStorage.importJSON(file).then(function () {
      App.showToast('数据导入成功！页面将刷新。', 'success');
      setTimeout(function () { location.reload(); }, 1500);
    }).catch(function (err) {
      App.showToast('导入失败：' + err.message, 'error');
    });
  }

  function resetAll() {
    if (!confirm('确定要清空所有学习数据吗？此操作不可撤销！\n\n建议先点击取消，导出备份后再操作。')) return;
    if (!confirm('再次确认：清空全部数据？')) return;
    AppStorage.reset();
    App.showToast('数据已重置', 'success');
    setTimeout(function () { location.reload(); }, 1000);
  }

  return {
    render: render,
    afterRender: afterRender,
    saveStartDate: saveStartDate,
    exportData: exportData,
    importData: importData,
    resetAll: resetAll
  };
})();
