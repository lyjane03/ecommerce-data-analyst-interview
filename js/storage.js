var AppStorage = (function () {
  var APP_ID = 'ecommerce-data-analyst-interview';
  var SCHEMA_VERSION = 1;
  var STORAGE_KEY = 'ecommerceDataAnalystInterviewApp:v1';
  var _viewDayOverride = null;

  var defaultData = {
    appId: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    settings: {
      startDate: new Date().toISOString().split('T')[0],
      currentDay: 1,
      dailyMinutes: 240
    },
    dailyProgress: {},
    weakPoints: { vocabulary: [], sentences: [], quizErrors: [] },
    customContent: { cases: [], methodologies: [] },
    streakDays: 0,
    lastActiveDate: null
  };

  function cloneDefault() { return JSON.parse(JSON.stringify(defaultData)); }

  function getAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && data.appId === APP_ID && data.schemaVersion === SCHEMA_VERSION ? data : null;
    } catch (e) { return null; }
  }

  function saveAll(data) {
    try {
      data.appId = APP_ID;
      data.schemaVersion = SCHEMA_VERSION;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { alert('存储空间不足，请导出数据后清理浏览器缓存。'); }
  }

  function init() {
    var data = getAll();
    if (!data) { data = cloneDefault(); saveAll(data); }
    updateStreak(data);
    return data;
  }

  function updateStreak(data) {
    var today = new Date().toISOString().split('T')[0];
    if (data.lastActiveDate === today) return;
    if (data.lastActiveDate) {
      var last = new Date(data.lastActiveDate);
      var now = new Date(today);
      var diff = Math.floor((now - last) / 86400000);
      data.streakDays = diff === 1 ? data.streakDays + 1 : diff > 1 ? 1 : data.streakDays;
    } else data.streakDays = 1;
    data.lastActiveDate = today;
    saveAll(data);
  }

  function get(path) {
    var data = getAll();
    if (!data || !path) return data;
    var parts = path.split('.'), obj = data;
    for (var i = 0; i < parts.length; i++) { if (obj == null) return undefined; obj = obj[parts[i]]; }
    return obj;
  }

  function set(path, value) {
    var data = getAll() || cloneDefault();
    var parts = path.split('.'), obj = data;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]] || typeof obj[parts[i]] !== 'object') obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    saveAll(data);
    return data;
  }

  function dayFromStart(startDate) {
    var start = new Date(startDate), now = new Date();
    start.setHours(0, 0, 0, 0); now.setHours(0, 0, 0, 0);
    return Math.min(Math.max(Math.floor((now - start) / 86400000) + 1, 1), 14);
  }
  function getCurrentDay() { var data = getAll(); return _viewDayOverride !== null ? _viewDayOverride : dayFromStart(data ? data.settings.startDate : new Date()); }
  function getRealCurrentDay() { var data = getAll(); return dayFromStart(data ? data.settings.startDate : new Date()); }
  function setViewDay(day) { var d = parseInt(day, 10); if (d >= 1 && d <= 14) _viewDayOverride = d; }
  function clearViewDay() { _viewDayOverride = null; }
  function getViewDay() { return _viewDayOverride; }
  function getDayProgress(day) { var data = getAll(); return data && data.dailyProgress[day] || null; }

  function saveDayProgress(day, module, result) {
    var data = getAll() || cloneDefault();
    if (!data.dailyProgress[day]) data.dailyProgress[day] = { date: new Date().toISOString().split('T')[0] };
    data.dailyProgress[day][module] = result;
    data.lastActiveDate = new Date().toISOString().split('T')[0];
    updateStreak(data); saveAll(data); return data;
  }
  function addWeakVocabulary(word) { var data = getAll() || cloneDefault(); if (data.weakPoints.vocabulary.indexOf(word) < 0) { data.weakPoints.vocabulary.push(word); if (data.weakPoints.vocabulary.length > 50) data.weakPoints.vocabulary.shift(); saveAll(data); } }
  function addWeakSentence(sentence) { var data = getAll() || cloneDefault(); if (data.weakPoints.sentences.indexOf(sentence) < 0) { data.weakPoints.sentences.push(sentence); if (data.weakPoints.sentences.length > 30) data.weakPoints.sentences.shift(); saveAll(data); } }
  function addQuizError(day, questionIndex, type) { var data = getAll() || cloneDefault(); data.weakPoints.quizErrors.push({ day: day, questionIndex: questionIndex, type: type, date: new Date().toISOString() }); if (data.weakPoints.quizErrors.length > 100) data.weakPoints.quizErrors.shift(); saveAll(data); }

  function exportJSON() {
    var data = getAll() || cloneDefault();
    var json = JSON.stringify(data, null, 2), blob = new Blob([json], { type: 'application/json' }), url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'ecommerce-data-analyst-interview-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var data = JSON.parse(e.target.result);
          if (data.appId !== APP_ID || data.schemaVersion !== SCHEMA_VERSION) throw new Error('这不是本电商数据分析版本的备份文件，已拒绝导入。');
          if (!data.settings || !data.dailyProgress || !data.weakPoints || !data.customContent) throw new Error('备份文件字段不完整。');
          saveAll(data); resolve(data);
        } catch (err) { reject(err); }
      };
      reader.onerror = function () { reject(new Error('无法读取备份文件。')); };
      reader.readAsText(file);
    });
  }
  function reset() { var data = cloneDefault(); saveAll(data); return data; }

  return {
    APP_ID: APP_ID, SCHEMA_VERSION: SCHEMA_VERSION, STORAGE_KEY: STORAGE_KEY,
    init: init, getAll: getAll, saveAll: saveAll, get: get, set: set,
    getCurrentDay: getCurrentDay, getRealCurrentDay: getRealCurrentDay,
    setViewDay: setViewDay, clearViewDay: clearViewDay, getViewDay: getViewDay,
    getDayProgress: getDayProgress, saveDayProgress: saveDayProgress,
    addWeakVocabulary: addWeakVocabulary, addWeakSentence: addWeakSentence, addQuizError: addQuizError,
    exportJSON: exportJSON, importJSON: importJSON, reset: reset
  };
})();
