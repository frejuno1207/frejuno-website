// ヒーロースライドショー - 時間でクロスフェード切り替え

const heroImages = [
    'images/hero-01.png',
    'images/hero-02.png',
    'images/hero-03.png',
    'images/hero-04.png',
    'images/hero-05.png'
];

let currentIndex = 0;
const SLIDE_DURATION = 5000; // 5秒ごとに切り替え

function initHeroSlider() {
    const heroBg1 = document.querySelector('.hero-bg-1');
    const heroBg2 = document.querySelector('.hero-bg-2');
    
    if (!heroBg1 || !heroBg2) return;
    
    // 最初の画像を設定
    heroBg1.style.backgroundImage = `url('${heroImages[0]}')`;
    heroBg1.classList.add('active');
    
    // 定期的に画像を切り替え
    setInterval(() => {
        const nextIndex = (currentIndex + 1) % heroImages.length;
        
        if (currentIndex % 2 === 0) {
            // bg1 → bg2
            heroBg2.style.backgroundImage = `url('${heroImages[nextIndex]}')`;
            heroBg2.classList.add('active');
            heroBg1.classList.remove('active');
        } else {
            // bg2 → bg1
            heroBg1.style.backgroundImage = `url('${heroImages[nextIndex]}')`;
            heroBg1.classList.add('active');
            heroBg2.classList.remove('active');
        }
        
        currentIndex = nextIndex;
    }, SLIDE_DURATION);
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', initHeroSlider);
