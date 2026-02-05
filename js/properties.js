// 物件データ（At Homeから取得）
const properties = [
    {
        id: 1,
        type: '売中古一戸建',
        title: '松山市 鷹子町 3SLDK',
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
        condition: '空家',
        delivery: '相談',
        transaction: '売主',
        athomeUrl: 'https://www.athome.co.jp/kodate/6989126396/',
        lat: 33.8199,
        lng: 132.8134,
        image: 'images/property-takako-exterior-1.jpg',
        images: [
            'images/property-takako-exterior-1.jpg',
            'images/property-takako-exterior-2.jpg',
            'images/property-takako-exterior-3.jpg',
            'images/property-takako-exterior-4.jpg',
            'images/property-takako-living-1.jpg',
            'images/property-takako-living-2.jpg',
            'images/property-takako-kitchen.jpg',
            'images/property-takako-bath.jpg',
            'images/property-takako-entrance.jpg',
            'images/property-takako-washroom.jpg',
            'images/property-takako-toilet1f.jpg',
            'images/property-takako-toilet2f.jpg',
            'images/property-takako-bedroom.jpg',
            'images/property-takako-storage.jpg',
            'images/property-takako-stairs.jpg',
            'images/property-takako-floorplan.jpg'
        ]
    }
];

// 現在の物件リスト（フィルター適用後）
let currentProperties = [...properties];

/**
 * 物件カードを生成
 */
function createPropertyCard(property) {
    const priceDisplay = property.type.includes('売') 
        ? `¥${(property.price / 10000).toLocaleString(undefined, {maximumFractionDigits: 0})}万円` 
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

/**
 * 物件一覧を表示
 */
function displayProperties(propertiesToShow = currentProperties) {
    const container = document.getElementById('properties-list');
    const countElement = document.getElementById('properties-count');
    const noResults = document.getElementById('no-results');
    
    if (!container) return;
    
    if (propertiesToShow.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        countElement.textContent = '';
    } else {
        container.innerHTML = propertiesToShow.map(p => createPropertyCard(p)).join('');
        noResults.style.display = 'none';
        countElement.textContent = `${propertiesToShow.length}件の物件が見つかりました`;
    }
}

/**
 * フィルターを適用
 */
function applyFilters() {
    const typeFilter = document.getElementById('filter-type')?.value || '';
    const priceFilter = document.getElementById('filter-price')?.value || '';
    const layoutFilter = document.getElementById('filter-layout')?.value || '';
    
    currentProperties = properties.filter(property => {
        // 種別フィルター
        if (typeFilter && property.type !== typeFilter) {
            return false;
        }
        
        // 価格帯フィルター
        if (priceFilter) {
            const [min, max] = priceFilter.split('-').map(v => parseInt(v) || Infinity);
            if (property.price < min || property.price > max) {
                return false;
            }
        }
        
        // 間取りフィルター
        if (layoutFilter && property.layout !== layoutFilter) {
            return false;
        }
        
        return true;
    });
    
    displayProperties(currentProperties);
}

/**
 * URLパラメータから物件タイプを取得
 */
function getPropertyTypeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('type');
}

// ページ読み込み時に実行
window.addEventListener('load', () => {
    // URLパラメータから物件タイプを取得して自動フィルター
    const typeFromURL = getPropertyTypeFromURL();
    if (typeFromURL) {
        const filterType = document.getElementById('filter-type');
        if (filterType) {
            if (typeFromURL === 'rent') {
                // 賃貸物件を表示（実装は後で調整）
            } else if (typeFromURL === 'sale') {
                // 売買物件を表示
            }
        }
    }
    
    // 物件一覧を表示
    displayProperties();
});

// フィルター変更時にリアルタイム適用（オプション）
document.addEventListener('DOMContentLoaded', () => {
    const filters = ['filter-type', 'filter-price', 'filter-layout'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
        }
    });
});

/**
 * 物件マップを初期化
 */
function initPropertiesMap() {
    const mapElement = document.getElementById('properties-map');
    if (!mapElement || typeof google === 'undefined') return;
    
    // 松山市を中心に
    const center = { lat: 33.84, lng: 132.79 };
    const map = new google.maps.Map(mapElement, {
        zoom: 12,
        center: center,
        mapTypeId: 'roadmap'
    });
    
    // 各物件にマーカーを配置
    properties.forEach(property => {
        if (property.lat && property.lng) {
            const marker = new google.maps.Marker({
                position: { lat: property.lat, lng: property.lng },
                map: map,
                title: property.title
            });
            
            // クリック時に情報ウィンドウを表示
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

// 物件一覧ページでのみ地図を初期化
if (document.getElementById('properties-map')) {
    window.addEventListener('load', initPropertiesMap);
}
