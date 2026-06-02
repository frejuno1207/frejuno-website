/* Frejuno - セクション演出（強み=横帯 / サービス=ピン留め+部屋）全幅・モバイル有効 */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 区切り線：左→右に引かれる
  gsap.utils.toArray('.sec-divider span').forEach(function (el) {
    if (reduce) { el.style.transform = 'scaleX(1)'; return; }
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // サービス：ピン留め＋ロゴの部屋が灯る（全幅／モバイルでも有効）
  var panels = gsap.utils.toArray('.svc-panel');
  if (panels.length && !reduce) {
    var rooms = ['tl', 'tr', 'bl', 'br'].map(function (k) { return document.querySelector('.room-' + k); });
    var dots = gsap.utils.toArray('.svc-progress i');
    var setActive = function (idx) {
      rooms.forEach(function (r, i) { if (r) r.classList.toggle('on', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
    };
    gsap.set(panels[0], { opacity: 1, y: 0 });
    setActive(0);
    var stl = gsap.timeline({ scrollTrigger: {
      trigger: '.svc-pin', start: 'top top', end: '+=' + (panels.length * 520), pin: true, scrub: 0.5,
      onUpdate: function (self) { setActive(Math.min(panels.length - 1, Math.floor(self.progress * panels.length))); }
    }});
    panels.forEach(function (it, i) {
      if (i > 0) stl.fromTo(it, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, immediateRender: false }, i);
      var ln = it.querySelector('.s-line');
      if (ln) stl.fromTo(ln, { scaleX: 0 }, { scaleX: 1, duration: 0.4, immediateRender: false }, i + 0.12);
      if (i < panels.length - 1) stl.to(it, { opacity: 0, y: -40, duration: 0.5 }, i + 0.65);
    });
  }

  // 強み：エンドレス横帯
  window.addEventListener('load', function () {
    var track = document.getElementById('mqtrack');
    if (!track) return;
    if (reduce) return;
    track.innerHTML += track.innerHTML; // シームレス用に複製
    var half = track.scrollWidth / 2;
    var anim = gsap.to(track, { x: -half, duration: 30, ease: 'none', repeat: -1 });
    var row = document.getElementById('mqrow');
    if (row) {
      row.addEventListener('mouseenter', function () { gsap.to(anim, { timeScale: 0, duration: 0.5 }); });
      row.addEventListener('mouseleave', function () { gsap.to(anim, { timeScale: 1, duration: 0.5 }); });
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
})();
