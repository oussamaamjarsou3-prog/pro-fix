/* ============================================
   CarSpecio — Cookie Consent
   Vanilla JS — no external dependencies
   Privacy Policy is on privacidad.html
   ============================================ */
(function () {
    'use strict';

    var STORAGE_KEY = 'carspecio_cookie_consent';
    var CONSENT_ACCEPTED = 'accepted';
    var CONSENT_DECLINED = 'declined';

    /* ── Consent categories ─────────────────── */
    /* Stored as a JSON object alongside the     */
    /* simple accepted/declined flag for         */
    /* backward compatibility.                   */
    var CONSENT_DETAIL_KEY = 'carspecio_consent_detail';
    var DEFAULT_CONSENT = {
        necessary: true,      /* always on */
        functional: false,
        analytics: false,
        marketing: false
    };

    /* ── State ──────────────────────────────── */
    var consentValue = null;
    var consentDetail = null;
    var analyticsCallbacks = [];
    var consentCallbacks = { analytics: [], marketing: [], functional: [], necessary: [] };

    /* ── i18n strings ───────────────────────── */
    var I18N = {
        es: {
            bannerTitle: 'Uso de Cookies',
            bannerText: 'Utilizamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Al hacer clic en "Aceptar", consientes el uso de cookies.',
            accept: 'Aceptar',
            decline: 'Rechazar',
            privacyLink: 'Política de Cookies'
        },
        en: {
            bannerTitle: 'Cookie Usage',
            bannerText: 'We use our own and third-party cookies to improve your experience, analyze traffic and personalize content. By clicking "Accept", you consent to the use of cookies.',
            accept: 'Accept',
            decline: 'Decline',
            privacyLink: 'Cookie Policy'
        },
        fr: {
            bannerTitle: 'Utilisation des Cookies',
            bannerText: 'Nous utilisons des cookies propres et de tiers pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. En cliquant sur « Accepter », vous consentez à l\'utilisation des cookies.',
            accept: 'Accepter',
            decline: 'Refuser',
            privacyLink: 'Politique des Cookies'
        },
        ar: {
            bannerTitle: 'استخدام ملفات تعريف الارتباط',
            bannerText: 'نستخدم ملفات تعريف الارتباط الخاصة بنا ومن جهات خارجية لتحسين تجربتك وتحليل حركة المرور وتخصيص المحتوى. بالنقر على "موافقة"، فإنك توافق على استخدام ملفات تعريف الارتباط.',
            accept: 'موافقة',
            decline: 'رفض',
            privacyLink: 'سياسة ملفات تعريف الارتباط'
        }
    };

    function getLang() {
        var lang = 'es';
        try {
            var stored = localStorage.getItem('carspecio_lang');
            if (stored && I18N[stored]) lang = stored;
            else {
                var htmlLang = document.documentElement.getAttribute('lang');
                if (htmlLang && I18N[htmlLang]) lang = htmlLang;
            }
        } catch (e) {}
        return lang;
    }

    function t(key) {
        var lang = getLang();
        return (I18N[lang] && I18N[lang][key]) || I18N.es[key] || key;
    }

    /* ── Detect page depth for correct cookies-policy.html path ── */
    function getCookiesPolicyUrl() {
        var path = window.location.pathname;
        var depth = (path.match(/\//g) || []).length;
        if (depth <= 1) return 'cookies-policy.html';
        var parts = path.split('/').filter(Boolean);
        parts.pop();
        return parts.map(function () { return '..'; }).join('/') + '/cookies-policy.html';
    }

    /* ── Banner HTML ────────────────────────── */
    function buildBanner() {
        var privacyUrl = getCookiesPolicyUrl();
        var html = '<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="' + t('bannerTitle') + '" aria-live="polite">';
        html += '<div class="cookie-banner__inner">';
        html += '<div class="cookie-banner__text">';
        html += '<strong>' + t('bannerTitle') + '</strong><br>';
        html += t('bannerText') + ' <a href="' + privacyUrl + '" id="cookiePrivacyLink">' + t('privacyLink') + '</a>';
        html += '</div>';
        html += '<div class="cookie-banner__actions">';
        html += '<button type="button" class="cookie-banner__btn cookie-banner__btn--decline" id="cookieDecline">' + t('decline') + '</button>';
        html += '<button type="button" class="cookie-banner__btn cookie-banner__btn--accept" id="cookieAccept">' + t('accept') + '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        return html;
    }

    /* ── Core logic ─────────────────────────── */
    function getConsent() {
        try {
            consentValue = localStorage.getItem(STORAGE_KEY);
            var detailStr = localStorage.getItem(CONSENT_DETAIL_KEY);
            consentDetail = detailStr ? JSON.parse(detailStr) : null;
        } catch (e) {
            consentValue = null;
            consentDetail = null;
        }
        return consentValue;
    }

    function setConsent(value) {
        consentValue = value;
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (e) {}

        /* Set granular consent detail */
        if (value === CONSENT_ACCEPTED) {
            consentDetail = {
                necessary: true,
                functional: true,
                analytics: true,
                marketing: true
            };
        } else {
            consentDetail = { necessary: true, functional: false, analytics: false, marketing: false };
        }
        try {
            localStorage.setItem(CONSENT_DETAIL_KEY, JSON.stringify(consentDetail));
        } catch (e) {}

        if (value === CONSENT_ACCEPTED) {
            runAnalyticsCallbacks();
            runConsentCallbacks();
        }
    }

    /* ── Granular consent API ────────────────── */
    /* Register a callback for a specific consent */
    /* category. Runs immediately if already       */
    /* granted.                                    */
    function onConsent(category, callback) {
        if (typeof callback !== 'function') return;
        if (!consentCallbacks[category]) return;
        consentCallbacks[category].push(callback);
        if (consentDetail && consentDetail[category]) {
            callback();
        }
    }

    function runConsentCallbacks() {
        if (!consentDetail) return;
        var categories = Object.keys(consentCallbacks);
        for (var i = 0; i < categories.length; i++) {
            var cat = categories[i];
            if (consentDetail[cat]) {
                var cbs = consentCallbacks[cat];
                for (var j = 0; j < cbs.length; j++) {
                    try { cbs[j](); } catch (e) {
                        console.error('[CarSpecio] Consent callback error (' + cat + '):', e);
                    }
                }
            }
        }
    }

    function getConsentDetail() {
        return consentDetail || { necessary: true, functional: false, analytics: false, marketing: false };
    }

    function showBanner() {
        var banner = document.getElementById('cookieBanner');
        if (banner) {
            requestAnimationFrame(function () {
                banner.classList.add('cookie-banner--visible');
            });
        }
    }

    function hideBanner() {
        var banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('cookie-banner--visible');
            setTimeout(function () {
                if (banner.parentNode) banner.parentNode.removeChild(banner);
            }, 400);
        }
    }

    /* ── Analytics gate ─────────────────────── */
    /**
     * Register a callback to run only after the user accepts cookies.
     * Example:
     *   CarSpecio.onCookieConsent(function() {
     *       // Google Analytics snippet here
     *       gtag('config', 'G-XXXXXXX');
     *   });
     */
    function onCookieConsent(callback) {
        if (typeof callback === 'function') {
            analyticsCallbacks.push(callback);
            if (consentValue === CONSENT_ACCEPTED) {
                callback();
            }
        }
    }

    function runAnalyticsCallbacks() {
        for (var i = 0; i < analyticsCallbacks.length; i++) {
            try {
                analyticsCallbacks[i]();
            } catch (e) {
                console.error('[CarSpecio] Analytics callback error:', e);
            }
        }
    }

    /* ── Wire up footer links ───────────────── */
    var PRIVACY_TEXTS = ['Privacidad', 'Privacy', 'Confidentialité', 'سياسة الخصوصية'];
    var COOKIE_TEXTS = ['Cookies', 'cookies', 'ملفات تعريف الارتباط'];

    function matchLinkByText(link, texts) {
        var txt = (link.textContent || '').trim();
        for (var i = 0; i < texts.length; i++) {
            if (txt === texts[i]) return true;
        }
        return false;
    }

    function wireFooterLinks() {
        var allFooterLinks = document.querySelectorAll('.site-footer a, footer a');
        var cookieLinks = [];

        allFooterLinks.forEach(function (link) {
            var di = link.getAttribute('data-i18n');
            if (di === 'footer.cookies' || link.hasAttribute('data-cookie-settings') || matchLinkByText(link, COOKIE_TEXTS)) {
                cookieLinks.push(link);
            }
        });

        cookieLinks.forEach(function (link) {
            link.setAttribute('href', 'javascript:void(0)');
            link.setAttribute('role', 'button');
            link.addEventListener('click', function (e) {
                e.preventDefault();
                if (consentValue === CONSENT_ACCEPTED || consentValue === CONSENT_DECLINED) {
                    var banner = document.getElementById('cookieBanner');
                    if (!banner) {
                        document.body.insertAdjacentHTML('beforeend', buildBanner());
                        attachBannerEvents();
                        showBanner();
                    } else {
                        showBanner();
                    }
                } else {
                    showBanner();
                }
            });
        });
    }

    /* ── Event listeners ────────────────────── */
    function attachBannerEvents() {
        var acceptBtn = document.getElementById('cookieAccept');
        var declineBtn = document.getElementById('cookieDecline');
        var privacyLink = document.getElementById('cookiePrivacyLink');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                setConsent(CONSENT_ACCEPTED);
                hideBanner();
            });
        }
        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                setConsent(CONSENT_DECLINED);
                hideBanner();
            });
        }
    }

    /* ── Init ───────────────────────────────── */
    function init() {
        getConsent();

        if (!consentValue) {
            document.body.insertAdjacentHTML('beforeend', buildBanner());
            attachBannerEvents();
            setTimeout(showBanner, 800);
        }

        wireFooterLinks();

        if (consentValue === CONSENT_ACCEPTED) {
            runAnalyticsCallbacks();
            runConsentCallbacks();
        }
    }

    /* ── Public API ─────────────────────────── */
    window.CarSpecio = window.CarSpecio || {};
    window.CarSpecio.onCookieConsent = onCookieConsent;
    window.CarSpecio.onConsent = onConsent;
    window.CarSpecio.hasConsent = function () {
        return consentValue === CONSENT_ACCEPTED;
    };
    window.CarSpecio.hasConsentFor = function (category) {
        return consentDetail ? !!consentDetail[category] : false;
    };
    window.CarSpecio.getConsentDetail = getConsentDetail;
    window.CarSpecio.revokeConsent = function () {
        setConsent(CONSENT_DECLINED);
    };

    /* ── Boot ───────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
