/* ============================================
   CarSpecio — Analytics Loader
   --------------------------------------------
   Central entry point for all tracking services.
   Reads config from window.CarSpecio.analyticsConfig.
   Loads scripts ONLY after consent is granted.
   
   To activate a service, set its ID in the config
   below. Empty/null IDs = service stays dormant.
   
   Supported services:
     - Google Tag Manager (gtmId)
     - Google Analytics 4 (ga4Id) — via GTM or standalone
     - Microsoft Clarity (clarityId)
     - Google Ads (adsId) — conversion tracking
     - Google AdSense (adsenseId) — publisher ID (ca-pub-XXXX)
   
   Consent categories:
     - analytics: GA4, Clarity
     - marketing: Google Ads
     - functional: AdSense (personalized ads)
     - necessary: always on (no tracking)
   
   This file does NOT inject any tracking pixels
   or scripts until the corresponding consent is
   granted AND a valid ID is configured.
   ============================================ */
(function () {
    'use strict';

    /* ── Configuration Placeholders ─────────── */
    /* Fill these in when ready to go live.       */
    /* Leave as null to keep the service dormant. */
    var DEFAULT_CONFIG = {
        gtmId:        null,  // e.g. 'GTM-XXXXXXX'
        ga4Id:        null,  // e.g. 'G-XXXXXXXXXX'
        clarityId:    null,  // e.g. 'abcdef1234'
        adsId:        null,  // e.g. 'AW-XXXXXXXXX'
        adsenseId:    null   // e.g. 'ca-pub-XXXXXXXXXXXXXXXX'
    };

    window.CarSpecio = window.CarSpecio || {};
    var cfg = window.CarSpecio.analyticsConfig || {};
    cfg.gtmId     = cfg.gtmId     || DEFAULT_CONFIG.gtmId;
    cfg.ga4Id     = cfg.ga4Id     || DEFAULT_CONFIG.ga4Id;
    cfg.clarityId = cfg.clarityId || DEFAULT_CONFIG.clarityId;
    cfg.adsId     = cfg.adsId     || DEFAULT_CONFIG.adsId;
    cfg.adsenseId = cfg.adsenseId || DEFAULT_CONFIG.adsenseId;
    window.CarSpecio.analyticsConfig = cfg;

    /* ── Script Loader ──────────────────────── */
    function loadScript(src, attrs) {
        var s = document.createElement('script');
        s.async = true;
        s.src = src;
        if (attrs) {
            for (var k in attrs) {
                if (attrs.hasOwnProperty(k)) s.setAttribute(k, attrs[k]);
            }
        }
        document.head.appendChild(s);
    }

    /* ── Google Tag Manager ─────────────────── */
    function loadGTM() {
        if (!cfg.gtmId) return;
        /* GTM dataLayer */
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var dl = 'dataLayer';
        /* Standard GTM snippet */
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl2 = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl2;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', cfg.gtmId);
    }

    /* ── Google Analytics 4 (standalone) ────── */
    /* Only loads if GTM is NOT configured,       */
    /* since GTM can handle GA4 internally.       */
    function loadGA4() {
        if (!cfg.ga4Id) return;
        if (cfg.gtmId) return; /* GA4 handled via GTM */
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4Id);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', cfg.ga4Id, { anonymize_ip: true });
    }

    /* ── Microsoft Clarity ───────────────────── */
    function loadClarity() {
        if (!cfg.clarityId) return;
        /* Standard Clarity snippet */
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", cfg.clarityId);
    }

    /* ── Google Ads (conversion tracking) ────── */
    function loadAds() {
        if (!cfg.adsId) return;
        /* Uses gtag if already loaded, otherwise loads it */
        if (!window.gtag) {
            loadScript('https://www.googletagmanager.com/gtag/js?id=' + cfg.adsId);
            window.dataLayer = window.dataLayer || [];
            window.gtag = function () { window.dataLayer.push(arguments); };
            gtag('js', new Date());
        }
        gtag('config', cfg.adsId);
    }

    /* ── Google AdSense ──────────────────────── */
    function loadAdSense() {
        if (!cfg.adsenseId) return;
        loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
            'data-ad-client': cfg.adsenseId,
            'crossorigin': 'anonymous'
        });
    }

    /* ── Consent-aware Loader ────────────────── */
    /* Uses CarSpecio.onCookieConsent to gate     */
    /* all tracking behind user consent.          */
    function activateAnalytics() {
        loadGTM();
        loadGA4();
        loadClarity();
    }

    function activateMarketing() {
        loadAds();
    }

    function activateFunctional() {
        loadAdSense();
    }

    /* Register with cookie consent system */
    if (window.CarSpecio && typeof window.CarSpecio.onConsent === 'function') {
        /* New granular consent API (Phase 2) */
        window.CarSpecio.onConsent('analytics', activateAnalytics);
        window.CarSpecio.onConsent('marketing', activateMarketing);
        window.CarSpecio.onConsent('functional', activateFunctional);
    } else if (typeof window.CarSpecio.onCookieConsent === 'function') {
        /* Fallback: simple accept/decline */
        window.CarSpecio.onCookieConsent(function () {
            activateAnalytics();
            activateMarketing();
            activateFunctional();
        });
    }

    /* ── Public API ──────────────────────────── */
    window.CarSpecio.analytics = {
        config: cfg,
        loadGTM: loadGTM,
        loadGA4: loadGA4,
        loadClarity: loadClarity,
        loadAds: loadAds,
        loadAdSense: loadAdSense,
        activateAnalytics: activateAnalytics,
        activateMarketing: activateMarketing,
        activateFunctional: activateFunctional
    };
})();
