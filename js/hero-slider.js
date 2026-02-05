// ヒーロースライドショー - 時間でフェード切り替え

const heroImages = [
    'images/hero-01.png',
    'images/hero-02.png',
    'images/hero-03.png',
    'images/hero-04.png',
    'images/hero-05.png'
];

let currentImageIndex = 0;
const SLIDE_DURATION = 5000; // 5秒ごとに切り替え
const FADE_DURATION = 1500; // 1.5秒でフェード

function initHeroSlider() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // 現在の背景画像を設定
    updateHeroBackground();
    
    // 定期的に画像を切り替え
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        updateHeroBackground();
    }, SLIDE_DURATION);
}

function updateHeroBackground() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    const nextImage = heroImages[currentImageIndex];
    
    // 新しい画像を設定（transitionはCSSで定義済み）
    // 透明度を下げて画像を見やすく（0.65）
    heroSection.style.backgroundImage = `linear-gradient(135deg, rgba(164, 139, 111, 0.65) 0%, rgba(121, 103, 85, 0.65) 100%), url('${nextImage}')`;
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initHeroSlider);
