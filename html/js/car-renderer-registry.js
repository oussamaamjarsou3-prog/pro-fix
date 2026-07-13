/**
 * Car Renderer Registry
 * Defines SECTION_RENDERERS (common) and POWERTRAIN_RENDERERS (powertrain-specific)
 * Loaded before car-renderer.js so CarRenderer.renderSections can use them.
 *
 * Multilingual convention:
 *   Sections may be stored as flat objects (legacy) or wrapped in language keys:
 *   { "es": {...}, "en": {...}, "fr": {...}, "ar": {...} }
 *   Renderers resolve via _getLocalized() with ES fallback.
 */

const REGISTRY_SUPPORTED_LANGS = ['es', 'en', 'fr', 'ar'];

function _getLocalized(data, lang) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
    const hasLangKeys = REGISTRY_SUPPORTED_LANGS.some(function(l) {
        return data[l] !== undefined;
    });
    if (hasLangKeys) {
        return data[lang] || data['es'] || data[REGISTRY_SUPPORTED_LANGS.find(function(l) { return data[l]; })] || data;
    }
    return data;
}

function _isMultilingual(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    return REGISTRY_SUPPORTED_LANGS.some(function(l) {
        return data[l] !== undefined;
    });
}

// Car section labels are loaded from the active locale file (carLabels section).
function _getLocalizedLabel(text, lang) {
    if (typeof lang === 'undefined') lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
    const labels = (typeof translations !== 'undefined' && translations && translations.carLabels) ? translations.carLabels : {};
    if (labels[text]) return labels[text];
    return text;
}

function _getLabel(text, lang) {
    return _getLocalizedLabel(text, lang);
}

function _str(value, fallback) {
    if (value === null || value === undefined) return fallback || '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.name !== undefined) return value.name;
    if (typeof value === 'object' && _isMultilingual(value)) {
        const localized = _getLocalized(value, (typeof currentLang !== 'undefined' ? currentLang : 'es'));
        if (localized) return localized;
    }
    return String(value);
}

function _localizeHtml(html, lang) {
    if (typeof html !== 'string') return html;
    const labels = (typeof translations !== 'undefined' && translations && translations.carLabels) ? translations.carLabels : {};
    Object.keys(labels).sort(function(a, b) { return b.length - a.length; }).forEach(function(label) {
        // Skip very short tokens that could appear inside unrelated words.
        if (label.length <= 2) return;
        const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const replacement = lang === 'ar' ? '<span dir="auto">' + labels[label] + '</span>' : labels[label];
        html = html.replace(new RegExp(escaped, 'g'), replacement);
    });
    return html;
}

function _getCurrentCountry() {
    let cc = null;
    if (typeof currentCountry !== 'undefined' && currentCountry) cc = currentCountry;
    else if (typeof window !== 'undefined' && window.currentCountry) {
        try { cc = (typeof window.currentCountry === 'function') ? window.currentCountry() : window.currentCountry; } catch (e) { cc = null; }
    }
    return cc;
}

function _getCurrentCountryData() {
    const cc = _getCurrentCountry();
    if (!cc || typeof countryData === 'undefined' || !countryData[cc]) return null;
    return countryData[cc];
}

// Convert a numeric amount from a source currency to the active country currency.
function _convertMoney(amount, sourceCurrency) {
    const c = _getCurrentCountryData();
    if (!c || !c.currency || sourceCurrency === c.currency || !amount) return amount;
    const rate = c.exchangeRateEUR || 1;
    // If source is EUR, multiply by rate; if target is EUR, divide by rate.
    let converted;
    if (sourceCurrency === 'EUR') converted = amount * rate;
    else if (c.currency === 'EUR') converted = amount / rate;
    else converted = amount * rate; // assume source is EUR-like or not handled
    return Math.round(converted);
}

// Convert embedded EUR amounts in text into the active country currency.
// Handles Spanish "1.800 €", English "€1,800", French "1 800 €", Arabic "1,800 يورو".
function _convertEurText(text) {
    if (typeof text !== 'string') return text;
    const c = _getCurrentCountryData();
    if (!c || !c.currency || c.currency === 'EUR') return text;
    const rate = c.exchangeRateEUR || 1;

    const convertAmount = (raw) => {
        const clean = raw.replace(/[.\s]/g, '').replace(/,/g, '.');
        const num = parseFloat(clean);
        if (isNaN(num)) return raw;
        const converted = Math.round(num * rate);
        return converted.toLocaleString('es-ES').replace(/,/g, ' ');
    };

    // Spanish/Italian/German style: 1.800 €
    text = text.replace(/(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*€/g, (m, num) => convertAmount(num) + ' ' + c.currency);
    // English style: €1,800 or € 1,800
    text = text.replace(/€\s*(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)/g, (m, num) => convertAmount(num.replace(/,/g, '')) + ' ' + c.currency);
    // French style: 1 800 €
    text = text.replace(/(\d{1,3}(?: \d{3})+(?:,\d+)?|\d+(?:,\d+)?)\s*€/g, (m, num) => convertAmount(num) + ' ' + c.currency);
    // Arabic style: 1,800 يورو
    text = text.replace(/(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)\s*يورو/g, (m, num) => convertAmount(num) + ' ' + c.currency);
    return text;
}

// Format a numeric amount using the active country currency and locale.
function _formatCountryMoney(amount) {
    if (typeof formatLocalMoney === 'function') return formatLocalMoney(amount);
    const c = _getCurrentCountryData();
    if (!c) return amount;
    const lang = typeof getCurrentLang === 'function' ? getCurrentLang() : 'es';
    const locale = lang === 'ar' ? 'ar-MA' : c.locale || 'es-ES';
    return amount.toLocaleString(locale) + ' ' + c.currency;
}

const SECTION_RENDERERS = {
    _initHero: function(carData) {
        const heroSection = document.getElementById('hero-section');
        if (!heroSection) return;
        
        const lang = (typeof currentLang !== 'undefined') ? currentLang : 'es';
        const badgeEl = document.getElementById('heroBadge');
        const titleEl = document.getElementById('heroTitle');
        const subtitleEl = document.getElementById('heroSubtitle');
        
        // Set badge from basicInfo.badge or pageText
        if (badgeEl) {
            const badge = (lang === 'ar' && carData.basicInfo?.badgeAr) ? carData.basicInfo.badgeAr : (carData.basicInfo?.badge || '');
            badgeEl.textContent = badge || '';
        }
        
        // Set title from basicInfo.fullModelName or basicInfo.name
        if (titleEl) {
            const title = (lang === 'ar' && carData.basicInfo?.fullModelNameAr) ? carData.basicInfo.fullModelNameAr : (carData.basicInfo?.fullModelName || carData.basicInfo?.name || '');
            titleEl.textContent = title || '';
        }
        
        // Set subtitle from pageText if available
        if (subtitleEl && carData.pageText && carData.pageText[lang]) {
            const pt = carData.pageText[lang];
            subtitleEl.textContent = pt.heroSubtitle || pt.subtitle || '';
        }
    },
    
    electric: function(carData) {
        const section = document.getElementById('electric-section');
        if (!section) return;
        if (!carData.electric) { section.hidden = true; return; }
        const e = carData.electric;
        const _et = (typeof t === 'function') ? function(key) { return t('electric.' + key); } : function(key) { return key; };
        const setText = (id, val, suffix) => {
            const el = document.getElementById(id);
            if (el && val !== undefined && val !== null) el.textContent = val + (suffix || '');
        };
        if (e.batteryCapacity?.value) setText('electricBattery', e.batteryCapacity.value);
        if (e.electricRange?.value) setText('electricRange', e.electricRange.value);
        if (e.charging?.ac?.power) setText('electricAcPower', e.charging.ac.power);
        if (e.charging?.ac?.time) {
            const acTimeEl = document.getElementById('electricAcTime');
            if (acTimeEl) acTimeEl.textContent = e.charging.ac.time + ' ' + (_et('hours') || 'h');
        }
        if (e.charging?.dc?.power) setText('electricDcPower', e.charging.dc.power);
        if (e.charging?.dc?.time?.value) {
            const dcTimeEl = document.getElementById('electricDcTime');
            const pct = e.charging.dc.time.percentage ? ' (' + e.charging.dc.time.percentage + '%)' : '';
            if (dcTimeEl) dcTimeEl.textContent = e.charging.dc.time.value + ' ' + (_et('minutes') || 'min') + pct;
        }
        if (e.motor?.power?.value) setText('electricMotorPower', e.motor.power.value);
        if (e.motor?.type) {
            const motorTypeEl = document.getElementById('electricMotorType');
            const count = e.motor.count ? e.motor.count + 'x ' : '';
            if (motorTypeEl) motorTypeEl.textContent = count + e.motor.type;
        }
        if (carData.fuelEconomy?.energyConsumption?.combined?.value) {
            setText('electricConsumption', carData.fuelEconomy.energyConsumption.combined.value);
        }
        section.hidden = false;
    },

    review: function(carData) {
        const section = document.getElementById('review');
        const body = document.getElementById('reviewBody');
        const box = document.getElementById('verdictBox');
        if (!section || !body) return;
        const lang = this._getLang ? this._getLang() : 'es';
        let r = null;
        let html = '';
        if (carData.review) {
            r = _getLocalized(carData.review, lang);
        } else if (carData.content?.review) {
            const cr = _getLocalized(carData.content.review, lang);
            if (typeof cr === 'string') { html += '<p>' + cr + '</p>'; }
            else if (cr) { r = cr; }
        } else if (carData.pageText?.[lang]?.reviewText) {
            html += '<p>' + carData.pageText[lang].reviewText + '</p>';
        }
        if (r && !html) {
            if (r.fullText) html += '<p>' + r.fullText + '</p>';
            else if (r.summary) html += '<p>' + r.summary + '</p>';
        }
        if (!html) return;
        const resolve = (typeof window !== 'undefined' && typeof window.replaceCarPlaceholders === 'function') ? window.replaceCarPlaceholders : function(s) { return s; };
        html = resolve(html);
        if (r && r.scoreBreakdown) {
            html += '<div class="score-breakdown">';
            const _rt = (typeof t === 'function') ? function(key) { return t('rating.' + key); } : function(key) { return key; };
            for (const [k, v] of Object.entries(r.scoreBreakdown)) {
                const label = _rt(k) || k;
                html += '<div class="sb-item"><span>' + label + '</span><div class="sb-bar"><div style="width:' + (v * 10) + '%"></div></div><span>' + v + '</span></div>';
            }
            html += '</div>';
        }
        body.innerHTML = html;
        if (r && r.verdict) {
            const _vt = (typeof t === 'function') ? function(key) { return t('review.' + key); } : function(key) { return key; };
            const label = _vt('verdictLabel') || 'Verdict';
            const value = _vt('verdict.' + r.verdict) || r.verdict;
            box.innerHTML = '<div class="verdict ' + r.verdict + '"><strong>' + label + ':</strong> ' + value + '</div>';
            if (r.bestFor && r.bestFor.length) {
                box.innerHTML += '<ul class="best-for"><li>' + r.bestFor.join('</li><li>') + '</li></ul>';
            }
        }
        section.hidden = false;
    },

    drivingExperience: function(carData) {
        const section = document.getElementById('driving-experience');
        const grid = document.getElementById('drivingGrid');
        if (!section || !grid) return;
        if (!carData.drivingExperience) { section.hidden = true; return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const d = _getLocalized(carData.drivingExperience, lang);
        if (!d) return;
        let html = '';
        if (d.handling) {
            html += '<div class="dx-card"><h4>Handling</h4>';
            if (d.handling.summary) html += '<p>' + d.handling.summary + '</p>';
            html += '<ul>';
            if (d.handling.steeringFeel) html += '<li><strong>Steering:</strong> ' + d.handling.steeringFeel + '</li>';
            if (d.handling.bodyRoll) html += '<li><strong>Body roll:</strong> ' + d.handling.bodyRoll + '</li>';
            if (d.handling.gripLevels) html += '<li><strong>Grip:</strong> ' + d.handling.gripLevels + '</li>';
            if (d.handling.rideQuality) html += '<li><strong>Ride:</strong> ' + d.handling.rideQuality + '</li>';
            html += '</ul></div>';
        }
        if (d.performanceFeel) {
            html += '<div class="dx-card"><h4>Performance feel</h4><ul>';
            if (d.performanceFeel.acceleration) html += '<li><strong>Acceleration:</strong> ' + d.performanceFeel.acceleration + '</li>';
            if (d.performanceFeel.braking) html += '<li><strong>Braking:</strong> ' + d.performanceFeel.braking + '</li>';
            if (d.performanceFeel.sound) html += '<li><strong>Sound:</strong> ' + d.performanceFeel.sound + '</li>';
            if (d.performanceFeel.transmission) html += '<li><strong>Transmission:</strong> ' + d.performanceFeel.transmission + '</li>';
            html += '</ul></div>';
        }
        if (d.dailyDriving) {
            html += '<div class="dx-card"><h4>Daily driving</h4><ul>';
            if (d.dailyDriving.comfort) html += '<li><strong>Comfort:</strong> ' + d.dailyDriving.comfort + '</li>';
            if (d.dailyDriving.visibility) html += '<li><strong>Visibility:</strong> ' + d.dailyDriving.visibility + '</li>';
            if (d.dailyDriving.parking) html += '<li><strong>Parking:</strong> ' + d.dailyDriving.parking + '</li>';
            if (d.dailyDriving.motorway) html += '<li><strong>Motorway:</strong> ' + d.dailyDriving.motorway + '</li>';
            html += '</ul></div>';
        }
        grid.innerHTML = _localizeHtml(html, lang);
        section.hidden = false;
    },

    exteriorDesign: function(carData) {
        const section = document.getElementById('exterior-design');
        const body = document.getElementById('exteriorBody');
        if (!section || !body) return;
        if (!carData.exteriorDesign) { section.hidden = true; return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const e = _getLocalized(carData.exteriorDesign, lang);
        if (!e) return;
        let html = '';
        if (e.summary) html += '<p>' + e.summary + '</p>';
        if (e.stylingNotes && e.stylingNotes.length) html += '<ul>' + e.stylingNotes.map(n => '<li>' + n + '</li>').join('') + '</ul>';
        // Legacy descriptive fields
        if (e.front || e.side || e.rear || e.proportions || e.details) {
            html += '<div class="legacy-design-box"><ul>';
            if (e.front) html += '<li><strong>Front:</strong> ' + e.front + '</li>';
            if (e.side) html += '<li><strong>Side:</strong> ' + e.side + '</li>';
            if (e.rear) html += '<li><strong>Rear:</strong> ' + e.rear + '</li>';
            if (e.proportions) html += '<li><strong>Proportions:</strong> ' + e.proportions + '</li>';
            if (e.details) html += '<li><strong>Details:</strong> ' + e.details + '</li>';
            html += '</ul></div>';
        }
        if (e.aerodynamics) {
            html += '<div class="aero-box"><h4>' + _getLocalizedLabel('Aerodynamics', lang) + '</h4>';
            if (typeof e.aerodynamics === 'string') {
                html += '<p>' + e.aerodynamics + '</p>';
            } else {
                if (e.aerodynamics.dragCoefficient) html += '<p>Cd: ' + e.aerodynamics.dragCoefficient + '</p>';
                if (e.aerodynamics.activeAero) html += '<p>Active aero: Sí</p>';
                if (e.aerodynamics.frontSpoiler) html += '<p><strong>Front spoiler:</strong> ' + e.aerodynamics.frontSpoiler + '</p>';
                if (e.aerodynamics.rearDiffuser) html += '<p><strong>Rear diffuser:</strong> ' + e.aerodynamics.rearDiffuser + '</p>';
            }
            html += '</div>';
        }
        if (e.lighting || e.lights) {
            const lighting = e.lighting || e.lights;
            html += '<div class="lighting-box"><h4>' + _getLocalizedLabel('Lighting', lang) + '</h4>';
            if (typeof lighting === 'string') {
                html += '<p>' + lighting + '</p>';
            } else {
                html += '<ul>';
                if (lighting.headlights) html += '<li><strong>Headlights:</strong> ' + lighting.headlights + '</li>';
                if (lighting.taillights) html += '<li><strong>Taillights:</strong> ' + lighting.taillights + '</li>';
                if (lighting.signature) html += '<li><strong>Signature:</strong> ' + lighting.signature + '</li>';
                html += '</ul>';
            }
            html += '</div>';
        }
        if (e.wheels) {
            html += '<div class="wheels-box"><h4>' + _getLocalizedLabel('Wheels', lang) + '</h4>';
            if (e.wheels.standard) html += '<p><strong>Standard:</strong> ' + e.wheels.standard + '</p>';
            if (e.wheels.optional && e.wheels.optional.length) html += '<p><strong>Optional:</strong> ' + e.wheels.optional.join(', ') + '</p>';
            html += '</div>';
        }
        if (e.colors && e.colors.length) {
            html += '<div class="colors-box"><h4>' + _getLocalizedLabel('Colors', lang) + '</h4><div class="color-swatches">';
            e.colors.forEach(c => {
                const colorName = typeof c.name === 'object' ? (c.name[lang] || c.name.es || '') : c.name;
                html += '<div class="color-swatch" style="background:' + c.hex + '" title="' + colorName + '"></div>';
            });
            html += '</div></div>';
        }
        if (e.dimensionsContext) html += '<p class="dimensions-context">' + e.dimensionsContext + '</p>';
        body.innerHTML = _localizeHtml(html, lang);
        section.hidden = false;
    },

    interiorDeepDive: function(carData) {
        const section = document.getElementById('interior-deep-dive');
        const body = document.getElementById('interiorBody');
        const grid = document.getElementById('interiorGrid');
        if (!section || !body) return;
        if (!carData.interior) { section.hidden = true; return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const i = _getLocalized(carData.interior, lang);
        if (!i) return;

        const labels = {
            es: { front: 'Asientos delanteros', rear: 'Asientos traseros', boot: 'Maletero', info: 'Infoentretenimiento',
                  comfort: 'Confort', adjust: 'Ajuste', material: 'Material', legroom: 'Espacio piernas',
                  headroom: 'Espacio cabeza', capacity: 'Capacidad', seatsDown: 'Asientos abatidos',
                  practicality: 'Practicidad', screen: 'Pantalla', system: 'Sistema', connectivity: 'Conectividad', sound: 'Sonido',
                  materials: 'Materiales', seats: 'Asientos', ergonomics: 'Ergonomía', space: 'Espacio', visibility: 'Visibilidad', quality: 'Calidad' },
            en: { front: 'Front seats', rear: 'Rear seats', boot: 'Boot', info: 'Infotainment',
                  comfort: 'Comfort', adjust: 'Adjustment', material: 'Material', legroom: 'Legroom',
                  headroom: 'Headroom', capacity: 'Capacity', seatsDown: 'Seats down',
                  practicality: 'Practicality', screen: 'Screen', system: 'System', connectivity: 'Connectivity', sound: 'Sound',
                  materials: 'Materials', seats: 'Seats', ergonomics: 'Ergonomics', space: 'Space', visibility: 'Visibility', quality: 'Quality' },
            fr: { front: 'Sièges avant', rear: 'Sièges arrière', boot: 'Coffre', info: 'Infodivertissement',
                  comfort: 'Confort', adjust: 'Réglage', material: 'Matériau', legroom: 'Espace jambes',
                  headroom: 'Espace tête', capacity: 'Capacité', seatsDown: 'Sièges rabattus',
                  practicality: 'Praticité', screen: 'Écran', system: 'Système', connectivity: 'Connectivité', sound: 'Son',
                  materials: 'Matériaux', seats: 'Sièges', ergonomics: 'Ergonomie', space: 'Espace', visibility: 'Visibilité', quality: 'Qualité' },
            ar: { front: 'المقاعد الأمامية', rear: 'المقاعد الخلفية', boot: 'صندوق السيارة', info: 'نظام المعلومات والترفيه',
                  comfort: 'الراحة', adjust: 'الضبط', material: 'المادة', legroom: 'مساحة الأرجل',
                  headroom: 'مساحة الرأس', capacity: 'السعة', seatsDown: 'الكراسي مطوية',
                  practicality: 'العملية', screen: 'الشاشة', system: 'النظام', connectivity: 'الاتصال', sound: 'الصوت',
                  materials: 'المواد', seats: 'المقاعد', ergonomics: 'الأرجونومية', space: 'المساحة', visibility: 'الرؤية', quality: 'الجودة' }
        };
        const l = labels[lang] || labels.es;

        // Summary paragraph in interiorBody
        let bodyHtml = '';
        if (i.summary) bodyHtml += '<p>' + i.summary + '</p>';
        body.innerHTML = _localizeHtml(bodyHtml, lang);

        // Legacy descriptive fields (materials, seats, ergonomics, space, visibility, quality)
        const hasLegacyInterior = i.materials || i.seats || i.ergonomics || i.space || i.visibility || i.quality;
        const hasModernInterior = i.frontSeats || i.rearSeats || i.boot || i.infotainment || (i.cards && i.cards.length);

        // Pro cards in interiorGrid
        const cardDefs = [
            { icon: '💺', label: l.front, data: i.frontSeats, rows: [
                [l.comfort, 'comfort'], [l.adjust, 'adjustment'], [l.material, 'material']
            ]},
            { icon: '🚗', label: l.rear, data: i.rearSeats, rows: [
                [l.legroom, 'legroom'], [l.headroom, 'headroom'], [l.comfort, 'comfort']
            ]},
            { icon: '🗄️', label: l.boot, data: i.boot, rows: [
                [l.capacity, 'capacity', ' L'], [l.seatsDown, 'seatsDownCapacity', ' L'], [l.practicality, 'practicality']
            ]},
            { icon: '📱', label: l.info, data: i.infotainment, rows: [
                [l.screen, 'screenSize'], [l.system, 'system'], [l.sound, 'soundSystem']
            ]}
        ];

        if (grid) {
            const rootCards = Array.isArray(carData.interiorCards) ? carData.interiorCards : null;
            const rootTexts = carData.interiorText?.[lang] || carData.interiorText?.['es'] || null;
            const emojiMap = {
                screen: '🖥️', seat: '💺', light: '💡', display: '🎯',
                sound: '🔊', climate: '❄️', touch: '📱', storage: '🗄️',
                panoramic: '🌅', mirror: '🪞', hud: '🔮', massage: '💆'
            };

            let html = '';
            if (rootCards) {
                html = rootCards.map((card, idx) => {
                    const emoji = emojiMap[card.icon] || '🔧';
                    let text = {};
                    if (rootTexts) {
                        if (Array.isArray(rootTexts)) {
                            text = { desc: rootTexts[idx] };
                        } else if (rootTexts[card.id]) {
                            text = rootTexts[card.id];
                        }
                    }
                    const titleObj = card.title || text.title;
                    const descObj = card.description || text.desc;
                    const title = (titleObj ? _getLocalized(titleObj, lang) : null) || card.id;
                    const desc = descObj ? _getLocalized(descObj, lang) : '';
                    const score = card.score || 5;
                    const stars = ['', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'][Math.min(5, score)] || '★★★★★';
                    return '<div class="interior-card-pro">' +
                        '<span class="interior-card-pro-icon">' + emoji + '</span>' +
                        '<h4>' + title + '</h4>' +
                        (desc ? '<p>' + desc + '</p>' : '') +
                        '<span class="interior-score-badge">' + stars + ' ' + score + '/5</span>' +
                        '</div>';
                }).join('');
            } else {
                // Modern: carData.interior[lang] with frontSeats, rearSeats, boot, infotainment
                html = cardDefs.map((card, idx) => {
                    if (!card.data) return '';
                    let rows = card.rows.map(([label, key, suffix]) => {
                        const val = card.data[key];
                        if (val === undefined || val === null || val === true || val === false) return '';
                        const display = Array.isArray(val) ? val.join(', ') : val + (suffix || '');
                        return '<div class="int-pro-row"><span class="int-pro-label">' + label + '</span><span class="int-pro-val">' + display + '</span></div>';
                    }).filter(Boolean).join('');
                    if (!rows && card.data.connectivity && card.data.connectivity.length) {
                        rows = '<div class="int-pro-row"><span class="int-pro-label">' + l.connectivity + '</span><span class="int-pro-val">' + card.data.connectivity.join(', ') + '</span></div>';
                    }
                    if (!rows) return '';
                    return '<div class="interior-card-pro">' +
                        '<span class="interior-card-pro-icon">' + card.icon + '</span>' +
                        '<h4>' + card.label + '</h4>' +
                        '<div class="int-pro-rows">' + rows + '</div>' +
                        '</div>';
                }).join('');
            }

            // Legacy descriptive fields rendered as cards
            if (hasLegacyInterior) {
                const legacyCards = [
                    { icon: '🛋️', key: 'materials' },
                    { icon: '💺', key: 'seats' },
                    { icon: '🧍', key: 'ergonomics' },
                    { icon: '📦', key: 'space' },
                    { icon: '👁️', key: 'visibility' },
                    { icon: '✨', key: 'quality' }
                ];
                html += legacyCards.map(card => {
                    const val = i[card.key];
                    if (!val) return '';
                    return '<div class="interior-card-pro">' +
                        '<span class="interior-card-pro-icon">' + card.icon + '</span>' +
                        '<h4>' + l[card.key] + '</h4>' +
                        '<p>' + val + '</p>' +
                        '</div>';
                }).join('');
            }

            grid.innerHTML = _localizeHtml(html, lang);
        }

        section.hidden = false;
    },

    technology: function(carData) {
        const section = document.getElementById('technology');
        const grid = document.getElementById('technologyGrid');
        if (!section || !grid) return;
        if (!carData.technology) { section.hidden = true; return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const t = _getLocalized(carData.technology, lang);
        if (!t) return;
        const hasLegacyTech = t.summary || t.infotainment || t.driverAssist || t.driverAssistance || t.performanceTech || t.charging;
        let html = '';
        if (t.summary) html += '<div class="tech-card"><h4>Summary</h4><p>' + t.summary + '</p></div>';
        if (t.headUnit) {
            html += '<div class="tech-card"><h4>Head unit</h4><ul>';
            if (t.headUnit.screenSize) html += '<li><strong>Screen:</strong> ' + t.headUnit.screenSize + '</li>';
            if (t.headUnit.resolution) html += '<li><strong>Resolution:</strong> ' + t.headUnit.resolution + '</li>';
            if (t.headUnit.system) html += '<li><strong>System:</strong> ' + t.headUnit.system + '</li>';
            if (t.headUnit.processor) html += '<li><strong>Processor:</strong> ' + t.headUnit.processor + '</li>';
            if (t.headUnit.wirelessCarPlay) html += '<li>Wireless Apple CarPlay</li>';
            if (t.headUnit.wirelessAndroidAuto) html += '<li>Wireless Android Auto</li>';
            html += '</ul></div>';
        }
        if (t.audio) {
            html += '<div class="tech-card"><h4>Audio</h4><ul>';
            if (t.audio.system) html += '<li><strong>System:</strong> ' + t.audio.system + '</li>';
            if (t.audio.speakers) html += '<li><strong>Speakers:</strong> ' + t.audio.speakers + '</li>';
            if (t.audio.watts) html += '<li><strong>Watts:</strong> ' + t.audio.watts + ' W</li>';
            html += '</ul></div>';
        }
        if (t.driverDisplays) {
            html += '<div class="tech-card"><h4>Driver displays</h4><ul>';
            if (t.driverDisplays.instrumentCluster) html += '<li><strong>Cluster:</strong> ' + t.driverDisplays.instrumentCluster + '</li>';
            if (t.driverDisplays.headUpDisplay) html += '<li>Head-up display</li>';
            if (t.driverDisplays.augmentedRealityNav) html += '<li>Augmented reality nav</li>';
            html += '</ul></div>';
        }
        if (t.connectivity && Array.isArray(t.connectivity)) {
            html += '<div class="tech-card"><h4>Connectivity</h4><p>' + t.connectivity.join(', ') + '</p></div>';
        } else if (t.connectivity && typeof t.connectivity === 'string') {
            html += '<div class="tech-card"><h4>Connectivity</h4><p>' + t.connectivity + '</p></div>';
        }
        if (t.appIntegration && Array.isArray(t.appIntegration)) {
            html += '<div class="tech-card"><h4>App integration</h4><p>' + t.appIntegration.join(', ') + '</p></div>';
        } else if (t.appIntegration && typeof t.appIntegration === 'string') {
            html += '<div class="tech-card"><h4>App integration</h4><p>' + t.appIntegration + '</p></div>';
        }
        // Legacy descriptive fields
        if (t.infotainment) html += '<div class="tech-card"><h4>Infotainment</h4><p>' + t.infotainment + '</p></div>';
        if (t.driverAssist) html += '<div class="tech-card"><h4>Driver assist</h4><p>' + t.driverAssist + '</p></div>';
        if (t.driverAssistance) html += '<div class="tech-card"><h4>Driver assistance</h4><p>' + t.driverAssistance + '</p></div>';
        if (t.performanceTech) html += '<div class="tech-card"><h4>Performance tech</h4><p>' + t.performanceTech + '</p></div>';
        if (t.charging) html += '<div class="tech-card"><h4>Charging</h4><p>' + t.charging + '</p></div>';
        grid.innerHTML = _localizeHtml(html, lang);
        section.hidden = false;
    },

    safety: function(carData) {
        const section = document.getElementById('safety');
        const body = document.getElementById('safetyBody');
        if (!section || !body || !carData.safety) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const s = _getLocalized(carData.safety, lang);
        if (!s) return;
        let html = '';
        if (s.ratings) {
            html += '<div class="safety-ratings"><h4>Ratings</h4>';
            for (const [k, v] of Object.entries(s.ratings)) {
                if (typeof v === 'number') {
                    const max = k === 'overall' ? '5' : '5';
                    const labelMap = { euroNCAP: 'Euro NCAP', nhtsa: 'NHTSA', overall: 'Overall' };
                    const label = _getLocalizedLabel(labelMap[k] || k, lang);
                    html += '<div class="safety-rating"><span>' + label + '</span><span>' + v + '/' + max + '</span></div>';
                }
            }
            html += '</div>';
        } else if (s.rating && (s.rating.euroNCAP !== undefined || s.rating.nhtsa !== undefined)) {
            html += '<div class="safety-ratings"><h4>Ratings</h4>';
            if (s.rating.euroNCAP !== undefined) html += '<div class="safety-rating"><span>' + _getLocalizedLabel('Euro NCAP', lang) + '</span><span>' + s.rating.euroNCAP + '/5</span></div>';
            if (s.rating.nhtsa !== undefined) html += '<div class="safety-rating"><span>' + _getLocalizedLabel('NHTSA', lang) + '</span><span>' + s.rating.nhtsa + '/5</span></div>';
            html += '</div>';
        }
        if (s.airbags && s.airbags.length) {
            html += '<div class="safety-airbags"><h4>Airbags</h4><p>' + s.airbags.join(', ') + '</p></div>';
        } else if (typeof s.airbags === 'number') {
            html += '<div class="safety-airbags"><h4>Airbags</h4><p>' + s.airbags + ' airbags</p></div>';
        }
        if (s.driverAssist && s.driverAssist.length) {
            const items = s.driverAssist.map(function(a) { return _str(a); });
            html += '<div class="safety-assist"><h4>Driver assist</h4><ul>' + items.map(function(a) { return '<li>' + a + '</li>'; }).join('') + '</ul></div>';
        } else if (s.features && s.features.length) {
            html += '<div class="safety-assist"><h4>Driver assist</h4><ul>' + s.features.map(function(a) { return '<li>' + _str(a) + '</li>'; }).join('') + '</ul></div>';
        }
        if (s.structural) {
            html += '<div class="safety-structural"><h4>Structure</h4><p>' + _str(s.structural) + '</p></div>';
        }
        body.innerHTML = _localizeHtml(html, lang);
        if (html) section.hidden = false;
    },

    ownerReviews: function(carData) {
        const section = document.getElementById('owner-reviews');
        const grid = document.getElementById('ownerReviewsGrid');
        const sat = document.getElementById('ownershipSatisfaction');
        if (!section || !grid || !carData.ownership) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const o = _getLocalized(carData.ownership, lang);
        if (!o) return;
        if (o.ownerReviews && o.ownerReviews.length) {
            grid.innerHTML = _localizeHtml(o.ownerReviews.map(r => {
                return '<div class="owner-review-card">' +
                    '<div class="review-header"><div class="review-avatar">' + (r.author ? r.author.charAt(0) : '?') + '</div>' +
                    '<div><strong>' + (r.author || '') + '</strong><div class="review-meta">' + (r.location || '') + ' • ' + (r.ownsSince || '') + '</div></div></div>' +
                    '<p class="review-text">' + (r.quote || '') + '</p>' +
                    (r.rating ? '<div class="review-rating">' + '★'.repeat(Math.round(r.rating)) + '</div>' : '') +
                    '</div>';
            }).join(''), lang);
        }
        if (sat && o.satisfactionRating) {
            sat.innerHTML = _localizeHtml('<div class="satisfaction-badge"><span>' + o.satisfactionRating + '</span><small>/10</small></div>', lang);
        }
        if (grid.innerHTML || sat.innerHTML) section.hidden = false;
    },

    tires: function(carData) {
        const section = document.getElementById('tires-section');
        const grid = document.getElementById('tiresGrid');
        if (!section || !grid || !carData.tires) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const t = _getLocalized(carData.tires, lang);
        if (!t) return;
        let html = '';
        if (t.standard) html += '<div class="tires-card"><h4>Standard</h4><p>' + _str(t.standard) + '</p></div>';
        if (t.optional && t.optional.length) html += '<div class="tires-card"><h4>Optional</h4><p>' + t.optional.map(function(o) { return _str(o); }).join(', ') + '</p></div>';
        if (t.rearWear) html += '<div class="tires-card"><h4>Rear wear</h4><p>' + _str(t.rearWear) + '</p></div>';
        if (t.recommended) html += '<div class="tires-card"><h4>Recommended</h4><p>' + _str(t.recommended) + '</p></div>';
        if (t.sizes && t.sizes.length) {
            html += '<div class="tires-card"><h4>Sizes</h4><ul>' + t.sizes.map(s => '<li>' + _str(s) + '</li>').join('') + '</ul></div>';
        }
        grid.innerHTML = _localizeHtml(html, lang);
        if (html) section.hidden = false;
    },

    ownershipDetails: function(carData) {
        const section = document.getElementById('ownership-details');
        const grid = document.getElementById('ownershipGrid');
        if (!section || !grid) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const _ot = (typeof t === 'function') ? function(key) { return t('ownership.' + key); } : function(key) { return key; };
        const o = carData.ownership ? _getLocalized(carData.ownership, lang) : null;
        let html = '';
        if (o) {
            if (o.dailyUsability) html += '<div class="own-card"><h4>' + _ot('dailyUsability') + '</h4><p>' + _str(o.dailyUsability) + '</p></div>';
            if (o.reliability) html += '<div class="own-card"><h4>' + _ot('reliability') + '</h4><p>' + _str(o.reliability) + '</p></div>';
            if (o.longTrips) html += '<div class="own-card"><h4>' + _ot('longTrips') + '</h4><p>' + _str(o.longTrips) + '</p></div>';
            if (o.cityDriving) html += '<div class="own-card"><h4>' + _ot('cityDriving') + '</h4><p>' + _str(o.cityDriving) + '</p></div>';
            if (o.commonIssues && o.commonIssues.length) {
                html += '<div class="own-card own-issues"><h4>' + _ot('commonIssues') + '</h4><ul>';
                o.commonIssues.forEach(issue => {
                    const costText = issue.cost ? _convertEurText(_str(issue.cost)) : '';
                    const freqKey = issue.frequency ? String(issue.frequency).toLowerCase().trim() : '';
                    const freqLabel = freqKey ? ((typeof t === 'function' ? t('ownership.frequency.' + freqKey) : '') || freqKey) : '';
                    html += '<li><strong>' + _str(issue.issue) + '</strong> <span class="issue-freq">(' + freqLabel + ')</span><br><span class="issue-cost">' + costText + '</span></li>';
                });
                html += '</ul></div>';
            }
        }
        // Maintenance costs from runningCosts
        const rc = carData.runningCosts ? _getLocalized(carData.runningCosts, lang) : null;
        if (rc) {
            html += '<div class="own-card own-costs"><h4>' + _ot('maintenanceCosts') + '</h4><ul>';
            if (rc.servicing) {
                const s = rc.servicing;
                const monthsLabel = (typeof t === 'function' ? t('maintenance.months') : '') || 'meses';
                html += '<li><strong>' + _ot('interval') + ':</strong> ' + (s.intervalKm || '--') + ' km / ' + (s.intervalMonths || '--') + ' ' + monthsLabel + '</li>';
                if (s.costMinor && s.costMinor.value) html += '<li><strong>' + _ot('minorService') + ':</strong> ' + _formatCountryMoney(_convertMoney(s.costMinor.value, s.costMinor.currency || 'EUR')) + '</li>';
                if (s.costMajor && s.costMajor.value) html += '<li><strong>' + _ot('majorService') + ':</strong> ' + _formatCountryMoney(_convertMoney(s.costMajor.value, s.costMajor.currency || 'EUR')) + '</li>';
            }
            // Country-specific road tax and insurance group are handled by country-manager; here show generic/localized info when available
            const countryMap = { gb: 'uk', de: 'germany', es: 'spain' };
            const igKey = (typeof currentCountry !== 'undefined' && currentCountry) ? countryMap[currentCountry] : null;
            if (igKey && rc.roadTax && rc.roadTax[igKey]) html += '<li><strong>' + _ot('roadTax') + ':</strong> ' + rc.roadTax[igKey] + '</li>';
            if (igKey && rc.insuranceGroups && rc.insuranceGroups[igKey]) html += '<li><strong>' + _ot('insurance') + ':</strong> ' + rc.insuranceGroups[igKey] + '</li>';
            if (rc.tyres) {
                const perUnit = (typeof t === 'function' ? t('maintenance.perUnit') : '') || '/unidad';
                const tyreCost = rc.tyres.front && rc.tyres.front.costPerTyre ? _convertMoney(rc.tyres.front.costPerTyre.value, rc.tyres.front.costPerTyre.currency || 'EUR') : null;
                html += '<li><strong>' + _ot('tyres') + ':</strong> ' + (rc.tyres.front?.size || '') + (tyreCost ? ' ≈ ' + _formatCountryMoney(tyreCost) + ' ' + perUnit : '') + '</li>';
            }
            if (rc.fuel) {
                html += '<li><strong>' + _ot('fuel') + ':</strong> ' + _str(rc.fuel.type) + (rc.fuel.tankCapacity && rc.fuel.tankCapacity.value ? ', ' + rc.fuel.tankCapacity.value + ' ' + rc.fuel.tankCapacity.unit : '') + '</li>';
            }
            html += '</ul></div>';
        }
        grid.innerHTML = _localizeHtml(html, lang);
        if (html) section.hidden = false;
    },

    maintenance: function(carData) {
        const section = document.getElementById('maintenance');
        if (!section) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const rc = carData.runningCosts ? _getLocalized(carData.runningCosts, lang) : null;
        if (!rc) return;

        const _mt = (typeof t === 'function') ? function(key) { return t('maintenance.' + key); } : function(key) { return key; };
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = _localizeHtml(_str(val), lang); };

        if (rc.servicing) {
            const s = rc.servicing;
            set('maintInterval', (s.intervalKm || '--') + ' km / ' + (s.intervalMonths || '--') + ' ' + (_mt('months') || 'meses'));
            // maintMinor / maintMajor are rendered in the active currency by country-manager.js
        }
        // Road tax and insurance group are populated by country-manager.js based on selected country
        if (rc.fuel) {
            set('maintFuelType', rc.fuel.type);
            if (rc.fuel.tankCapacity && rc.fuel.tankCapacity.value) set('maintTank', rc.fuel.tankCapacity.value + ' ' + rc.fuel.tankCapacity.unit);
            if (rc.fuel.realWorldCombined && rc.fuel.realWorldCombined.value) set('maintRealConsumption', rc.fuel.realWorldCombined.value + ' ' + rc.fuel.realWorldCombined.unit);
        }
        if (rc.warranty) {
            const w = rc.warranty;
            const yearsLabel = _mt('years') || 'años';
            const unlimitedKm = _mt('unlimitedKm') || 'sin límite de km';
            const powertrainLabel = _mt('powertrain') || 'Tren motriz';
            let txt = (w.years || '--') + ' ' + yearsLabel + (w.km ? ' / ' + w.km + ' km' : ' / ' + unlimitedKm);
            if (w.powertrain && w.powertrain.years) {
                txt += ' · ' + powertrainLabel + ' ' + w.powertrain.years + ' ' + yearsLabel + ' / ' + (w.powertrain.km || '--') + ' km';
            }
            set('maintWarranty', txt);
        }
    },

    environmental: function(carData) {
        const section = document.getElementById('environmental');
        const grid = document.getElementById('environmentalGrid');
        if (!section || !grid) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const fe = carData.fuelEconomy;
        let html = '';
        if (fe?.emissions?.co2) {
            html += '<div class="eco-card"><h4>CO2</h4><p class="eco-value">' + fe.emissions.co2.value + ' <span>' + fe.emissions.co2.unit + '</span></p></div>';
        }
        if (fe?.emissions?.nox) {
            html += '<div class="eco-card"><h4>NOx</h4><p class="eco-value">' + fe.emissions.nox.value + ' <span>' + fe.emissions.nox.unit + '</span></p></div>';
        }
        if (fe?.emissions?.particulates) {
            html += '<div class="eco-card"><h4>Particulas</h4><p class="eco-value">' + fe.emissions.particulates.value + ' <span>' + fe.emissions.particulates.unit + '</span></p></div>';
        }
        if (fe?.consumption?.combined) {
            html += '<div class="eco-card"><h4>Consumo</h4><p class="eco-value">' + fe.consumption.combined.value + ' <span>' + fe.consumption.combined.unit + '</span></p></div>';
        }
        grid.innerHTML = _localizeHtml(html, lang);
        if (html) section.hidden = false;
    },

    dealership: function(carData) {
        const section = document.getElementById('dealership-cta');
        const grid = document.getElementById('dealershipGrid');
        if (!section || !grid) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const name = (lang === 'ar' && carData.basicInfo?.nameAr) ? carData.basicInfo.nameAr : (carData.basicInfo?.name || '');
        let html = '';
        html += '<div class="dealership-card"><h4>Solicitar prueba de conduccion</h4><p>Reserva una prueba gratuita con un concesionario oficial de ' + name + '.</p><a href="#contacto">Contactar concesionario</a></div>';
        html += '<div class="dealership-card"><h4>Configurador online</h4><p>Personaliza colores, equipamiento y acabados desde casa.</p><a href="#configurador">Configurar ' + name + '</a></div>';
        html += '<div class="dealership-card"><h4>Financiacion</h4><p>Descubre las mejores condiciones de financiacion y leasing.</p><a href="#financiacion">Ver ofertas</a></div>';
        grid.innerHTML = _localizeHtml(html, lang);
        if (html) section.hidden = false;
    },

    gallery: function(carData) {
        const grid = document.getElementById('galleryGrid');
        if (!grid || !Array.isArray(carData.images?.gallery)) return;
        const images = carData.images.gallery.map(img => ({
            url: typeof img === 'string' ? img : img.url,
            alt: typeof img === 'object' ? (img.alt || '') : ''
        }));
        grid.innerHTML = images.map((img, i) => {
            return '<div class="gallery-item"><img loading="lazy" data-index="' + i + '" src="' + img.url + '" alt="' + img.alt + '"></div>';
        }).join('');
        const section = document.getElementById('gallery');
        if (section && images.length > 0) section.hidden = false;
        SECTION_RENDERERS._initLightbox(images);
    },

    _initLightbox: function(images) {
        if (!images.length || this._lightboxBound) return;
        this._lightboxBound = true;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const closeBtn = lightbox?.querySelector('.lightbox-close');
        const prevBtn = lightbox?.querySelector('.lightbox-prev');
        const nextBtn = lightbox?.querySelector('.lightbox-next');
        if (!lightbox || !lightboxImg || !closeBtn || !prevBtn || !nextBtn) return;
        let currentIndex = 0;

        let thumbStrip = lightbox.querySelector('.lightbox-thumbs');
        if (!thumbStrip) {
            thumbStrip = document.createElement('div');
            thumbStrip.className = 'lightbox-thumbs';
            lightbox.querySelector('.lightbox-content').appendChild(thumbStrip);
        }
        thumbStrip.innerHTML = images.map((img, i) =>
            '<img src="' + img.url + '" alt="" data-index="' + i + '" loading="lazy">'
        ).join('');

        const show = (i) => {
            currentIndex = (i + images.length) % images.length;
            const img = images[currentIndex];
            lightboxImg.src = img.url;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = img.alt || (currentIndex + 1) + ' / ' + images.length;
            lightbox.hidden = false;
            thumbStrip.querySelectorAll('img').forEach(function(t, ti) {
                t.classList.toggle('active', ti === currentIndex);
            });
            var activeThumb = thumbStrip.querySelector('img.active');
            if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        };
        const close = () => { lightbox.hidden = true; lightboxImg.src = ''; };
        document.getElementById('galleryGrid')?.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                show(parseInt(e.target.dataset.index || '0', 10));
            }
        });
        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', function(e) { e.stopPropagation(); show(currentIndex - 1); });
        nextBtn.addEventListener('click', function(e) { e.stopPropagation(); show(currentIndex + 1); });
        thumbStrip.addEventListener('click', function(e) {
            if (e.target.tagName === 'IMG') {
                e.stopPropagation();
                show(parseInt(e.target.dataset.index || '0', 10));
            }
        });
        lightbox.addEventListener('click', function(e) { if (e.target === lightbox) close(); });
        document.addEventListener('keydown', function(e) {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(currentIndex - 1);
            if (e.key === 'ArrowRight') show(currentIndex + 1);
        });

        var touchStartX = 0;
        var touchEndX = 0;
        var touchStartY = 0;
        var touchEndY = 0;
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            var dx = touchEndX - touchStartX;
            var dy = touchEndY - touchStartY;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) show(currentIndex - 1);
                else show(currentIndex + 1);
            } else if (Math.abs(dy) > 100 && Math.abs(dy) > Math.abs(dx)) {
                close();
            }
        }, { passive: true });
    },

    timeline: function(carData) {
        const grid = document.getElementById('timelineGrid');
        if (!grid) { console.warn('[CarRenderer] timelineGrid not found'); return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const isAr = lang === 'ar';
        const pt = carData.pageText && carData.pageText[lang];
        const ptEs = carData.pageText && carData.pageText['es'];
        // Find the timeline with actual km/cost data from any available pageText language
        const allTimelines = carData.pageText ? Object.values(carData.pageText).map(p => p.timeline).filter(Array.isArray) : [];
        const baseItems = (allTimelines.find(tl => tl.some(i => i.km)) || (carData.content && carData.content.timeline) || carData.timeline || []);
        const textItems = (pt && pt.timeline) || (ptEs && ptEs.timeline) || [];
        const items = baseItems.length ? baseItems.map((base, i) => {
            const text = textItems[i] || {};
            return Object.assign({}, base, {
                title: text.title || base.title,
                desc: text.desc || text.description || base.desc || base.description,
                serviceAr: text.serviceAr || base.serviceAr,
                titleAr: text.titleAr || base.titleAr,
                descriptionAr: text.descriptionAr || base.descriptionAr,
                descAr: text.descAr || base.descAr
            });
        }) : textItems;
        if (!Array.isArray(items) || items.length === 0) { console.warn('[CarRenderer] No timeline data'); return; }
        let html = '';
        items.forEach(function(item) {
            var costStr = '--';
            if (item.cost && item.cost.value !== undefined && item.cost.currency) {
                const converted = _convertMoney(item.cost.value, item.cost.currency);
                costStr = _formatCountryMoney(converted);
            }
            const defaultService = (typeof t === 'function' ? t('maintenance.service') : '') || 'Service';
            let title, desc;
            if (lang === 'en') {
                title = item.serviceEn || item.title || item.service || defaultService;
                desc = item.descriptionEn || item.desc || item.description || '';
            } else if (lang === 'fr') {
                title = item.serviceFr || item.title || item.service || defaultService;
                desc = item.descriptionFr || item.desc || item.description || '';
            } else if (isAr) {
                title = item.serviceAr || item.titleAr || item.service || item.title || defaultService;
                desc = item.descriptionAr || item.descAr || item.description || item.desc || '';
            } else {
                title = item.service || item.title || defaultService;
                desc = item.description || item.desc || '';
            }
            html += '<div class="timeline-item">' +
                '<div class="timeline-marker">' + (item.km || 0).toLocaleString() + ' km</div>' +
                '<div class="timeline-content">' +
                '<h4>' + _str(title) + '</h4>' +
                '<p>' + _str(desc) + '</p>' +
                '<span class="timeline-costs">' + _str(costStr) + '</span>' +
                '</div></div>';
        });
        grid.innerHTML = _localizeHtml(html, lang);
    },

    prosCons: function(carData) {
        const prosList = document.getElementById('prosList');
        const consList = document.getElementById('consList');
        if (!prosList || !consList) { console.warn('[CarRenderer] prosList/consList not found'); return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const ptLang = carData.pageText && carData.pageText[lang];
        const ptEs = carData.pageText && carData.pageText['es'];
        const contentPros = _getLocalized(carData.content && carData.content.pros, lang);
        const contentCons = _getLocalized(carData.content && carData.content.cons, lang);
        const resolve = (typeof window !== 'undefined' && typeof window.replaceCarPlaceholders === 'function') ? window.replaceCarPlaceholders : function(s) { return s; };
        const pros = (ptLang && ptLang.pros) || (ptEs && ptEs.pros) || contentPros;
        const cons = (ptLang && ptLang.cons) || (ptEs && ptEs.cons) || contentCons;
        if (pros && Array.isArray(pros) && pros.length > 0) {
            prosList.innerHTML = _localizeHtml('<ul>' + pros.map(function(p) { return '<li>' + resolve(p) + '</li>'; }).join('') + '</ul>', lang);
        } else { console.warn('[CarRenderer] No pros data'); }
        if (cons && Array.isArray(cons) && cons.length > 0) {
            consList.innerHTML = _localizeHtml('<ul>' + cons.map(function(c) { return '<li>' + resolve(c) + '</li>'; }).join('') + '</ul>', lang);
        } else { console.warn('[CarRenderer] No cons data'); }
    },

    score: function(carData) {
        if (!carData.rating) { console.warn('[CarRenderer] No rating data'); return; }
        const r = carData.rating;
        var map = {
            'ratingOverall': r.overall,
            'ratingPerformance': r.performance,
            'ratingComfort': r.comfort,
            'ratingTechnology': r.technology,
            'ratingDesign': r.design,
            'ratingValue': r.value
        };
        for (var id in map) {
            var val = map[id];
            var bar = document.getElementById(id);
            var valueEl = document.getElementById(id + 'Value');
            if (bar && val !== undefined) {
                bar.style.width = (val * 10) + '%';
                var track = bar.parentElement;
                if (track) {
                    track.setAttribute('role', 'progressbar');
                    track.setAttribute('aria-valuemin', '0');
                    track.setAttribute('aria-valuemax', '10');
                    track.setAttribute('aria-valuenow', String(val));
                    var label = track.previousElementSibling;
                    track.setAttribute('aria-label', (label && label.textContent ? label.textContent.trim() : id));
                }
            }
            if (valueEl && val !== undefined) valueEl.textContent = val + '/10';
        }
        var scoreBox = document.querySelector('.score-box h3');
        if (scoreBox && r.overall !== undefined) scoreBox.textContent = r.overall + ' / 10';
    },

    faq: function(carData) {
        const list = document.getElementById('faqList');
        if (!list) { console.warn('[CarRenderer] faqList not found'); return; }
        const lang = this._getLang ? this._getLang() : 'es';
        const ptLang = carData.pageText && carData.pageText[lang];
        const ptEs = carData.pageText && carData.pageText['es'];
        let rawFaq = (ptLang && ptLang.faq) || (ptEs && ptEs.faq) || (carData.content && _getLocalized(carData.content.faq, lang));
        if (!rawFaq) { console.warn('[CarRenderer] No FAQ data'); return; }
        let items = [];
        if (Array.isArray(rawFaq)) {
            items = rawFaq;
        } else if (typeof rawFaq === 'object') {
            const keys = Object.keys(rawFaq).filter(function(k) { return k.match(/^q\d+$/); }).sort();
            items = keys.map(function(k) {
                const n = k.replace(/^q/, '');
                return { question: rawFaq[k], answer: rawFaq['a' + n] };
            });
        }
        if (items.length === 0) { console.warn('[CarRenderer] No FAQ data'); return; }
        const resolve = (typeof window !== 'undefined' && typeof window.replaceCarPlaceholders === 'function') ? window.replaceCarPlaceholders : function(s) { return s; };
        list.innerHTML = _localizeHtml(items.map(function(item) {
            return '<details class="faq-item">' +
                '<summary class="faq-question">' + resolve(_str(item.question)) + '</summary>' +
                '<div class="faq-answer">' + _convertEurText(resolve(_str(item.answer))) + '</div>' +
                '</details>';
        }).join(''), lang);
    },

    options: function(carData) {
        const tbody = document.getElementById('optionsTableBody');
        if (!tbody || !Array.isArray(carData.options)) return;
        const lang = this._getLang ? this._getLang() : 'es';
        const c = _getCurrentCountryData();
        const countryOpts = (c && Array.isArray(c.options)) ? c.options : null;
        const showEUR = !c || c.currency === 'EUR';
        tbody.innerHTML = carData.options.map(function(opt, i) {
            const price = countryOpts ? countryOpts[i] : (opt.price && opt.price.value);
            let priceStr;
            if (price === 0) {
                priceStr = (typeof t === 'function' ? t('options.included') : '') || _getLabel('Incluido', lang) || 'Incluido';
            } else if (price !== undefined && price !== null) {
                priceStr = _formatCountryMoney(price);
                if (!showEUR && c.exchangeRateEUR) {
                    const eurEquivalent = Math.round(price / c.exchangeRateEUR);
                    priceStr += ' <span class="eur-price">(' + eurEquivalent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' €)</span>';
                }
            } else {
                priceStr = '--';
            }
            const worthStr = (typeof t === 'function' ? t('options.' + (opt.worthIt ? 'yes' : 'no')) : '') || _getLabel(opt.worthIt ? 'Si' : 'No', lang);
            let optName;
            if (lang === 'en' && opt.nameEn) {
                optName = _str(opt.nameEn);
            } else if (lang === 'es' && opt.nameEs) {
                optName = _str(opt.nameEs);
            } else if (lang === 'fr' && opt.nameFr) {
                optName = _str(opt.nameFr);
            } else if (lang === 'ar' && opt.nameAr) {
                optName = (typeof opt.nameAr === 'object' && opt.nameAr.ar) ? opt.nameAr.ar : (typeof opt.nameAr === 'object' && opt.nameAr.es) ? opt.nameAr.es : _str(opt.nameAr);
            } else if (typeof opt.name === 'object' && opt.name[lang]) {
                optName = opt.name[lang];
            } else if (typeof opt.name === 'object' && opt.name.es) {
                optName = opt.name.es;
            } else {
                optName = _str(opt.name);
            }
            let resaleImpact = _str(opt.resaleImpact);
            if (typeof t === 'function') {
                const impactMap = {
                    high: 'options.impactHigh',
                    medium: 'options.impactMed',
                    med: 'options.impactMed',
                    low: 'options.impactLow',
                    neutral: 'options.impactNeutral'
                };
                const impactKey = resaleImpact && resaleImpact.toLowerCase ? resaleImpact.toLowerCase() : '';
                const translationKey = impactMap[impactKey];
                if (translationKey) {
                    const translatedImpact = t(translationKey);
                    if (translatedImpact && translatedImpact !== translationKey) {
                        resaleImpact = translatedImpact;
                    }
                }
            }
            return '<tr>' +
                '<td>' + optName + '</td>' +
                '<td class="option-price">' + priceStr + '</td>' +
                '<td><span class="tag ' + (opt.worthIt === true ? 'tag-yes' : opt.worthIt === false ? 'tag-no' : 'tag-maybe') + '">' + worthStr + '</span></td>' +
                '<td>' + resaleImpact + '</td>' +
                '</tr>';
        }).join('');
        const section = document.getElementById('options');
        if (section && carData.options.length > 0) section.hidden = false;
    },

    relatedCars: function(carData) {
        const section = document.getElementById('related-cars');
        const grid = document.getElementById('relatedCarsGrid');
        const footerGrid = document.getElementById('footerRelatedModels');
        const lang = this._getLang ? this._getLang() : 'es';
        const models = Array.isArray(carData.relatedModels) ? carData.relatedModels
            : (Array.isArray(carData.comparisons) ? carData.comparisons : []);
        if (!models.length) {
            if (section) section.hidden = true;
            return;
        }
        const renderName = function(m) {
            if (m.nameAr) return m.nameAr;
            if (m.name && typeof m.name === 'object') {
                const localized = _getLocalized(m.name, lang);
                if (localized) return localized;
            }
            return m.name || m.slug || m.carId || m.id || '';
        };
        const html = models.map(m => {
            const slug = m.slug || m.carId || m.id || '';
            return '<div class="related-car-card"><a href="' + slug + '.html">' + renderName(m) + '</a></div>';
        }).join('');
        if (grid) grid.innerHTML = _localizeHtml(html, lang);
        if (section && html) section.hidden = false;
        if (footerGrid) {
            footerGrid.innerHTML = _localizeHtml(models.map(m => {
                const slug = m.slug || m.carId || m.id || '';
                return '<a href="' + slug + '.html">' + renderName(m) + '</a>';
            }).join(''), lang);
        }
    },
};

const POWERTRAIN_RENDERERS = {
    petrol: function(carData) { this._renderPowertrainCommon(carData, 'petrol'); },
    diesel: function(carData) { this._renderPowertrainCommon(carData, 'diesel'); },
    'mild-hybrid': function(carData) { this._renderPowertrainCommon(carData, 'mild-hybrid'); },
    hybrid: function(carData) { this._renderPowertrainCommon(carData, 'hybrid'); },
    phev: function(carData) { this._renderPowertrainCommon(carData, 'phev'); },
    electric: function(carData) { this._renderPowertrainCommon(carData, 'electric'); }
};

// Expose for car-renderer.js
window.SECTION_RENDERERS = SECTION_RENDERERS;
window.POWERTRAIN_RENDERERS = POWERTRAIN_RENDERERS;
