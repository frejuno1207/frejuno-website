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

console.log('✨ Frejuno Gallery Experience loaded');
