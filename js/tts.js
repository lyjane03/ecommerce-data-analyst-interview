var AppTTS = (function () {
  var synth = window.speechSynthesis;
  var currentUtterance = null;
  var voices = [];
  var preferredVoice = null;
  var currentRate = 1.0;

  function loadVoices() {
    voices = synth ? synth.getVoices() : [];
    preferredVoice =
      voices.find(function (v) { return v.lang === 'en-US' && /samantha/i.test(v.name); }) ||
      voices.find(function (v) { return v.lang === 'en-US' && v.localService; }) ||
      voices.find(function (v) { return v.lang === 'en-US'; }) ||
      voices.find(function (v) { return v.lang.indexOf('en') === 0; }) ||
      voices[0] || null;
  }

  if (synth) {
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }

  function speak(text, options) {
    if (!synth) { alert('浏览器不支持语音合成'); return; }
    stop();
    options = options || {};
    var utterance = new SpeechSynthesisUtterance(text);
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.lang = 'en-US';
    utterance.rate = options.rate || currentRate;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    utterance.onend = function () {
      currentUtterance = null;
      if (options.onEnd) options.onEnd();
    };
    utterance.onerror = function (e) {
      currentUtterance = null;
      if (options.onError) options.onError(e);
    };
    currentUtterance = utterance;
    synth.speak(utterance);
  }

  function speakSentences(sentences, options) {
    options = options || {};
    var index = 0;
    var stopped = false;
    var onSentenceStart = options.onSentenceStart || function () {};
    var onSentenceEnd = options.onSentenceEnd || function () {};
    var onAllEnd = options.onAllEnd || function () {};

    function next() {
      if (stopped || index >= sentences.length) {
        if (!stopped) onAllEnd();
        return;
      }
      onSentenceStart(index, sentences[index]);
      speak(sentences[index], {
        rate: options.rate || currentRate,
        onEnd: function () {
          onSentenceEnd(index, sentences[index]);
          index++;
          if (!stopped) setTimeout(next, options.pause || 600);
        }
      });
    }

    next();
    return {
      stop: function () { stopped = true; stop(); }
    };
  }

  function stop() {
    if (synth) synth.cancel();
    currentUtterance = null;
  }

  function pause() {
    if (synth) synth.pause();
  }

  function resume() {
    if (synth) synth.resume();
  }

  function setRate(rate) {
    currentRate = rate;
  }

  function getRate() {
    return currentRate;
  }

  function isSpeaking() {
    return synth ? synth.speaking : false;
  }

  function isSupported() {
    return !!synth;
  }

  return {
    speak: speak,
    speakSentences: speakSentences,
    stop: stop,
    pause: pause,
    resume: resume,
    setRate: setRate,
    getRate: getRate,
    isSpeaking: isSpeaking,
    isSupported: isSupported
  };
})();
