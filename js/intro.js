/* Frejuno - 初回イントロ：間取りロゴが中央から線で描かれて現れる（Canvas 2D / 120fps想定）。
   セッション単位で1回のみ。html.intro-on が付いている時だけ再生（headで先行判定）。 */
(function () {
  if (!document.documentElement.classList.contains("intro-on")) return;

  var canvas = document.getElementById("frejunoIntroCanvas");
  var intro = document.querySelector(".frejuno-intro");
  var bloom = document.querySelector(".frejuno-bloom");
  var skipBtn = document.querySelector(".frejuno-skip");
  if (!canvas || !intro) { document.documentElement.classList.remove("intro-on"); return; }

  var ctx = canvas.getContext("2d");
  var source = new Image();
  var W = 4096, H = 4096;
  var duration = 7600;
  var playbackSpeed = 1.12;
  var previewMode = new URLSearchParams(window.location.search).get("preview") === "1";
  var fx = new URLSearchParams(window.location.search).get("fx");
  var start = 0, rafId = 0, redirectTimer = 0;
  var invertedCanvas, maskCanvas = null, maskCtx = null, pen = null;
  var dpr = 1, viewW = 0, viewH = 0, designScale = 1, designX = 0, designY = 0;

  source.src = "images/frejuno-floorplan-vertical-4k.png";

  function clamp(v, min, max) { min = min == null ? 0 : min; max = max == null ? 1 : max; return Math.min(max, Math.max(min, v)); }
  function smooth(v) { var t = clamp(v); return t * t * t * (t * (t * 6 - 15) + 10); }
  function phase(now, a, b) { return smooth((now - a) / (b - a)); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function resizeCanvas() {
    viewW = window.innerWidth; viewH = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
    canvas.style.width = viewW + "px"; canvas.style.height = viewH + "px";
    designScale = Math.min(viewW / W, viewH / H);
    designX = (viewW - W * designScale) / 2; designY = (viewH - H * designScale) / 2;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  }

  function beginFrame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    var bg = ctx.createRadialGradient(viewW * 0.5, viewH * 0.42, 0, viewW * 0.5, viewH * 0.6, Math.max(viewW, viewH) * 0.85);
    bg.addColorStop(0, "#FBF7F0"); bg.addColorStop(0.6, "#F2E9DB"); bg.addColorStop(1, "#E7DCC9");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, viewW, viewH);
    ctx.translate(designX, designY); ctx.scale(designScale, designScale);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  }

  function rect(x, y, w, h) { (pen || ctx).rect(x, y, w, h); }
  function poly(points) { var c = pen || ctx; c.moveTo(points[0][0], points[0][1]); for (var i = 1; i < points.length; i += 1) c.lineTo(points[i][0], points[i][1]); c.closePath(); }

  function drawMasked(alpha, makePath) {
    if (alpha <= 0) return;
    if (!maskCanvas) { maskCanvas = document.createElement("canvas"); maskCanvas.width = W; maskCanvas.height = H; maskCtx = maskCanvas.getContext("2d"); }
    maskCtx.setTransform(1, 0, 0, 1, 0, 0);
    maskCtx.clearRect(0, 0, W, H);
    maskCtx.globalCompositeOperation = "source-over";
    maskCtx.fillStyle = "#fff";
    pen = maskCtx; maskCtx.beginPath(); makePath(); maskCtx.fill(); pen = null;
    maskCtx.globalCompositeOperation = "source-in";
    maskCtx.drawImage(invertedCanvas, 0, 0, W, H);
    maskCtx.globalCompositeOperation = "source-over";
    ctx.save(); ctx.globalAlpha = clamp(alpha); ctx.drawImage(maskCanvas, 0, 0, W, H); ctx.restore();
  }

  function drawProgressiveRect(now, timing, box, direction, alpha) {
    direction = direction || "right"; alpha = alpha == null ? 1 : alpha;
    var t = phase(now, timing[0], timing[1]); if (t <= 0) return;
    var x = box[0], y = box[1], w = box[2], h = box[3];
    drawMasked(alpha, function () {
      if (direction === "down") rect(x, y, w, h * t);
      if (direction === "up") rect(x, y + h * (1 - t), w, h * t);
      if (direction === "right") rect(x, y, w * t, h);
      if (direction === "left") rect(x + w * (1 - t), y, w * t, h);
    });
  }

  function drawProgressivePoly(now, timing, startPoints, endPoints, alpha) {
    alpha = alpha == null ? 1 : alpha;
    var t = phase(now, timing[0], timing[1]); if (t <= 0) return;
    drawMasked(alpha, function () { poly(endPoints.map(function (pt, i) { return [lerp(startPoints[i][0], pt[0], t), lerp(startPoints[i][1], pt[1], t)]; })); });
  }

  function mirrorBox(b) { return [W - b[0] - b[2], b[1], b[2], b[3]]; }
  function mirrorPoints(points) { return points.map(function (p) { return [W - p[0], p[1]]; }); }

  function drawPairRect(now, timing, leftBox, direction, alpha) {
    var rightBox = mirrorBox(leftBox);
    if (direction === "down") { drawProgressiveRect(now, timing, leftBox, "down", alpha); drawProgressiveRect(now, timing, rightBox, "down", alpha); return; }
    drawProgressiveRect(now, timing, leftBox, "left", alpha); drawProgressiveRect(now, timing, rightBox, "right", alpha);
  }

  function drawPairPoly(now, timing, leftEnd, alpha) {
    var origin = [[2048, 1660], [2048, 1660], [2048, 1660], [2048, 1660]];
    drawProgressivePoly(now, timing, origin, leftEnd, alpha);
    drawProgressivePoly(now, timing, origin, mirrorPoints(leftEnd), alpha);
  }

  function setTransition(now) {
    var dot = phase(now, 6000, 6780);
    var page = phase(now, 6560, 7420);
    bloom.style.opacity = dot > 0 ? "1" : "0";
    bloom.style.transform = "translate(-50%, -50%) scale(" + (dot * 270) + ")";
    if (page > 0.72) intro.style.opacity = String(1 - page);
  }

  function drawBeamZoom(now) {
    var zoom = phase(now, 5700, 6750); if (zoom <= 0) return;
    ctx.save(); ctx.globalAlpha = zoom;
    var grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "rgba(199, 167, 131, 0)");
    grad.addColorStop(0.18, "rgba(199, 167, 131, " + (zoom * 0.16) + ")");
    grad.addColorStop(0.36, "rgba(207, 177, 145, " + (zoom * 0.64) + ")");
    grad.addColorStop(0.5, "rgba(239, 224, 205, 1)");
    grad.addColorStop(0.64, "rgba(207, 177, 145, " + (zoom * 0.64) + ")");
    grad.addColorStop(0.82, "rgba(199, 167, 131, " + (zoom * 0.16) + ")");
    grad.addColorStop(1, "rgba(199, 167, 131, 0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    var glow = ctx.createRadialGradient(W / 2, 1886, 10, W / 2, 1886, lerp(120, W * 1.15, zoom));
    glow.addColorStop(0, "rgba(255, 255, 255, " + (0.14 + zoom * 0.78) + ")");
    glow.addColorStop(0.42, "rgba(255, 255, 255, " + (zoom * 0.48) + ")");
    glow.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = phase(now, 6420, 7150); ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(W / 2, 1886, lerp(4, W * 0.9, ctx.globalAlpha), 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawWord(now) {
    var t = phase(now, 4300, 5500); if (t <= 0) return;
    var x = 663, y = 2670, w = 2796, h = 230;
    var cx = x + w / 2, cy = y + h / 2, sx = lerp(1.08, 1.0, t);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sx, 1); ctx.translate(-cx, -cy);
    drawMasked(t, function () { rect(x, y, w, h); });
    ctx.restore();
  }

  function drawGrid(now) {
    var t = phase(now, 0, 1100) * (1 - phase(now, 3700, 5200)); if (t <= 0.01) return;
    ctx.save(); ctx.globalAlpha = t * 0.07; ctx.strokeStyle = "#1B2740"; ctx.lineWidth = 2;
    var step = 512; ctx.beginPath();
    for (var gx = step; gx < W; gx += step) { ctx.moveTo(gx, 0); ctx.lineTo(gx, H); }
    for (var gy = step; gy < H; gy += step) { ctx.moveTo(0, gy); ctx.lineTo(W, gy); }
    ctx.stroke(); ctx.restore();
  }

  function drawGoldSweep(now) {
    var t = phase(now, 980, 1820); if (t <= 0 || t >= 1) return;
    var x = 1982, w = 132, y = 1718, h = 754, band = 170;
    var cy = y + h * (1 - t); var a = Math.sin(t * Math.PI) * 0.6;
    ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    var g = ctx.createLinearGradient(0, cy - band, 0, cy + band);
    g.addColorStop(0, "rgba(255,246,228,0)"); g.addColorStop(0.5, "rgba(255,246,228," + a + ")"); g.addColorStop(1, "rgba(255,246,228,0)");
    ctx.fillStyle = g; ctx.fillRect(x, cy - band, w, band * 2); ctx.restore();
  }

  function drawBuild(now) {
    var dotT = phase(now, 0, 360);
    drawMasked(dotT, function () { rect(1998, 1622, 103, 78); });
    drawProgressiveRect(now, [160, 960], [1982, 1718, 132, 754], "down");
    drawProgressiveRect(now, [690, 1500], [1998, 989, 106, 619], "up");
    drawPairRect(now, [1320, 2260], [1762, 1704, 88, 592], "down");
    drawPairRect(now, [1900, 3060], [1334, 1608, 714, 104], "out");
    drawPairRect(now, [2540, 3920], [1334, 1174, 714, 1051], "out", 0.92);
    drawPairPoly(now, [2920, 4220], [[2048, 1660], [1334, 1174], [1334, 1712], [2048, 1712]], 1);
    drawPairPoly(now, [3450, 4880], [[2048, 1660], [1334, 1712], [1334, 2221], [2048, 1712]], 1);
    drawWord(now);
    var seal = phase(now, 5080, 5980);
    drawMasked(seal * 0.82, function () { rect(1180, 900, 1740, 1650); });
    drawMasked(seal * 0.82, function () { rect(630, 2640, 2900, 280); });
    if (now >= 5920) {
      ctx.globalAlpha = clamp((now - 5920) / 360);
      ctx.drawImage(invertedCanvas, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }
  }

  function drawFrame(time) {
    if (!start) start = time;
    var now = (time - start) * playbackSpeed;
    beginFrame();
    setTransition(now);
    drawGrid(now);
    var logoFade = 1 - phase(now, 5850, 6640);
    ctx.save(); ctx.globalAlpha = logoFade;
    drawBuild(now);
    if (fx === "a") drawGoldSweep(now);
    ctx.restore();
    drawBeamZoom(now);
    if (now >= duration) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, viewW, viewH);
      bloom.style.display = "block"; bloom.style.opacity = "1";
      bloom.style.transform = "translate(-50%, -50%) scale(270)";
      if (!redirectTimer) redirectTimer = window.setTimeout(finishIntro, 360);
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }
  }

  function resetState() {
    intro.style.display = "grid"; intro.style.opacity = "1";
    bloom.style.display = "block"; bloom.style.opacity = "0";
    bloom.style.transform = "translate(-50%, -50%) scale(0)";
    window.clearTimeout(redirectTimer); redirectTimer = 0;
  }

  function play() { cancelAnimationFrame(rafId); resetState(); start = 0; rafId = requestAnimationFrame(drawFrame); }

  function finishIntro() {
    window.clearTimeout(redirectTimer);
    intro.style.transition = "opacity .6s ease"; intro.style.opacity = "0";
    if (skipBtn) skipBtn.style.display = "none";
    window.setTimeout(function () {
      intro.style.display = "none"; bloom.style.display = "none";
      document.documentElement.classList.remove("intro-on");
      if (window.ScrollTrigger) { try { window.ScrollTrigger.refresh(); } catch (e) {} }
    }, 650);
    if (!previewMode) { try { sessionStorage.setItem("frejuno_intro_seen", "1"); } catch (e) {} }
  }

  function startIntro() { invertedCanvas = source; resizeCanvas(); if (skipBtn) skipBtn.style.display = "block"; play(); }

  if (source.complete && source.naturalWidth) { startIntro(); }
  else { source.addEventListener("load", startIntro); source.addEventListener("error", function () { document.documentElement.classList.remove("intro-on"); intro.style.display = "none"; if (bloom) bloom.style.display = "none"; }); }

  if (skipBtn) skipBtn.addEventListener("click", function () { cancelAnimationFrame(rafId); finishIntro(); });
  window.addEventListener("resize", function () { if (!document.documentElement.classList.contains("intro-on")) return; resizeCanvas(); if (start) play(); });

  window.frejunoHomeIntro = { replay: function () { document.documentElement.classList.add("intro-on"); if (skipBtn) skipBtn.style.display = "block"; resizeCanvas(); play(); } };
})();
