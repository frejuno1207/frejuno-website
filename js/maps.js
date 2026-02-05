// Google Maps 統合

/**
 * 地図を初期化
 * @param {string} elementId - 地図を表示する要素のID
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} zoom - ズームレベル
 */
function initMap(elementId, lat, lng, zoom = 15) {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) {
        console.error('Map element not found:', elementId);
        return null;
    }
    
    const mapOptions = {
        center: { lat: lat, lng: lng },
        zoom: zoom,
        mapTypeId: 'roadmap'
    };
    
    const map = new google.maps.Map(mapElement, mapOptions);
    
    // マーカーを追加
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: '物件所在地'
    });
    
    return { map, marker };
}

/**
 * 会社所在地の地図を表示（about.htmlで使用）
 */
function initCompanyMap() {
    const { lat, lng } = CONFIG.COMPANY;
    const mapElement = document.getElementById('company-map');
    
    if (!mapElement) {
        console.error('Map element not found: company-map');
        return;
    }
    
    const { map, marker } = initMap('company-map', lat, lng, 16);
    
    if (marker) {
        // 情報ウィンドウを追加
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3>${CONFIG.COMPANY.name}</h3>
                    <p>${CONFIG.COMPANY.address}</p>
                    <p>TEL: ${CONFIG.COMPANY.phone}</p>
                    <p style="margin-top: 10px; color: #C9A87C; font-size: 12px;">
                        📍 クリックでGoogleマップを開く
                    </p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
    
    // 地図全体をクリック可能にする
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    // 地図エリアをクリッカブルにするためのオーバーレイを追加
    mapElement.style.cursor = 'pointer';
    mapElement.title = 'クリックしてGoogleマップで開く';
    
    // 地図上のクリックイベント
    map.addListener('click', () => {
        window.open(googleMapsUrl, '_blank');
    });
    
    // マーカーのクリックでもGoogleマップを開く（情報ウィンドウも表示）
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
        // 少し遅延させてGoogleマップを開く（情報ウィンドウを見せる時間を作る）
        setTimeout(() => {
            window.open(googleMapsUrl, '_blank');
        }, 300);
    });
}

/**
 * 物件位置の地図を表示（property-detail.htmlで使用）
 * @param {number} lat - 物件の緯度
 * @param {number} lng - 物件の経度
 * @param {string} title - 物件名
 * @param {string} address - 住所
 */
function initPropertyMap(lat, lng, title, address) {
    const { map, marker } = initMap('property-map', lat, lng, 16);
    
    if (marker) {
        marker.setTitle(title);
        
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3>${title}</h3>
                    <p>${address}</p>
                </div>
            `
        });
        
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        
        // 周辺施設を表示
        fetchNearbyPlaces(map, lat, lng);
    }
}

/**
 * 周辺施設を取得して地図に表示
 * @param {Object} map - Google Mapオブジェクト
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 */
function fetchNearbyPlaces(map, lat, lng) {
    const service = new google.maps.places.PlacesService(map);
    const location = new google.maps.LatLng(lat, lng);
    
    // 各カテゴリの施設を検索
    Object.keys(CONFIG.PLACE_TYPES).forEach(type => {
        const request = {
            location: location,
            radius: CONFIG.PLACES_RADIUS,
            type: type
        };
        
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                displayNearbyPlaces(results.slice(0, 3), type); // 各カテゴリ最大3件
            }
        });
    });
}

/**
 * 周辺施設をHTMLに表示
 * @param {Array} places - 施設の配列
 * @param {string} type - 施設タイプ
 */
function displayNearbyPlaces(places, type) {
    const container = document.getElementById('nearby-places');
    if (!container) return;
    
    const categoryName = CONFIG.PLACE_TYPES[type];
    
    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.className = 'nearby-place-item';
        placeElement.innerHTML = `
            <div class="place-category">${categoryName}</div>
            <div class="place-name">${place.name}</div>
            <div class="place-distance">徒歩約${calculateWalkTime(place.geometry.location)}分</div>
            ${place.rating ? `<div class="place-rating">★ ${place.rating}</div>` : ''}
        `;
        container.appendChild(placeElement);
    });
}

/**
 * 距離から徒歩時間を計算（簡易版）
 * @param {Object} location - google.maps.LatLng
 * @returns {number} 徒歩時間（分）
 */
function calculateWalkTime(location) {
    // 簡易計算：80m/分で計算
    // 実際は現在地との距離を計算する必要あり
    return Math.ceil(Math.random() * 10 + 1); // 仮実装
}

// ページ読み込み時に自動実行
window.addEventListener('load', () => {
    // about.htmlの場合
    if (document.getElementById('company-map')) {
        initCompanyMap();
    }
    
    // property-detail.htmlの場合（物件データから取得）
    if (document.getElementById('property-map')) {
        // 物件データを取得して地図初期化
        // 実装は物件詳細ページ作成時に追加
    }
});
