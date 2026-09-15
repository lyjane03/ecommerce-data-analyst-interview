var AppTranslator = (function () {
  var API_URL = 'https://api.mymemory.translated.net/get';
  var MAX_CHUNK = 450;
  var CHINESE_RE = /[\u4e00-\u9fff]/;

  function hasChinese(text) {
    return CHINESE_RE.test(text);
  }

  function splitIntoChunks(text) {
    if (text.length <= MAX_CHUNK) return [text];
    var sentences = text.replace(/([。！？.!?])/g, '$1\n').split('\n').filter(Boolean);
    var chunks = [];
    var current = '';
    for (var i = 0; i < sentences.length; i++) {
      var s = sentences[i].trim();
      if (!s) continue;
      if (current.length + s.length + 1 > MAX_CHUNK && current) {
        chunks.push(current);
        current = s;
      } else {
        current = current ? current + ' ' + s : s;
      }
    }
    if (current) chunks.push(current);
    if (chunks.length === 0) chunks.push(text.substring(0, MAX_CHUNK));
    return chunks;
  }

  function translateChunk(text) {
    var url = API_URL + '?q=' + encodeURIComponent(text) + '&langpair=zh-CN|en';
    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (data.responseStatus !== 200 && data.responseStatus !== '200') {
          throw new Error(data.responseDetails || 'Translation failed');
        }
        return data.responseData.translatedText || text;
      });
  }

  function toEnglish(text) {
    if (!text || !text.trim()) return Promise.resolve('');
    if (!hasChinese(text)) return Promise.resolve(text);

    var chunks = splitIntoChunks(text);
    var promises = chunks.map(function (chunk) {
      return translateChunk(chunk);
    });

    return Promise.all(promises).then(function (results) {
      return results.join(' ');
    });
  }

  function translateFields(fields) {
    var keys = Object.keys(fields);
    var result = {};
    var promises = keys.map(function (key) {
      return toEnglish(fields[key]).then(function (translated) {
        result[key] = translated;
      });
    });
    return Promise.all(promises).then(function () {
      return result;
    });
  }

  return {
    hasChinese: hasChinese,
    toEnglish: toEnglish,
    translateFields: translateFields
  };
})();
