// Frejuno Website メインスクリプト - アートギャラリー風アニメーション

// ===== 検索機能 =====
function setupSearch() {
    // PC用検索
    const headerSearchBtn = document.getElementById('header-search-btn');
    const headerSearchInput = document.getElementById('header-search-input');
    
    // モバイル用検索トグル
    const mobileSearchToggle = document.getElementById('mobile-search-toggle');
    const mobileSearchExpanded = document.getElementById('mobile-search-expanded');
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    // 検索実行関数
    function executeSearch(keyword) {
        if (!keyword || keyword.trim() === '') {
            alert('検索キーワードを入力してください');
            return;
        }
        
        // properties.htmlに遷移して検索パラメータを渡す
        window.location.href = `properties.html?search=${encodeURIComponent(keyword.trim())}`;
    }
    
    // PC用検索ボタン
    if (headerSearchBtn && headerSearchInput) {
        headerSearchBtn.addEventListener('click', () => {
            executeSearch(headerSearchInput.value);
        });
        
        headerSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                executeSearch(headerSearchInput.value);
            }
        });
    }
    
    // モバイル用検索トグル
    if (mobileSearchToggle && mobileSearchExpanded) {
        mobileSearchToggle.addEventListener('click', () => {
            const isExpanded = mobileSearchExpanded.classList.toggle('active');
            mobileSearchToggle.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded && mobileSearchInput) {
                setTimeout(() => {
                    mobileSearchInput.focus();
                }, 300);
            }
        });
        
        // モバイル検索実行
        if (mobileSearchBtn && mobileSearchInput) {
            mobileSearchBtn.addEventListener('click', () => {
                executeSearch(mobileSearchInput.value);
            });
            
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    executeSearch(mobileSearchInput.value);
                }
            });
        }
        
        // モバイル検索バー外をクリックしたら閉じる
        document.addEventListener('click', (e) => {
            if (mobileSearchExpanded.classList.contains('active') &&
                !mobileSearchExpanded.contains(e.target) &&
                !mobileSearchToggle.contains(e.target)) {
                mobileSearchExpanded.classList.remove('active');
                mobileSearchToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ページ読み込み時に検索機能を初期化
document.addEventListener('DOMContentLoaded', setupSearch);

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// スクロールアニメーション（Intersection Observer）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            // 一度表示したら監視を解除（パフォーマンス向上）
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// スクロールで表示する要素を監視
document.addEventListener('DOMContentLoaded', () => {
    // セクションタイトル
    document.querySelectorAll('.section-title').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
    
    // カード要素
    document.querySelectorAll('.feature-card, .service-card, .property-card').forEach((el, index) => {
        el.classList.add('scroll-reveal');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
});

// パララックス効果（軽量版）
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ページ読み込み時のフェードイン
document.body.classList.add('page-transition');

// ナビゲーションのアクティブ状態
const currentPath = window.location.pathname;
document.querySelectorAll('.nav a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
        link.style.color = '#C9A87C';
        link.style.fontWeight = '500';
    }
});

// ホバー時の3D効果（カード）
document.querySelectorAll('.property-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Swiperヒーロースライダー
document.addEventListener('DOMContentLoaded', () => {
    const heroSwiper = new Swiper('.hero-swiper', {
        // 基本設定
        loop: true,
        speed: 800,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        
        // 画像プリロード無効化（ブランク防止）
        preloadImages: false,
        
        // 自動再生
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            waitForTransition: true,
        },
        
        // ページインジケーター
        pagination: {
            el: '.hero-pagination',
            clickable: true,
            dynamicBullets: false,
        },
        
        // ナビゲーション矢印
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // レスポンシブ
        breakpoints: {
            320: {
                autoplay: {
                    delay: 4000,
                },
            },
            768: {
                autoplay: {
                    delay: 5000,
                },
            },
        },
        
        // アクセシビリティ
        a11y: {
            prevSlideMessage: '前のスライド',
            nextSlideMessage: '次のスライド',
            paginationBulletMessage: 'スライド %全%',
        },
    });
    
    // スライダー開始時のアニメーション
    heroSwiper.on('slideChange', function () {
        // スライド遷移時にテキストアニメーションをリセット
        const activeSlide = document.querySelector('.hero-slide.swiper-slide-active');
        if (activeSlide) {
            const title = activeSlide.querySelector('.hero-title');
            const subtitle = activeSlide.querySelector('.hero-subtitle');
            const buttons = activeSlide.querySelector('.hero-buttons');
            
            if (title) {
                title.style.opacity = '0';
                title.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    title.style.opacity = '1';
                    title.style.transform = 'translateY(0)';
                }, 100);
            }
            
            if (subtitle) {
                subtitle.style.opacity = '0';
                subtitle.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    subtitle.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
                    subtitle.style.opacity = '1';
                    subtitle.style.transform = 'translateY(0)';
                }, 100);
            }
            
            if (buttons) {
                buttons.style.opacity = '0';
                buttons.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    buttons.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
                    buttons.style.opacity = '1';
                    buttons.style.transform = 'translateY(0)';
                }, 100);
            }
        }
    });
    
    // 最初のスライドをアニメーション
    setTimeout(() => {
        const firstSlide = document.querySelector('.hero-slide.swiper-slide-active');
        if (firstSlide) {
            const title = firstSlide.querySelector('.hero-title');
            const subtitle = firstSlide.querySelector('.hero-subtitle');
            const buttons = firstSlide.querySelector('.hero-buttons');
            
            if (title) {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }
            if (subtitle) {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }
            if (buttons) {
                buttons.style.opacity = '1';
                buttons.style.transform = 'translateY(0)';
            }
        }
    }, 500);
});

console.log('✨ Frejuno Gallery Experience loaded');

// ===== ハンバーガーメニュー（改善版） =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger menu initializing (improved)...');
    
    const hamburger = document.getElementById('hamburger');
    const navMobileMenu = document.querySelector('.nav-mobile-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const body = document.body;
    
    console.log('hamburger:', hamburger);
    console.log('navMobileMenu:', navMobileMenu);
    console.log('navOverlay:', navOverlay);
    console.log('mobileMenuClose:', mobileMenuClose);
    
    if (!hamburger || !navMobileMenu || !navOverlay) {
        console.error('Required menu elements not found!');
        return;
    }
    
    // メニューを開く/閉じる関数
    function toggleMenu(forceClose = false) {
        const isActive = navMobileMenu.classList.contains('active');
        
        if (forceClose || isActive) {
            // メニューを閉じる
            hamburger.classList.remove('active');
            navMobileMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-label', 'メニューを開く');
            navOverlay.setAttribute('aria-hidden', 'true');
        } else {
            // メニューを開く
            hamburger.classList.add('active');
            navMobileMenu.classList.add('active');
            navOverlay.classList.add('active');
            body.classList.add('menu-open');
            hamburger.setAttribute('aria-label', 'メニューを閉じる');
            navOverlay.setAttribute('aria-hidden', 'false');
        }
    }
    
    // ハンバーガーアイコンをクリック
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Hamburger clicked!');
        toggleMenu();
    });
    
    // キーボードでハンバーガーアイコンを操作
    hamburger.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // 閉じるボタンをクリック
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            toggleMenu(true);
        });
    }
    
    // オーバーレイをクリック
    navOverlay.addEventListener('click', function() {
        toggleMenu(true);
    });
    
    // メニュー項目をクリックしたら閉じる
    navMobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            toggleMenu(true);
        });
    });
    
    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobileMenu.classList.contains('active')) {
            toggleMenu(true);
        }
    });
    
    console.log('✅ Hamburger menu improved version loaded');
});
