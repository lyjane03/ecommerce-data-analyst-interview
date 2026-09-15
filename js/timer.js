var AppTimer = (function () {
  var timers = {};

  function create(id, totalSeconds, onTick, onComplete) {
    if (timers[id]) clearInterval(timers[id].interval);
    var state = {
      id: id,
      total: totalSeconds,
      remaining: totalSeconds,
      elapsed: 0,
      running: false,
      interval: null,
      onTick: onTick || function () {},
      onComplete: onComplete || function () {}
    };
    timers[id] = state;
    return state;
  }

  function start(id) {
    var t = timers[id];
    if (!t || t.running) return;
    t.running = true;
    t.interval = setInterval(function () {
      t.remaining--;
      t.elapsed++;
      t.onTick(t);
      if (t.remaining <= 0) {
        stop(id);
        t.onComplete(t);
      }
    }, 1000);
  }

  function pause(id) {
    var t = timers[id];
    if (!t) return;
    t.running = false;
    if (t.interval) clearInterval(t.interval);
    t.interval = null;
  }

  function stop(id) {
    var t = timers[id];
    if (!t) return;
    t.running = false;
    if (t.interval) clearInterval(t.interval);
    t.interval = null;
  }

  function reset(id) {
    var t = timers[id];
    if (!t) return;
    stop(id);
    t.remaining = t.total;
    t.elapsed = 0;
    t.onTick(t);
  }

  function getState(id) {
    return timers[id] || null;
  }

  function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    if (h > 0) {
      return h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function destroy(id) {
    if (timers[id]) {
      clearInterval(timers[id].interval);
      delete timers[id];
    }
  }

  function destroyAll() {
    for (var id in timers) {
      if (timers[id].interval) clearInterval(timers[id].interval);
    }
    timers = {};
  }

  return {
    create: create,
    start: start,
    pause: pause,
    stop: stop,
    reset: reset,
    getState: getState,
    formatTime: formatTime,
    destroy: destroy,
    destroyAll: destroyAll
  };
})();
