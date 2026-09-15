var AppStorage = (function () {
  var STORAGE_KEY = 'bizEnglishApp';
  var _viewDayOverride = null; // 仅内存，不持久化，用于自由浏览任意天

  var defaultData = {
    settings: {
      startDate: new Date().toISOString().split('T')[0],
      currentDay: 1,
      dailyMinutes: 240
    },
    dailyProgress: {},
    weakPoints: {
      vocabulary: [],
      sentences: [],
      quizErrors: []
    },
    customContent: {
      cases: [],
      methodologies: []
    },
    streakDays: 0,
    lastActiveDate: null
  };

  function getAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      alert('存储空间不足，请导出数据后清理浏览器缓存。');
    }
  }

  function init() {
    var data = getAll();
    if (!data) {
      data = JSON.parse(JSON.stringify(defaultData));
      saveAll(data);
    }
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
      if (diff === 1) {
        data.streakDays++;
      } else if (diff > 1) {
        data.streakDays = 1;
      }
    } else {
      data.streakDays = 1;
    }
    data.lastActiveDate = today;
    saveAll(data);
  }

  function get(path) {
    var data = getAll();
    if (!data || !path) return data;
    var parts = path.split('.');
    var obj = data;
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function set(path, value) {
    var data = getAll() || JSON.parse(JSON.stringify(defaultData));
    var parts = path.split('.');
    var obj = data;
    for (var i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]] || typeof obj[parts[i]] !== 'object') {
        obj[parts[i]] = {};
      }
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    saveAll(data);
    return data;
  }

  function getCurrentDay() {
    if (_viewDayOverride !== null) return _viewDayOverride;
    var data = getAll();
    if (!data) return 1;
    var start = new Date(data.settings.startDate);
    var now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - start) / 86400000) + 1;
    return Math.min(Math.max(diff, 1), 14);
  }

  function getRealCurrentDay() {
    var data = getAll();
    if (!data) return 1;
    var start = new Date(data.settings.startDate);
    var now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    var diff = Math.floor((now - start) / 86400000) + 1;
    return Math.min(Math.max(diff, 1), 14);
  }

  function setViewDay(day) {
    var d = parseInt(day, 10);
    if (d >= 1 && d <= 14) {
      _viewDayOverride = d;
    }
  }

  function clearViewDay() {
    _viewDayOverride = null;
  }

  function getViewDay() {
    return _viewDayOverride;
  }

  function getDayProgress(day) {
    var data = getAll();
    return (data && data.dailyProgress[day]) || null;
  }

  function saveDayProgress(day, module, result) {
    var data = getAll();
    if (!data.dailyProgress[day]) {
      data.dailyProgress[day] = { date: new Date().toISOString().split('T')[0] };
    }
    data.dailyProgress[day][module] = result;
    data.lastActiveDate = new Date().toISOString().split('T')[0];
    updateStreak(data);
    saveAll(data);
    return data;
  }

  function addWeakVocabulary(word) {
    var data = getAll();
    if (data.weakPoints.vocabulary.indexOf(word) === -1) {
      data.weakPoints.vocabulary.push(word);
      if (data.weakPoints.vocabulary.length > 50) data.weakPoints.vocabulary.shift();
      saveAll(data);
    }
  }

  function addWeakSentence(sentence) {
    var data = getAll();
    if (data.weakPoints.sentences.indexOf(sentence) === -1) {
      data.weakPoints.sentences.push(sentence);
      if (data.weakPoints.sentences.length > 30) data.weakPoints.sentences.shift();
      saveAll(data);
    }
  }

  function addQuizError(day, questionIndex, type) {
    var data = getAll();
    data.weakPoints.quizErrors.push({
      day: day,
      questionIndex: questionIndex,
      type: type,
      date: new Date().toISOString()
    });
    if (data.weakPoints.quizErrors.length > 100) data.weakPoints.quizErrors.shift();
    saveAll(data);
  }

  function exportJSON() {
    var data = getAll();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'biz-english-backup-' + new Date().toISOString().split('T')[0] + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var data = JSON.parse(e.target.result);
          if (data.settings && data.dailyProgress) {
            saveAll(data);
            resolve(data);
          } else {
            reject(new Error('无效的备份文件格式'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  }

  function reset() {
    var data = JSON.parse(JSON.stringify(defaultData));
    saveAll(data);
    return data;
  }

  return {
    init: init,
    getAll: getAll,
    saveAll: saveAll,
    get: get,
    set: set,
    getCurrentDay: getCurrentDay,
    getRealCurrentDay: getRealCurrentDay,
    setViewDay: setViewDay,
    clearViewDay: clearViewDay,
    getViewDay: getViewDay,
    getDayProgress: getDayProgress,
    saveDayProgress: saveDayProgress,
    addWeakVocabulary: addWeakVocabulary,
    addWeakSentence: addWeakSentence,
    addQuizError: addQuizError,
    exportJSON: exportJSON,
    importJSON: importJSON,
    reset: reset
  };
})();
