// 物件データ
const properties = [
    {
        id: 1,
        status: 'sold',
        type: '売中古一戸建',
        title: '松山市 鷹子町 3SLDK',
        publicTitle: '松山市内 / 中古一戸建て',
        publicAreaLabel: '松山市内',
        publicSummary: 'ファミリー向けの中古一戸建ての成約実績です。売約済みのため、詳細情報は実績紹介向けの粒度に調整しています。',
        publicFeatures: ['中古一戸建て', 'ファミリー向け', '成約実績'],
        price: 25300000,
        layout: '3SLDK',
        area: 84.45,
        age: 20,
        station: '鷹ノ子駅',
        walk: 13,
        address: '愛媛県松山市鷹子町',
        landArea: 105.22,
        features: [
            '駐車場２台分',
            'オール電化',
            '全室2面採光',
            '閑静な住宅街',
            'カウンターキッチン',
            'IHクッキングヒーター',
            '追焚機能',
            'トイレ２ヶ所',
            '南向き',
            '角地',
            'バリアフリー'
        ],
        description: '閑静な住宅街の住戸、更に良好な日当たりが嬉しい全室２面採光の居室空間だから、日が長い夏場は照明代の節約にも。また広々とした延床面積８４．４５㎡の居室空間で、その上炎を使わず空気やキッチンを汚さないオール電化仕様は、スマートでらくちんなライフスタイルが魅力。ちなみに食後お皿を下げるのもスムーズなカウンターキッチンです。家族が帰宅を焦がれる３ＳＬＤＫ。',
        reform: {
            bathroom: '2022年10月 浴室、トイレ、洗面所',
            interior: '2026年1月 壁・天井（クロス・塗装等）、建具（室内ドア等）'
        },
        structure: '木造2階建',
        builtDate: '2006年2月',
        condition: '成約済',
        delivery: '---',
        transaction: '売主',
        athomeUrl: 'https://www.athome.co.jp/kodate/6989126396/',
        lat: 33.8199,
        lng: 132.8134,
        image: 'images/ogp-brand.png',
        images: [
            'images/ogp-brand.png'
        ]
    }
];

const activeProperties = properties.filter(property => property.status !== 'sold');
const soldProperties = properties.filter(property => property.status === 'sold');

let currentProperties = [...activeProperties];

function createPropertyCard(property) {
    const priceDisplay = property.type.includes('売')
        ? `¥${(property.price / 10000).toLocaleString(undefined, { maximumFractionDigits: 0 })}万円`
        : `¥${property.price.toLocaleString()}/月`;

    const ageDisplay = property.age === 0 ? '土地' : `築${property.age}年`;
    const landInfo = property.landArea ? ` / 土地${property.landArea}㎡` : '';

    return `
        <div class="property-card" onclick="location.href='property-detail.html?id=${property.id}'">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="property-info">
                <div class="property-price">${priceDisplay}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-details">
                    ${property.layout} | 建物${property.area}㎡${landInfo} | ${ageDisplay}<br>
                    ${property.station} 徒歩${property.walk}分
                </div>
                <div class="property-tags">
                    ${property.features.slice(0, 5).map(f => `<span class="property-tag">${f}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

function createSoldAchievementCard(property) {
    return `
        <div class="property-card sold-achievement-card" onclick="location.href='property-detail.html?id=${property.id}'">
            <div class="property-image sold-achievement-image" style="position: relative; overflow: hidden;">
                <img src="${property.image}" alt="${property.publicTitle}" style="filter: blur(16px) saturate(0.85); transform: scale(1.08);">
                <div class="sold-achievement-badge" style="position:absolute; top:12px; left:12px; background:rgba(44,44,44,0.82); color:#fff; padding:0.45rem 0.8rem; border-radius:999px; font-size:0.8rem; letter-spacing:0.04em;">成約実績</div>
            </div>
            <div class="property-info">
                <div class="property-price">SOLD</div>
                <div class="property-title">${property.publicTitle}</div>
                <div class="property-details">
                    ${property.publicSummary}
                </div>
                <div class="property-tags">
                    ${property.publicFeatures.map(f => `<span class="property-tag">${f}</span>`).join('')}
                </div>
                <div style="margin-top: 1rem; color: var(--color-primary); font-weight: 500;">実績紹介を見る →</div>
            </div>
        </div>
    `;
}

function displayProperties(propertiesToShow = currentProperties) {
    const container = document.getElementById('properties-list');
    const countElement = document.getElementById('properties-count');
    const noResults = document.getElementById('no-results');
    const mapSection = document.getElementById('properties-map-section');

    if (!container) return;

    if (propertiesToShow.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        if (countElement) countElement.textContent = '';
        if (mapSection) mapSection.style.display = 'none';
    } else {
        container.innerHTML = propertiesToShow.map(p => createPropertyCard(p)).join('');
        if (noResults) noResults.style.display = 'none';
        if (countElement) countElement.textContent = `${propertiesToShow.length}件の物件が見つかりました`;
        if (mapSection) mapSection.style.display = '';
    }
}

function displaySoldAchievements() {
    const container = document.getElementById('sold-achievements-list');
    if (!container) return;

    if (soldProperties.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666;">現在ご紹介できる成約実績はありません。</p>';
        return;
    }

    container.innerHTML = soldProperties.map(p => createSoldAchievementCard(p)).join('');
}

function applyFilters() {
    const typeFilter = document.getElementById('filter-type')?.value || '';
    const priceFilter = document.getElementById('filter-price')?.value || '';
    const layoutFilter = document.getElementById('filter-layout')?.value || '';

    currentProperties = activeProperties.filter(property => {
        if (typeFilter && property.type !== typeFilter) return false;

        if (priceFilter) {
            const [minRaw, maxRaw] = priceFilter.split('-');
            const min = minRaw ? parseInt(minRaw, 10) : 0;
            const max = maxRaw ? parseInt(maxRaw, 10) : Infinity;
            if (property.price < min || property.price > max) return false;
        }

        if (layoutFilter && property.layout !== layoutFilter) return false;

        return true;
    });

    displayProperties(currentProperties);
}

function getPropertyTypeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type');
}

function renderHomeProperties(containerId = 'recommended-properties') {
    const container = document.getElementById(containerId);
    const sectionTitle = document.getElementById('home-property-section-title');
    const sectionCopy = document.getElementById('home-property-section-copy');
    if (!container) return;

    if (activeProperties.length > 0) {
        const recommendedProperties = activeProperties.slice(0, Math.min(activeProperties.length, 3));
        const isSingle = recommendedProperties.length === 1;
        const wrapperClass = isSingle ? '' : 'properties-grid';

        if (sectionTitle) sectionTitle.textContent = '公開中物件';
        if (sectionCopy) sectionCopy.textContent = '現在公開中の物件情報をご案内します。';

        container.innerHTML = `
            <div class="${wrapperClass}">
                ${recommendedProperties.map(property => createPropertyCard(property)).join('')}
            </div>
        `;
        return;
    }

    if (soldProperties.length > 0) {
        if (sectionTitle) sectionTitle.textContent = '成約実績';
        if (sectionCopy) sectionCopy.textContent = '現在公開中の物件はありません。成約実績の一例をご紹介します。';
        container.innerHTML = `
            <div style="max-width: 520px; margin: 0 auto;">
                ${createSoldAchievementCard(soldProperties[0])}
            </div>
        `;
        return;
    }

    container.innerHTML = '<p style="text-align: center; color: #666;">現在、掲載可能な物件はありません。</p>';
}

window.addEventListener('load', () => {
    const typeFromURL = getPropertyTypeFromURL();
    if (typeFromURL === 'rent') {
        currentProperties = activeProperties.filter(p => p.type.startsWith('賃貸'));
    } else if (typeFromURL === 'sale') {
        currentProperties = activeProperties.filter(p => p.type.startsWith('売'));
    } else {
        currentProperties = [...activeProperties];
    }

    displayProperties(currentProperties);
    displaySoldAchievements();
});

document.addEventListener('DOMContentLoaded', () => {
    const filters = ['filter-type', 'filter-price', 'filter-layout'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
});

function initPropertiesMap() {
    const mapElement = document.getElementById('properties-map');
    if (!mapElement || typeof google === 'undefined' || activeProperties.length === 0) return;

    const center = { lat: 33.84, lng: 132.79 };
    const map = new google.maps.Map(mapElement, {
        zoom: 12,
        center,
        mapTypeId: 'roadmap'
    });

    activeProperties.forEach(property => {
        if (property.lat && property.lng) {
            const marker = new google.maps.Marker({
                position: { lat: property.lat, lng: property.lng },
                map,
                title: property.title
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `
                    <div style="padding: 10px; min-width: 200px;">
                        <h4 style="margin: 0 0 5px 0; font-size: 16px;">${property.title}</h4>
                        <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #C9A87C;">
                            ${property.type.includes('売') ? '¥' + (property.price / 10000).toLocaleString() + '万円' : '¥' + property.price.toLocaleString() + '/月'}
                        </p>
                        <p style="margin: 5px 0; color: #666; font-size: 14px;">${property.layout} | ${property.area}㎡</p>
                        <a href="property-detail.html?id=${property.id}" style="color: #C9A87C; text-decoration: none; font-weight: bold;">詳細を見る →</a>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        }
    });
}

if (document.getElementById('properties-map')) {
    window.addEventListener('load', initPropertiesMap);
    window.addEventListener('frejuno:maps-ready', initPropertiesMap);
}
