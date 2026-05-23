// Cookie consent and third-party map loading controls.
(function () {
    const CONSENT_KEY = 'frejuno_cookie_consent_v1';
    const GOOGLE_MAPS_SRC_ID = 'frejuno-google-maps-api';
    
    function getConsent() {
        try {
            return localStorage.getItem(CONSENT_KEY);
        } catch (error) {
            return null;
        }
    }

    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, value);
        } catch (error) {
            // If storage is unavailable, keep the current-page choice in memory only.
        }
    }

    function hasMapsConsent() {
        return getConsent() === 'accepted';
    }

    function notifyMapsReady() {
        window.dispatchEvent(new Event('frejuno:maps-ready'));
    }

    function loadGoogleMapsApi() {
        if (!hasMapsConsent()) return;

        if (window.google && window.google.maps) {
            notifyMapsReady();
            return;
        }

        if (document.getElementById(GOOGLE_MAPS_SRC_ID)) return;

        const apiKey = window.GOOGLE_MAPS_API_KEY || window.GOOGLE_API_KEY || '';
        if (!apiKey) {
            window.dispatchEvent(new Event('frejuno:maps-unavailable'));
            return;
        }

        const script = document.createElement('script');
        script.id = GOOGLE_MAPS_SRC_ID;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&libraries=places&language=ja';
        script.async = true;
        script.defer = true;
        script.onload = notifyMapsReady;
        document.head.appendChild(script);
    }

    function enableMapEmbeds() {
        if (!hasMapsConsent()) return;

        document.querySelectorAll('iframe[data-map-src]').forEach((iframe) => {
            if (!iframe.getAttribute('src')) {
                iframe.setAttribute('src', iframe.dataset.mapSrc);
            }
        });

        document.querySelectorAll('.map-consent-placeholder').forEach((placeholder) => {
            placeholder.hidden = true;
        });
    }

    function acceptConsent() {
        setConsent('accepted');
        const banner = document.getElementById('cookie-consent');
        if (banner) banner.remove();
        enableMapEmbeds();
        loadGoogleMapsApi();
    }

    function declineConsent() {
        setConsent('declined');
        const banner = document.getElementById('cookie-consent');
        if (banner) banner.remove();
    }

    function createInlineMapPlaceholder(target) {
        const placeholder = document.createElement('div');
        placeholder.className = 'map-consent-placeholder';
        placeholder.innerHTML = [
            '<div>',
            '<strong>地図を表示するにはCookie・外部サービスの利用に同意してください。</strong>',
            '<p>Google Mapsを読み込むと、Googleへアクセス情報が送信される場合があります。</p>',
            '<button type="button" class="btn btn-primary map-consent-accept">地図を表示する</button>',
            '</div>'
        ].join('');
        placeholder.querySelector('button').addEventListener('click', acceptConsent);
        target.appendChild(placeholder);
    }

    function prepareMapEmbeds() {
        document.querySelectorAll('iframe[data-map-src]').forEach((iframe) => {
            const wrapper = iframe.closest('.map-consent-frame');
            if (hasMapsConsent()) {
                iframe.setAttribute('src', iframe.dataset.mapSrc);
                return;
            }
            iframe.removeAttribute('src');
            if (wrapper && !wrapper.querySelector('.map-consent-placeholder')) {
                createInlineMapPlaceholder(wrapper);
            }
        });

        ['properties-map', 'property-map', 'company-map'].forEach((id) => {
            const target = document.getElementById(id);
            if (target && !hasMapsConsent() && !target.querySelector('.map-consent-placeholder')) {
                createInlineMapPlaceholder(target);
            }
        });
    }

    function renderBanner() {
        if (getConsent()) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-consent';
        banner.className = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Cookieと外部サービスの利用確認');
        banner.innerHTML = [
            '<div class="cookie-consent-text">',
            '<strong>Cookie・外部サービスの利用について</strong>',
            '<p>Frejunoサイトでは、地図表示など一部機能でGoogle Maps等の外部サービスを利用します。同意するまで地図は読み込みません。</p>',
            '</div>',
            '<div class="cookie-consent-actions">',
            '<button type="button" class="btn btn-primary" data-cookie-accept>同意する</button>',
            '<button type="button" class="btn btn-secondary" data-cookie-decline>あとで</button>',
            '<a href="privacy.html">詳細</a>',
            '</div>'
        ].join('');

        banner.querySelector('[data-cookie-accept]').addEventListener('click', acceptConsent);
        banner.querySelector('[data-cookie-decline]').addEventListener('click', declineConsent);
        document.body.appendChild(banner);
    }

    window.FrejunoConsent = {
        accept: acceptConsent,
        hasMapsConsent,
        loadGoogleMapsApi
    };

    document.addEventListener('DOMContentLoaded', () => {
        prepareMapEmbeds();
        renderBanner();
        if (hasMapsConsent()) {
            enableMapEmbeds();
            loadGoogleMapsApi();
        }
    });
})();
