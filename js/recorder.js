var AppRecorder = (function () {
  var mediaRecorder = null;
  var audioChunks = [];
  var audioBlob = null;
  var audioUrl = null;
  var stream = null;
  var recordingStartedAt = 0;
  var audioDurationSeconds = 0;

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
        audioDurationSeconds = 0;
        recordingStartedAt = Date.now();
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
        audioDurationSeconds = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
        resolve({ blob: audioBlob, url: audioUrl, durationSeconds: audioDurationSeconds, mimeType: type });
      };
      mediaRecorder.stop();
    });
  }

  function getAudioUrl() {
    return audioUrl;
  }

  function getAudioBlob() {
    return audioBlob;
  }

  function getAudioDurationSeconds() {
    return audioDurationSeconds;
  }

  function isRecording() {
    return mediaRecorder && mediaRecorder.state === 'recording';
  }

  function cleanup() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      try { mediaRecorder.stop(); } catch (e) {}
    }
    mediaRecorder = null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioUrl = null;
    audioBlob = null;
    audioChunks = [];
    recordingStartedAt = 0;
    audioDurationSeconds = 0;
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
    getAudioBlob: getAudioBlob,
    getAudioDurationSeconds: getAudioDurationSeconds,
    isRecording: isRecording,
    cleanup: cleanup
  };
})();
