var AppRecorder = (function () {
  var mediaRecorder = null;
  var audioChunks = [];
  var audioBlob = null;
  var audioUrl = null;
  var stream = null;

  function isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  function start() {
    if (!isSupported()) {
      alert('浏览器不支持录音功能，请使用 Chrome 或 Edge');
      return Promise.reject(new Error('Not supported'));
    }
    return navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (s) {
        stream = s;
        audioChunks = [];
        audioBlob = null;
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = null;

        var mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
        mediaRecorder = mimeType
          ? new MediaRecorder(s, { mimeType: mimeType })
          : new MediaRecorder(s);

        mediaRecorder.ondataavailable = function (e) {
          if (e.data.size > 0) audioChunks.push(e.data);
        };
        mediaRecorder.start();
      });
  }

  function stop() {
    return new Promise(function (resolve) {
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }
      mediaRecorder.onstop = function () {
        var type = mediaRecorder.mimeType || 'audio/webm';
        audioBlob = new Blob(audioChunks, { type: type });
        audioUrl = URL.createObjectURL(audioBlob);
        if (stream) {
          stream.getTracks().forEach(function (t) { t.stop(); });
        }
        resolve({ blob: audioBlob, url: audioUrl });
      };
      mediaRecorder.stop();
    });
  }

  function getAudioUrl() {
    return audioUrl;
  }

  function isRecording() {
    return mediaRecorder && mediaRecorder.state === 'recording';
  }

  function cleanup() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = null;
    audioBlob = null;
    audioChunks = [];
    if (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
    }
  }

  return {
    isSupported: isSupported,
    start: start,
    stop: stop,
    getAudioUrl: getAudioUrl,
    isRecording: isRecording,
    cleanup: cleanup
  };
})();
