/**
 * CarSpecio — Car Sections Pro Animations
 * Handles scroll-reveal, bar animations, counter animations
 * for driving, technology, safety, powertrain sections.
 */
(function () {
    'use strict';

    // ── 1. Intersection Observer for scroll-reveal ──────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('cs-revealed');
            revealObserver.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function observeReveal(selector) {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.style.setProperty('--reveal-delay', `${i * 80}ms`);
            el.classList.add('cs-reveal');
            revealObserver.observe(el);
            // Check if already in view (fix for elements loaded after page scroll)
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                requestAnimationFrame(() => el.classList.add('cs-revealed'));
            }
        });
    }

    // ── 2. Animate progress bars (driving-rating, safety-ncap, powertrain) ──
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('[data-width]').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
            barObserver.unobserve(entry.target);
        });
    }, { threshold: 0.2 });

    function initBars() {
        // driving-rating-fill
        document.querySelectorAll('.driving-rating-fill').forEach(bar => {
            const val = bar.dataset.width || '75%';
            bar.style.width = '0';
            bar.dataset.width = val;
        });
        // safety-ncap-bar
        document.querySelectorAll('.safety-ncap-bar').forEach(bar => {
            const val = bar.dataset.width || '80%';
            bar.style.width = '0';
            bar.dataset.width = val;
        });
        // powertrain-spec-bar
        document.querySelectorAll('.powertrain-spec-bar').forEach(bar => {
            const val = bar.dataset.width || '70%';
            bar.style.width = '0';
            bar.dataset.width = val;
        });

        // Observe parent containers
        document.querySelectorAll('.driving-card, .safety-ncap-table, .powertrain-card').forEach(el => {
            barObserver.observe(el);
        });
    }

    // ── 3. Counter animation for powertrain values ──────────────────
    function animateValue(el) {
        const raw = el.dataset.target || el.textContent;
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const suffix = raw.replace(/[0-9.,]/g, '').trim();
        if (isNaN(num)) return;
        const duration = 1400;
        const start = performance.now();
        const decimals = raw.includes('.') ? (raw.split('.')[1] || '').replace(/[^0-9]/g, '').length : 0;
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = (num * eased).toFixed(decimals);
            el.textContent = Number(current).toLocaleString('es-ES', { minimumFractionDigits: decimals }) + (suffix ? ' ' + suffix : '');
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll('.powertrain-card-value[data-target]').forEach(animateValue);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    function initCounters() {
        document.querySelectorAll('.powertrain-card').forEach(card => {
            counterObserver.observe(card);
        });
    }

    // ── 4. Technology table row highlight on hover ──────────────────
    function initTechTable() {
        document.querySelectorAll('.tech-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(59,130,246,0.06)';
                row.style.transition = 'background 0.2s ease';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = '';
            });
        });
    }

    // ── 5. Exterior highlight slide-in ──────────────────────────────
    function initExteriorHighlights() {
        const items = document.querySelectorAll('.exterior-highlight-item');
        if (!items.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 60);
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.15 });
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-16px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s var(--ease-out)';
            obs.observe(item);
        });
    }

    // ── 6. Review body paragraph fade-in ───────────────────────────
    function initReviewFade() {
        const paras = document.querySelectorAll('.review-body p');
        if (!paras.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.1 });
        paras.forEach((p, i) => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(12px)';
            p.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s var(--ease-out) ${i * 80}ms`;
            obs.observe(p);
        });
    }

    // ── 7. CSS reveal classes injected once ─────────────────────────
    function injectRevealStyles() {
        if (document.getElementById('cs-reveal-style')) return;
        const style = document.createElement('style');
        style.id = 'cs-reveal-style';
        style.textContent = `
            .cs-reveal {
                opacity: 0;
                transform: translateY(var(--reveal-distance, 14px));
                transition: opacity var(--reveal-duration, 700ms) var(--ease-out, cubic-bezier(.16,1,.3,1)) var(--reveal-delay, 0ms),
                            transform var(--reveal-duration, 700ms) var(--ease-out, cubic-bezier(.16,1,.3,1)) var(--reveal-delay, 0ms);
            }
            .cs-reveal.cs-revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // ── 8. INIT ─────────────────────────────────────────────────────
    function init() {
        injectRevealStyles();
        observeReveal('.driving-card, .technology-card, .safety-card, .powertrain-card, .interior-card-pro, .exterior-highlight-item');
        initBars();
        initCounters();
        initTechTable();
        initExteriorHighlights();
        initReviewFade();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
