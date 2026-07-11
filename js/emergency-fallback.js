/**
 * CarSpecio Emergency Fallback
 * Fills empty content sections if the main renderer failed.
 * Reads fallback text dynamically from carData.pageText — no hardcoded values.
 * Extracted from rs7.html reference implementation (June 2026).
 */
(function() {
    'use strict';

    function emergencyFill() {
        // Only proceed if carData is available
        const data = typeof window !== 'undefined' ? window.carData : carData;
        if (typeof data === 'undefined' || !data) {
            console.warn('[EmergencyFallback] carData not available — skipping');
            return;
        }

        const rawLang = typeof window.currentLang === 'function' ? window.currentLang() : (window.currentLang || 'es');
        const currentLang = String(rawLang).split('-')[0].toLowerCase().trim();
        const pt = data.pageText?.[currentLang] || data.pageText?.['es'];

        if (!pt) {
            console.warn('[EmergencyFallback] pageText not available for lang:', currentLang);
            return;
        }

        // 1. Score description
        var sd = document.querySelector('[data-i18n="score.desc"]');
        if (sd && !sd.textContent.trim() && pt.scoreDesc) {
            sd.innerHTML = pt.scoreDesc;
            console.log('[EmergencyFallback] filled score.desc');
        }

        // 2. Worth / value description
        var wd = document.querySelector('[data-i18n="worth.desc"]');
        if (wd && !wd.textContent.trim() && pt.worthDesc) {
            wd.innerHTML = pt.worthDesc;
            console.log('[EmergencyFallback] filled worth.desc');
        }

        // 3. Pros list
        var pc = document.querySelector('[data-i18n-list="pros.items"]');
        if (pc && pc.children.length === 0 && pt.pros && pt.pros.length) {
            pc.innerHTML = pt.pros.map(item => '<li>' + item + '</li>').join('');
            console.log('[EmergencyFallback] filled pros.items');
        }

        // 4. Cons list
        var cc = document.querySelector('[data-i18n-list="cons.items"]');
        if (cc && cc.children.length === 0 && pt.cons && pt.cons.length) {
            cc.innerHTML = pt.cons.map(item => '<li>' + item + '</li>').join('');
            console.log('[EmergencyFallback] filled cons.items');
        }

        // 5. Electric section fallback - fill from data.electric if still showing placeholders
        if (data.electric) {
            const e = data.electric;
            const setText = (id, val, suffix) => {
                const el = document.getElementById(id);
                if (el && (el.textContent === '--' || !el.textContent.trim()) && val !== undefined && val !== null) {
                    el.textContent = val + (suffix || '');
                    console.log('[EmergencyFallback] filled electric field:', id);
                }
            };
            if (e.batteryCapacity?.value) setText('electricBattery', e.batteryCapacity.value);
            if (e.electricRange?.value) setText('electricRange', e.electricRange.value);
            if (e.charging?.ac?.power) setText('electricAcPower', e.charging.ac.power);
            if (e.charging?.ac?.time) {
                const acTimeEl = document.getElementById('electricAcTime');
                if (acTimeEl && (acTimeEl.textContent === '--' || !acTimeEl.textContent.trim())) {
                    acTimeEl.textContent = e.charging.ac.time + ' h';
                    console.log('[EmergencyFallback] filled electricAcTime');
                }
            }
            if (e.charging?.dc?.power) setText('electricDcPower', e.charging.dc.power);
            if (e.charging?.dc?.time?.value) {
                const dcTimeEl = document.getElementById('electricDcTime');
                const pct = e.charging.dc.time.percentage ? ' (' + e.charging.dc.time.percentage + '%)' : '';
                if (dcTimeEl && (dcTimeEl.textContent === '--' || !dcTimeEl.textContent.trim())) {
                    dcTimeEl.textContent = e.charging.dc.time.value + ' min' + pct;
                    console.log('[EmergencyFallback] filled electricDcTime');
                }
            }
            if (e.motor?.power?.value) setText('electricMotorPower', e.motor.power.value);
            if (e.motor?.type) {
                const motorTypeEl = document.getElementById('electricMotorType');
                const count = e.motor.count ? e.motor.count + 'x ' : '';
                if (motorTypeEl && (motorTypeEl.textContent === '--' || !motorTypeEl.textContent.trim())) {
                    motorTypeEl.textContent = count + e.motor.type;
                    console.log('[EmergencyFallback] filled electricMotorType');
                }
            }
            if (data.fuelEconomy?.energyConsumption?.combined?.value) {
                setText('electricConsumption', data.fuelEconomy.energyConsumption.combined.value);
            }
            const section = document.getElementById('electric-section');
            if (section) section.hidden = false;
        }
    }

    // Auto-run after 2 seconds (same timing as RS7)
    function scheduleEmergencyFill() {
        setTimeout(function() {
            try {
                emergencyFill();
            } catch (e) {
                console.error('[EmergencyFallback] Error during fill:', e);
            }
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleEmergencyFill);
    } else {
        scheduleEmergencyFill();
    }

    // Expose globally for manual invocation
    window.emergencyFill = emergencyFill;
})();
