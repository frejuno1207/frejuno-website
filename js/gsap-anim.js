/* Frejuno - GSAP scroll animations (additive, reduced-motion safe) */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  gsap.registerPlugin(ScrollTrigger);

  // 見出し・リード：下からフェードアップ
  gsap.utils.toArray('.section-title, .eyebrow, .home-section-lead, .area-lead, .guide-lead').forEach(function (el) {
    gsap.from(el, {
      opacity: 0, y: 28, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%' }
    });
  });

  // カード群：親を起点にスタッガーで出現
  var groups = [
    ['.consultation-grid', '.consultation-card'],
    ['.features-grid', '.feature-card'],
    ['.services-grid', '.service-card'],
    ['.area-grid', '.area-card'],
    ['.intent-list', ':scope > div'],
    ['.guide-card-grid', '.guide-card'],
    ['.contact-choice-grid', '.contact-choice-card'],
    ['.home-area-list', 'span']
  ];
  groups.forEach(function (pair) {
    document.querySelectorAll(pair[0]).forEach(function (group) {
      var items = group.querySelectorAll(pair[1]);
      if (!items.length) return;
      gsap.from(items, {
        opacity: 0, y: 36, duration: 0.8, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: group, start: 'top 82%' }
      });
    });
  });

  // 非同期描画される物件ブロックは load 後に反映
  window.addEventListener('load', function () {
    var rp = document.getElementById('recommended-properties');
    if (rp) {
      gsap.from(rp, {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: rp, start: 'top 88%' }
      });
    }
    ScrollTrigger.refresh();
  });
})();
