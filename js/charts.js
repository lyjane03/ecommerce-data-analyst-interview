var AppCharts = (function () {
  var colors = {
    listening: '#3b82f6',
    writing: '#8b5cf6',
    speaking: '#f59e0b',
    quiz: '#10b981',
    grid: '#e2e8f0',
    text: '#64748b',
    bg: '#ffffff'
  };

  function lineChart(canvas, datasets, options) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    options = options || {};
    var pad = { top: 30, right: 20, bottom: 40, left: 45 };
    var cw = w - pad.left - pad.right;
    var ch = h - pad.top - pad.bottom;
    var maxVal = options.maxVal || 100;
    var minVal = options.minVal || 0;
    var xLabels = options.xLabels || [];

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'right';

    for (var i = 0; i <= 4; i++) {
      var y = pad.top + ch - (ch * i / 4);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(Math.round(minVal + (maxVal - minVal) * i / 4), pad.left - 8, y + 4);
    }

    ctx.textAlign = 'center';
    var xStep = xLabels.length > 1 ? cw / (xLabels.length - 1) : cw;
    for (var i = 0; i < xLabels.length; i++) {
      var x = pad.left + i * xStep;
      ctx.fillText(xLabels[i], x, h - pad.bottom + 20);
    }

    for (var d = 0; d < datasets.length; d++) {
      var ds = datasets[d];
      var data = ds.data || [];
      if (data.length === 0) continue;

      ctx.strokeStyle = ds.color || '#3b82f6';
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      var step = data.length > 1 ? cw / (data.length - 1) : 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i] == null) continue;
        var x = pad.left + i * step;
        var y = pad.top + ch - (ch * (data[i] - minVal) / (maxVal - minVal));
        if (i === 0 || data[i - 1] == null) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = ds.color || '#3b82f6';
      for (var i = 0; i < data.length; i++) {
        if (data[i] == null) continue;
        var x = pad.left + i * step;
        var y = pad.top + ch - (ch * (data[i] - minVal) / (maxVal - minVal));
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (options.legend !== false && datasets.length > 0) {
      ctx.font = '12px system-ui, sans-serif';
      var lx = pad.left + 10;
      for (var d = 0; d < datasets.length; d++) {
        ctx.fillStyle = datasets[d].color || '#3b82f6';
        ctx.fillRect(lx, 8, 14, 10);
        ctx.fillStyle = colors.text;
        ctx.textAlign = 'left';
        ctx.fillText(datasets[d].label || '', lx + 18, 17);
        lx += ctx.measureText(datasets[d].label || '').width + 40;
      }
    }
  }

  function radarChart(canvas, labels, data, options) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    options = options || {};
    var cx = w / 2, cy = h / 2;
    var radius = Math.min(cx, cy) - 40;
    var maxVal = options.maxVal || 5;
    var n = labels.length;
    var angleStep = (Math.PI * 2) / n;
    var startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, w, h);

    for (var ring = 1; ring <= maxVal; ring++) {
      var r = radius * ring / maxVal;
      ctx.beginPath();
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      for (var i = 0; i <= n; i++) {
        var angle = startAngle + i * angleStep;
        var px = cx + r * Math.cos(angle);
        var py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (var i = 0; i < n; i++) {
      var angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.strokeStyle = colors.grid;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.stroke();

      var lx = cx + (radius + 18) * Math.cos(angle);
      var ly = cy + (radius + 18) * Math.sin(angle);
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], lx, ly);
    }

    var color = options.color || '#3b82f6';
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var idx = i % n;
      var val = (data[idx] || 0) / maxVal;
      var angle = startAngle + idx * angleStep;
      var px = cx + radius * val * Math.cos(angle);
      var py = cy + radius * val * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color + '33';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    for (var i = 0; i < n; i++) {
      var val = (data[i] || 0) / maxVal;
      var angle = startAngle + i * angleStep;
      var px = cx + radius * val * Math.cos(angle);
      var py = cy + radius * val * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  function progressRing(canvas, value, max, options) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    options = options || {};
    var cx = w / 2, cy = h / 2;
    var radius = Math.min(cx, cy) - 10;
    var lineWidth = options.lineWidth || 10;
    var pct = max > 0 ? value / max : 0;
    var color = options.color || '#3b82f6';

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.font = 'bold ' + (radius * 0.5) + 'px system-ui, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(pct * 100) + '%', cx, cy);
  }

  return {
    lineChart: lineChart,
    radarChart: radarChart,
    progressRing: progressRing,
    colors: colors
  };
})();
