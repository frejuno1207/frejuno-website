// 物件詳細ページ

function getPropertyIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

function getPropertyData(id) {
    if (typeof properties !== 'undefined') {
        return properties.find(p => p.id == id);
    }
    return null;
}

function isSoldProperty(property) {
    return property?.status === 'sold';
}

function initPropertyDetail() {
    const propertyId = getPropertyIdFromURL();
    const property = getPropertyData(propertyId);

    if (!property) {
        document.querySelector('main').innerHTML = '<section><div class="container"><p>物件が見つかりませんでした。</p></div></section>';
        return;
    }

    if (isSoldProperty(property)) {
        renderSoldAchievement(property);
        return;
    }

    renderActiveProperty(property);
}

function renderActiveProperty(property) {
    document.getElementById('property-title').textContent = property.title;
    const priceDisplay = property.type.includes('売')
        ? `¥${(property.price / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}万円`
        : `¥${property.price.toLocaleString()}/月`;
    document.getElementById('property-price').textContent = priceDisplay;

    const gallery = document.getElementById('property-gallery');
    if (property.images && property.images.length > 0) {
        gallery.innerHTML = `
            <div class="gallery-main">
                <img src="${property.images[0]}" alt="${property.title}" id="gallery-main-image">
            </div>
            <div class="gallery-thumbnails">
                ${property.images.map((img, index) => `
                    <img src="${img}"
                         alt="${property.title}"
                         class="gallery-thumbnail ${index === 0 ? 'active' : ''}"
                         data-index="${index}"
                         onclick="changeMainImage('${img}', ${index})">
                `).join('')}
            </div>
        `;
    }

    document.getElementById('property-description').innerHTML = `<p>${property.description}</p>`;
    document.getElementById('property-features').innerHTML = property.features.map(f => `<div class="feature-badge">${f}</div>`).join('');

    const specs = document.getElementById('property-specs');
    specs.innerHTML = `
        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">物件情報</h3>
        <div class="spec-item"><span class="spec-label">価格</span><span class="spec-value">${priceDisplay}</span></div>
        <div class="spec-item"><span class="spec-label">間取り</span><span class="spec-value">${property.layout}</span></div>
        <div class="spec-item"><span class="spec-label">建物面積</span><span class="spec-value">${property.area}㎡</span></div>
        ${property.landArea ? `<div class="spec-item"><span class="spec-label">土地面積</span><span class="spec-value">${property.landArea}㎡</span></div>` : ''}
        <div class="spec-item"><span class="spec-label">築年数</span><span class="spec-value">築${property.age}年</span></div>
        <div class="spec-item"><span class="spec-label">構造</span><span class="spec-value">${property.structure}</span></div>
        <div class="spec-item"><span class="spec-label">建築年月</span><span class="spec-value">${property.builtDate}</span></div>
        <div class="spec-item"><span class="spec-label">交通</span><span class="spec-value">${property.station} 徒歩${property.walk}分</span></div>
        <div class="spec-item"><span class="spec-label">所在地</span><span class="spec-value">${property.address}</span></div>
        <div class="spec-item"><span class="spec-label">現況</span><span class="spec-value">${property.condition}</span></div>
        <div class="spec-item"><span class="spec-label">引渡</span><span class="spec-value">${property.delivery}</span></div>
        <div class="spec-item"><span class="spec-label">取引態様</span><span class="spec-value">${property.transaction}</span></div>
    `;

    if (property.lat && property.lng && typeof initPropertyMap === 'function') {
        initPropertyMap(property.lat, property.lng, property.title, property.address);
    }
}

function renderSoldAchievement(property) {
    document.title = `成約実績 | ${property.publicTitle} - 株式会社Frejuno`;
    document.getElementById('property-title').textContent = `${property.publicTitle} / 成約実績`;
    document.getElementById('property-price').textContent = 'SOLD';

    const notice = document.getElementById('property-notice');
    const ctaTitle = document.getElementById('cta-title');
    const ctaText = document.getElementById('cta-text');
    const ctaPrimary = document.getElementById('cta-primary');
    const ctaSecondary = document.getElementById('cta-secondary');
    const mapSection = document.getElementById('property-map-section');

    if (notice) {
        notice.innerHTML = `
            <div class="sold-property-notice">
                <strong>成約済み物件のご案内です。</strong><br>
                売約済みのため、所在地・価格・詳細図面・室内状況などの情報は公開粒度を落として掲載しています。
            </div>
        `;
    }

    const gallery = document.getElementById('property-gallery');
    gallery.innerHTML = `
        <div class="gallery-main sold-gallery-main">
            <img src="${property.images?.[0] || property.image}" alt="${property.publicTitle}" id="gallery-main-image">
            <div class="sold-image-overlay">特定防止のため画像をぼかして掲載しています</div>
        </div>
        <div class="gallery-thumbnails">
            ${(property.images || [property.image]).slice(0, 6).map((img, index) => `
                <img src="${img}"
                     alt="${property.publicTitle}"
                     class="gallery-thumbnail sold-thumbnail ${index === 0 ? 'active' : ''}"
                     data-index="${index}"
                     onclick="changeMainImage('${img}', ${index})">
            `).join('')}
        </div>
    `;

    document.getElementById('property-description').innerHTML = `
        <p>${property.publicSummary}</p>
        <p>売約済み物件については、実績紹介として必要最小限の情報に調整しています。より詳しい売却・購入相談はお問い合わせください。</p>
    `;

    document.getElementById('property-features').innerHTML = property.publicFeatures.map(f => `<div class="feature-badge">${f}</div>`).join('');

    document.getElementById('property-specs').innerHTML = `
        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">掲載情報</h3>
        <div class="spec-item"><span class="spec-label">掲載区分</span><span class="spec-value">成約実績</span></div>
        <div class="spec-item"><span class="spec-label">エリア</span><span class="spec-value">${property.publicAreaLabel || '松山市内'}</span></div>
        <div class="spec-item"><span class="spec-label">物件種別</span><span class="spec-value">中古一戸建て</span></div>
        <div class="spec-item"><span class="spec-label">公開状態</span><span class="spec-value">売約済み</span></div>
        <div class="spec-item"><span class="spec-label">備考</span><span class="spec-value">詳細情報は非公開化しています</span></div>
    `;

    if (ctaTitle) ctaTitle.textContent = '売却・住み替えのご相談はこちら';
    if (ctaText) ctaText.textContent = '同様エリアの売却相談、住み替え相談、購入相談はお気軽にお問い合わせください。';
    if (ctaPrimary) {
        ctaPrimary.textContent = '売却・購入を相談する';
        ctaPrimary.href = 'contact.html?service=assessment';
    }
    if (ctaSecondary) {
        ctaSecondary.textContent = 'お問い合わせフォーム';
        ctaSecondary.href = 'contact.html';
    }
    if (mapSection) {
        mapSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">掲載ポリシー</h2>
                <p style="max-width: 760px; margin: 0 auto; text-align: center; line-height: 1.9; color: #555;">
                    売約済み物件は、販売中物件と同じ粒度では掲載せず、実績紹介として物件特定につながりにくい情報のみを掲載しています。
                </p>
            </div>
        `;
    }
}

window.changeMainImage = function(imageSrc, index) {
    const mainImage = document.getElementById('gallery-main-image');
    if (mainImage) mainImage.src = imageSrc;

    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initPropertyDetail();
});

window.addEventListener('frejuno:maps-ready', () => {
    const property = getPropertyData(getPropertyIdFromURL());
    if (property && !isSoldProperty(property) && property.lat && property.lng && typeof initPropertyMap === 'function') {
        initPropertyMap(property.lat, property.lng, property.title, property.address);
    }
});
