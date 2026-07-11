/* CarSpecio — Dynamic News Cards */
/* Renders news cards from window.CARSPECIO_NEWS_INDEX */
/* Replaces static HTML cards with dynamic ones */

(function() {
    'use strict';

    function currentLang() {
        return (typeof window.currentLang === 'function' && window.currentLang()) ||
               document.documentElement.lang ||
               document.documentElement.getAttribute('data-i18n-lang') ||
               'es';
    }

    function getSource(sourceKey) {
        var sources = window.CARSPECIO_NEWS_SOURCES || {};
        return sources[sourceKey] || { icon: '🌍', name: sourceKey || 'CarSpecio' };
    }

    function formatDate(dateStr, lang) {
        var d = new Date(dateStr);
        var months = {
            es: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
            en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            fr: ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'],
            ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
        };
        var m = months[lang] || months.es;
        var day = d.getDate();
        var month = m[d.getMonth()];
        var year = d.getFullYear();
        if (lang === 'ar') {
            return day + ' ' + month + ' ' + year;
        }
        return day + ' ' + month + ' ' + year;
    }

    function buildCard(article, lang) {
        var title = article.title[lang] || article.title.es || '';
        var excerpt = article.excerpt[lang] || article.excerpt.es || '';
        var img = article.image || '';
        var src = getSource(article.source);
        var dateStr = formatDate(article.date, lang);
        var readMore = {
            es: 'Leer más →',
            en: 'Read more →',
            fr: 'Lire la suite →',
            ar: '← اقرأ المزيد'
        };
        var rm = readMore[lang] || readMore.es;

        var tagsHtml = (article.tags || []).map(function(t) {
            return '<span class="news-card-tag">' + t + '</span>';
        }).join('');

        return '<article class="news-card" data-category="' + (article.category || '') + '">' +
            '<a href="' + article.htmlFile + '" class="news-card-link" aria-label="' + title.replace(/"/g, '&quot;') + '">' +
                '<img class="news-card-image" src="' + img + '" alt="' + title.replace(/"/g, '&quot;') + '" loading="lazy">' +
            '</a>' +
            '<div class="news-card-body">' +
                '<div class="news-card-meta">' +
                    '<span class="news-card-category">' + (article.category || '') + '</span>' +
                    '<span class="news-card-source"><span>' + src.icon + '</span> ' + src.name + '</span>' +
                    '<span>' + dateStr + '</span>' +
                '</div>' +
                '<h2><a href="' + article.htmlFile + '">' + title + '</a></h2>' +
                '<p class="news-card-excerpt">' + excerpt + '</p>' +
                '<div class="news-card-footer">' +
                    '<div class="news-card-tags">' + tagsHtml + '</div>' +
                    '<a href="' + article.htmlFile + '" class="news-card-read">' + rm + '</a>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    function render() {
        if (!window.CARSPECIO_NEWS_INDEX) {
            console.warn('[news-dynamic] CARSPECIO_NEWS_INDEX not found');
            return;
        }
        var lang = currentLang();
        var containers = document.querySelectorAll('[data-dynamic="news-grid"]');
        console.log('[news-dynamic] render called, lang=' + lang + ', containers=' + containers.length + ', articles=' + window.CARSPECIO_NEWS_INDEX.length);
        if (!containers.length) return;

        var filter = 'all';
        var activeFilter = document.querySelector('.news-filter.active');
        if (activeFilter) filter = activeFilter.getAttribute('data-filter') || 'all';

        var articles = window.CARSPECIO_NEWS_INDEX.slice();

        if (filter !== 'all') {
            articles = articles.filter(function(a) { return a.category === filter; });
        }

        var html = articles.map(function(a) { return buildCard(a, lang); }).join('');

        containers.forEach(function(container) {
            container.innerHTML = html;
        });
    }

    function initFilters() {
        var filters = document.querySelectorAll('.news-filter');
        filters.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filters.forEach(function(f) { f.classList.remove('active'); });
                btn.classList.add('active');
                render();
            });
        });
    }

    function init() {
        if (!window.CARSPECIO_NEWS_INDEX) {
            setTimeout(init, 100);
            return;
        }
        render();
        initFilters();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('i18n:ready', function() {
        setTimeout(function() {
            if (window.CARSPECIO_NEWS_INDEX) render();
        }, 100);
    });
})();
