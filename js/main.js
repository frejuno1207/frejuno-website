// Frejuno Website メインスクリプト - アートギャラリー風アニメーション

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

// ハンバーガーメニュー機能
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const body = document.body;
    
    // メニューを開く/閉じる関数
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // ハンバーガーアイコンをクリックした時
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });
    
    // オーバーレイをクリックした時（メニューを閉じる）
    navOverlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    });
    
    // メニュー内のリンクをクリックした時（メニューを閉じる）
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            navOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        }
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

// ハンバーガーメニュー
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hamburger menu initializing...');
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const body = document.body;
    
    console.log('hamburger:', hamburger);
    console.log('navMenu:', navMenu);
    console.log('navOverlay:', navOverlay);
    
    if (hamburger && navMenu) {
        // ハンバーガーアイコンをクリック
        hamburger.addEventListener('click', function(e) {
            console.log('Hamburger clicked!');
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // オーバーレイをクリック
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            });
        }
        
        // メニュー項目をクリックしたら閉じる
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    } else {
        console.error('Hamburger menu elements not found!');
    }
});
