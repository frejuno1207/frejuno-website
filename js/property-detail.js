// 物件詳細ページ

// URLパラメータから物件IDを取得
function getPropertyIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// 物件データを取得（properties.jsから）
function getPropertyData(id) {
    // properties.jsのデータを使用
    if (typeof properties !== 'undefined') {
        return properties.find(p => p.id == id);
    }
    
    // フォールバック: デフォルトデータ
    return {
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
    };
}

// ページを初期化
function initPropertyDetail() {
    const propertyId = getPropertyIdFromURL();
    const property = getPropertyData(propertyId);
    
    if (!property) {
        document.querySelector('.container').innerHTML = '<p>物件が見つかりませんでした。</p>';
        return;
    }
    
    // タイトルと価格
    document.getElementById('property-title').textContent = property.title;
    const priceDisplay = property.type.includes('売') 
        ? `¥${(property.price / 10000).toLocaleString(undefined, {maximumFractionDigits: 0})}万円` 
        : `¥${property.price.toLocaleString()}/月`;
    document.getElementById('property-price').textContent = priceDisplay;
    
    // ギャラリー
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
    
    // 説明
    document.getElementById('property-description').innerHTML = `<p>${property.description}</p>`;
    
    // 特徴
    const featuresGrid = document.getElementById('property-features');
    featuresGrid.innerHTML = property.features.map(f => `
        <div class="feature-badge">${f}</div>
    `).join('');
    
    // スペック
    const specs = document.getElementById('property-specs');
    specs.innerHTML = `
        <h3 style="color: var(--color-primary); margin-bottom: 1rem;">物件情報</h3>
        <div class="spec-item">
            <span class="spec-label">価格</span>
            <span class="spec-value">${priceDisplay}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">間取り</span>
            <span class="spec-value">${property.layout}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">建物面積</span>
            <span class="spec-value">${property.area}㎡</span>
        </div>
        ${property.landArea ? `
        <div class="spec-item">
            <span class="spec-label">土地面積</span>
            <span class="spec-value">${property.landArea}㎡</span>
        </div>
        ` : ''}
        <div class="spec-item">
            <span class="spec-label">築年数</span>
            <span class="spec-value">築${property.age}年</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">構造</span>
            <span class="spec-value">${property.structure}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">建築年月</span>
            <span class="spec-value">${property.builtDate}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">交通</span>
            <span class="spec-value">${property.station} 徒歩${property.walk}分</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">所在地</span>
            <span class="spec-value">${property.address}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">現況</span>
            <span class="spec-value">${property.condition}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">引渡</span>
            <span class="spec-value">${property.delivery}</span>
        </div>
        <div class="spec-item">
            <span class="spec-label">取引態様</span>
            <span class="spec-value">${property.transaction}</span>
        </div>
        ${property.reform ? `
        <div style="margin-top: 2rem;">
            <h4 style="color: var(--color-primary); margin-bottom: 0.5rem;">リフォーム履歴</h4>
            <p style="font-size: 0.9rem; line-height: 1.6;">
                <strong>水回り:</strong><br>${property.reform.bathroom}<br><br>
                <strong>内装:</strong><br>${property.reform.interior}
            </p>
        </div>
        ` : ''}
    `;
}

// ギャラリーのメイン画像を変更（グローバル関数）
window.changeMainImage = function(imageSrc, index) {
    const mainImage = document.getElementById('gallery-main-image');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
    
    // アクティブなサムネイルを更新
    document.querySelectorAll('.gallery-thumbnail').forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
};

/**
 * 物件の位置を地図に表示
 */
function initPropertyMap(property) {
    const mapElement = document.getElementById('property-map');
    const addressElement = document.getElementById('property-address');
    
    console.log('initPropertyMap called with property:', property);
    
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    if (!property) {
        console.error('Property data not provided');
        mapElement.innerHTML = '<p style="text-align: center; padding: 50px; color: #999;">物件データが見つかりません</p>';
        return;
    }
    
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps API not loaded');
        mapElement.innerHTML = '<p style="text-align: center; padding: 50px; color: #999;">地図を読み込めませんでした</p>';
        return;
    }
    
    if (!property.lat || !property.lng) {
        console.error('Property coordinates missing:', property);
        mapElement.innerHTML = '<p style="text-align: center; padding: 50px; color: #999;">位置情報が登録されていません</p>';
        return;
    }
    
    console.log('Initializing map with coordinates:', property.lat, property.lng);
    
    // 地図を初期化
    const map = new google.maps.Map(mapElement, {
        zoom: 16,
        center: { lat: property.lat, lng: property.lng },
        mapTypeId: 'roadmap'
    });
    
    // マーカーを配置
    const marker = new google.maps.Marker({
        position: { lat: property.lat, lng: property.lng },
        map: map,
        title: property.title
    });
    
    // 情報ウィンドウを追加
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h4 style="margin: 0 0 5px 0;">${property.title}</h4>
                <p style="margin: 5px 0; color: #666;">${property.address}</p>
                <p style="margin: 5px 0; color: #C9A87C; font-weight: bold;">
                    ${property.station} 徒歩${property.walk}分
                </p>
            </div>
        `
    });
    
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
    
    // 住所を表示
    if (addressElement) {
        addressElement.textContent = `${property.address} | ${property.station} 徒歩${property.walk}分`;
    }
    
    console.log('Map initialized successfully');
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - Starting property detail initialization');
    
    // 物件詳細を初期化
    initPropertyDetail();
    
    // Google Maps APIが読み込まれるのを待ってから地図を初期化
    const initMapWhenReady = () => {
        if (typeof google !== 'undefined' && google.maps) {
            console.log('Google Maps API ready, initializing property map');
            const propertyId = getPropertyIdFromURL();
            console.log('Property ID from URL:', propertyId);
            
            const property = getPropertyData(propertyId);
            console.log('Property data:', property);
            
            if (property) {
                initPropertyMap(property);
            } else {
                console.error('Property not found for ID:', propertyId);
            }
        } else {
            console.log('Google Maps API not ready, retrying in 100ms...');
            setTimeout(initMapWhenReady, 100);
        }
    };
    
    // 少し遅延させてから地図初期化を試みる
    setTimeout(initMapWhenReady, 300);
});
