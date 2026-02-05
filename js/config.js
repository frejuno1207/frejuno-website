// Frejuno Website Configuration
// Google Maps/Places API設定

const CONFIG = {
    // Google Maps API Key
    GOOGLE_API_KEY: 'AIzaSyBsxmS0TYlKgGB0jQ9sZvc-FES-Ge_DQGI',
    
    // 会社情報
    COMPANY: {
        name: '株式会社Frejuno',
        address: '〒791-1114 愛媛県松山市井戸町551-5',
        phone: '089-900-1382',
        lat: 33.7974938, // 井戸町の座標（791-1114の中心座標）
        lng: 132.7735556
    },
    
    // Google Maps 設定
    MAP_OPTIONS: {
        zoom: 15,
        mapTypeId: 'roadmap',
        styles: [] // カスタムスタイル（後で追加可能）
    },
    
    // Places API 検索半径（メートル）
    PLACES_RADIUS: 1000,
    
    // 検索するカテゴリ
    PLACE_TYPES: {
        convenience_store: 'コンビニ',
        supermarket: 'スーパーマーケット',
        hospital: '病院',
        school: '学校',
        train_station: '駅',
        park: '公園'
    }
};

// APIキーをグローバルに公開（Maps API読み込み用）
window.GOOGLE_API_KEY = CONFIG.GOOGLE_API_KEY;
