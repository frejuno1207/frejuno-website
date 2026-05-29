/*!
 * FREJUNO 診断ページ共通ナビゲーション
 * 各HTMLの<head>から <script src="/assets/diagnosis-nav.js"></script> で読み込む
 */
(function() {
  var NAV_HTML = '' +
    '<nav class="dx-nav" id="dxNav">' +
      '<div class="dx-nav-inner">' +
        '<a class="dx-nav-brand" href="/diagnosis/diagnosis_lp.html">' +
          '<span class="dx-brand-mark">F</span>' +
          '<span class="dx-brand-text">FREJUNO <span class="dx-brand-accent">松山住まい診断</span></span>' +
        '</a>' +
        '<button class="dx-nav-toggle" id="dxNavToggle" aria-label="メニュー" aria-expanded="false">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<ul class="dx-nav-menu" id="dxNavMenu">' +
          '<li><a href="/diagnosis/diagnosis_lp.html" data-key="lp">診断TOP</a></li>' +
          '<li><a href="/diagnosis/mvp_type_diagnosis_v3.html" data-key="diag">タイプ診断</a></li>' +
          '<li><a href="/types/" data-key="types">16タイプ一覧</a></li>' +
          '<li><a href="/me/" data-key="me">あなたの結果</a></li>' +
          '<li><a href="/diagnosis/conditions.html" data-key="cond">希望条件入力</a></li>' +
          '<li><a href="https://line.me/R/ti/p/%40225zymbg" target="_blank" rel="noopener" data-key="line">LINE相談</a></li>' +
          '<li class="dx-nav-sep"><a href="https://frejuno.com/" data-key="home">FREJUNO本体 →</a></li>' +
        '</ul>' +
      '</div>' +
    '</nav>';

  var NAV_CSS = '' +
    '.dx-nav{position:sticky;top:0;z-index:1000;background:#fff;border-bottom:1px solid #eef1f4;box-shadow:0 1px 0 rgba(0,0,0,0.02);font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic","Meiryo",sans-serif;}' +
    '.dx-nav-inner{max-width:1100px;margin:0 auto;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;gap:16px;position:relative;}' +
    '.dx-nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#2c3e50;font-weight:700;font-size:14px;flex-shrink:0;}' +
    '.dx-brand-mark{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#2c5f7e,#4a9b8e);color:#fff;font-weight:800;font-size:14px;}' +
    '.dx-brand-accent{color:#d97744;font-weight:700;}' +
    '.dx-nav-menu{display:flex;align-items:center;gap:4px;list-style:none;padding:0;margin:0;}' +
    '.dx-nav-menu li a{display:block;padding:8px 12px;color:#5b6b7c;font-size:13px;font-weight:600;text-decoration:none;border-radius:6px;transition:background 0.15s,color 0.15s;}' +
    '.dx-nav-menu li a:hover{background:#f4f7fa;color:#2c5f7e;}' +
    '.dx-nav-menu li a.is-current{background:#eef5f9;color:#2c5f7e;}' +
    '.dx-nav-menu li.dx-nav-sep{margin-left:8px;border-left:1px solid #eef1f4;padding-left:8px;}' +
    '.dx-nav-toggle{display:none;background:none;border:none;cursor:pointer;padding:8px;}' +
    '.dx-nav-toggle span{display:block;width:22px;height:2px;background:#2c3e50;margin:4px 0;border-radius:2px;transition:transform 0.2s,opacity 0.2s;}' +
    '.dx-nav-toggle.is-open span:nth-child(1){transform:translateY(6px) rotate(45deg);}' +
    '.dx-nav-toggle.is-open span:nth-child(2){opacity:0;}' +
    '.dx-nav-toggle.is-open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}' +
    '@media (max-width:780px){' +
      '.dx-nav-menu{position:absolute;top:100%;left:0;right:0;background:#fff;flex-direction:column;align-items:stretch;padding:8px;gap:2px;box-shadow:0 8px 24px rgba(0,0,0,0.08);display:none;border-radius:0 0 12px 12px;}' +
      '.dx-nav-menu.is-open{display:flex;}' +
      '.dx-nav-menu li a{padding:12px 14px;font-size:14px;border-radius:8px;}' +
      '.dx-nav-menu li.dx-nav-sep{border-left:none;border-top:1px solid #eef1f4;padding-left:0;padding-top:8px;margin-top:6px;margin-left:0;}' +
      '.dx-nav-toggle{display:block;}' +
      '.dx-brand-text{font-size:13px;}' +
    '}';

  var styleEl = document.createElement('style');
  styleEl.id = 'dxNavStyle';
  styleEl.textContent = NAV_CSS;
  (document.head || document.documentElement).appendChild(styleEl);

  function init() {
    if (document.getElementById('dxNav')) return;

    var wrap = document.createElement('div');
    wrap.innerHTML = NAV_HTML;
    var nav = wrap.firstElementChild;
    document.body.insertBefore(nav, document.body.firstChild);

    var toggle = document.getElementById('dxNavToggle');
    var menu = document.getElementById('dxNavMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        var isOpen = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var path = location.pathname;
    var current = null;
    if (path.indexOf('/diagnosis/diagnosis_lp') >= 0) current = 'lp';
    else if (path.indexOf('/diagnosis/mvp_type_diagnosis') >= 0) current = 'diag';
    else if (path.indexOf('/diagnosis/conditions') >= 0) current = 'cond';
    else if (path.indexOf('/types/') >= 0 || path.match(/\/types\/[A-Z]{4}\.html/)) current = 'types';
    else if (path.indexOf('/me/') >= 0) current = 'me';
    if (current) {
      var el = document.querySelector('.dx-nav-menu a[data-key="' + current + '"]');
      if (el) el.classList.add('is-current');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
