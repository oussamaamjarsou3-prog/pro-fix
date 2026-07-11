/* ============================================
   CarSpecio — Analytics Event Hooks
   --------------------------------------------
   Lightweight event dispatch system for future
   tracking integration. Does NOT send any data
   to any analytics service by itself.
   
   Usage:
     CarSpecio.track('page_view', { page: 'rs7' });
     CarSpecio.track('compare', { car1: 'Audi RS7', car2: 'BMW M5' });
   
   When analytics is active, events are forwarded
   to dataLayer (GTM/GA4) and Clarity.
   
   Also supports declarative tracking via HTML:
     <button data-track="share" data-track-label="facebook">Share</button>
   
   No tracking IDs, no test scripts.
   ============================================ */
(function () {
    'use strict';

    window.CarSpecio = window.CarSpecio || {};

    var eventQueue = [];

    /* ── Core track function ────────────────── */
    /* Pushes events to dataLayer (if available)  */
    /* and Clarity (if available).                */
    /* Events are queued until analytics loads.   */
    function track(eventName, params) {
        var evt = {
            event: eventName,
            params: params || {},
            timestamp: Date.now()
        };

        /* Queue always — consumed by analytics when ready */
        eventQueue.push(evt);

        /* Forward to dataLayer (GTM/GA4) if present */
        if (window.dataLayer && typeof window.dataLayer.push === 'function') {
            window.dataLayer.push({
                event: eventName,
                ...params
            });
        }

        /* Forward to Clarity if present */
        if (typeof window.clarity === 'function') {
            try { window.clarity('event', eventName); } catch (e) {}
        }

        /* Forward to gtag if present (standalone GA4) */
        if (typeof window.gtag === 'function') {
            try { window.gtag('event', eventName, params || {}); } catch (e) {}
        }
    }

    /* ── Declarative tracking ────────────────── */
    /* Scans for [data-track] attributes and      */
    /* wires click listeners automatically.       */
    function initDeclarativeTracking() {
        document.addEventListener('click', function (e) {
            var el = e.target.closest('[data-track]');
            if (!el) return;

            var eventName = el.getAttribute('data-track');
            var label = el.getAttribute('data-track-label') || '';
            var category = el.getAttribute('data-track-category') || 'engagement';
            var value = el.getAttribute('data-track-value') || '';

            track(eventName, {
                category: category,
                label: label,
                value: value,
                page: window.location.pathname
            });
        }, true);
    }

    /* ── Predefined event helpers ────────────── */
    /* These are clean hooks — they call track()  */
    /* but track() is a no-op until analytics is  */
    /* configured. Safe to call anywhere.         */
    var events = {
        pageView: function (pageName) {
            track('page_view', { page_title: pageName, page_path: window.location.pathname });
        },
        carPageView: function (carId, carName) {
            track('car_page_view', { car_id: carId, car_name: carName });
        },
        compare: function (car1, car2) {
            track('compare', { car_1: car1, car_2: car2 });
        },
        search: function (query, resultsCount) {
            track('search', { search_term: query, results_count: resultsCount || 0 });
        },
        newsView: function (articleId, title) {
            track('news_view', { article_id: articleId, article_title: title });
        },
        guideView: function (guideId, title) {
            track('guide_view', { guide_id: guideId, guide_title: title });
        },
        toolUse: function (toolName) {
            track('tool_use', { tool_name: toolName });
        },
        languageChange: function (fromLang, toLang) {
            track('language_change', { from: fromLang, to: toLang });
        },
        countryChange: function (fromCountry, toCountry) {
            track('country_change', { from: fromCountry, to: toCountry });
        },
        brandClick: function (brandName) {
            track('brand_click', { brand: brandName });
        },
        categoryClick: function (categoryId) {
            track('category_click', { category: categoryId });
        },
        ctaClick: function (ctaName, ctaLocation) {
            track('cta_click', { cta_name: ctaName, cta_location: ctaLocation || '' });
        }
    };

    /* ── Wire language change hook ───────────── */
    /* Listens for the existing 'language:changed' */
    /* custom event dispatched by dropdowns.js     */
    document.addEventListener('language:changed', function (e) {
        if (e && e.detail) {
            var newLang = e.detail.value || '';
            var oldLang = document.documentElement.lang || '';
            events.languageChange(oldLang, newLang);
        }
    });

    /* ── Wire country change hook ────────────── */
    document.addEventListener('country:changed', function (e) {
        if (e && e.detail) {
            var newCountry = e.detail.value || '';
            events.countryChange('', newCountry);
        }
    });

    /* ── Public API ──────────────────────────── */
    window.CarSpecio.track = track;
    window.CarSpecio.events = events;

    /* ── Init ────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDeclarativeTracking);
    } else {
        initDeclarativeTracking();
    }
})();
