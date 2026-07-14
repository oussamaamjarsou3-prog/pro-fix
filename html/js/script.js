// ================= DARK MODE =================

const darkBtn = document.getElementById("darkbtn");

function updateThemeButton() {
    if (!darkBtn) return;
    const isLight = document.body.classList.contains("light");
    darkBtn.textContent = isLight ? "☀️" : "🌙";
    const tr = typeof window.t === "function" ? window.t : (k) => k;
    darkBtn.setAttribute("aria-label", isLight ? tr("theme.light") : tr("theme.dark"));
}

if (darkBtn) {
    const storedTheme = localStorage.getItem("profix-theme");
    if (storedTheme === "light") {
        document.body.classList.add("light");
    } else if (storedTheme === "dark") {
        document.body.classList.remove("light");
    }
    updateThemeButton();

    darkBtn.addEventListener("click", () => {
        const lightMode = document.body.classList.toggle("light");
        localStorage.setItem("profix-theme", lightMode ? "light" : "dark");
        updateThemeButton();
    });
}

// ================= MOBILE MENU =================

const menuBtn = document.getElementById("menuBtn");
let nav = document.getElementById("siteNav") || document.querySelector("nav");

// Move mobile nav out of the glass header only on mobile so position:fixed is
// relative to the viewport. On desktop keep it inside the header for the flex layout.
function positionNav() {
    if (!nav) return;
    const mobile = window.matchMedia('(max-width: 1024px)').matches;
    const header = document.querySelector('.site-header');
    if (mobile) {
        if (nav.parentElement && nav.parentElement !== document.body) {
            document.body.appendChild(nav);
        }
    } else if (header && nav.parentElement !== header) {
        header.appendChild(nav);
        // Reset mobile menu state when returning to desktop
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            document.body.classList.remove('nav-open');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.classList.remove('active');
            menuBtn.textContent = menuBtn.dataset.openIcon || '☰';
        }
    }
}
positionNav();
window.addEventListener('resize', positionNav);

let closeTimeout = null;
let transitionEndHandler = null;

function clearPendingClose() {
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
    if (transitionEndHandler) {
        nav.removeEventListener('transitionend', transitionEndHandler);
        transitionEndHandler = null;
    }
}

function closeMobileMenu() {
    if (!nav || !menuBtn) return;
    if (!nav.classList.contains('active')) return;
    clearPendingClose();
    nav.classList.remove('active');
    document.body.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.classList.remove('active');
    menuBtn.textContent = menuBtn.dataset.openIcon || '☰';

    transitionEndHandler = (e) => {
        if (e.target === nav && !nav.classList.contains('active')) {
            nav.removeEventListener('transitionend', transitionEndHandler);
            transitionEndHandler = null;
        }
    };
    nav.addEventListener('transitionend', transitionEndHandler);

    // Fallback if transitionend doesn't fire
    closeTimeout = setTimeout(() => {
        closeTimeout = null;
    }, 600);
}

function openMobileMenu() {
    if (!nav || !menuBtn) return;
    clearPendingClose();
    requestAnimationFrame(() => {
        nav.classList.add('active');
        document.body.classList.add('nav-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        menuBtn.classList.add('active');
        // Swap icon to close (X)
        if (!menuBtn.dataset.openIcon) menuBtn.dataset.openIcon = menuBtn.textContent || '☰';
        menuBtn.textContent = '✕';
    });
}

function updateMenuButtonIcon() {
    if (!menuBtn) return;
    menuBtn.classList.toggle('active', nav.classList.contains('active'));
    menuBtn.textContent = nav.classList.contains('active') ? '✕' : (menuBtn.dataset.openIcon || '☰');
}

if (menuBtn && nav) {
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (nav.classList.contains("active")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close if it's the mega-menu trigger or inside mega-menu
            if (link.closest('.mega-menu-container') || link.closest('.mega-menu')) {
                console.log('🔥 [script.js] Nav link click INSIDE mega-menu, ignoring');
                return;
            }
            setTimeout(closeMobileMenu, 100);
        });
    });

    // Close when clicking overlay / empty space
    document.addEventListener('click', (e) => {
        if (!nav.classList.contains('active')) return;
        if (!nav.contains(e.target) && e.target !== menuBtn) {
            closeMobileMenu();
        }
    });

    // Close when clicking on the nav panel background (not links/buttons)
    nav.addEventListener('click', (e) => {
        if (e.target === nav) {
            closeMobileMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ================= SEARCH =================

const searchInput = document.getElementById("searchInput") || document.getElementById("headerSearch");

function initHeaderSearch() {
    if (!searchInput) return;
    const header = document.querySelector('.site-header');
    const form = document.querySelector('.header-search, [data-search-container]');
    let resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.className = 'search-results';
        resultsContainer.setAttribute('role', 'listbox');
        resultsContainer.setAttribute('aria-label', 'Resultados de búsqueda');
        (form || header).appendChild(resultsContainer);
    }

    let activeIndex = -1;
    let results = [];
    let debounceTimer = null;

    function escapeHtml(text) {
        if (text == null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function highlight(text, query) {
        if (!query) return escapeHtml(text);
        const safe = escapeHtml(text);
        const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return safe.replace(re, '<mark>$1</mark>');
    }

    function renderResults(items, query) {
        results = items;
        activeIndex = -1;
        if (!items.length) {
            const q = escapeHtml(query || '');
            resultsContainer.innerHTML = `<div class="search-no-results" role="status" aria-live="polite">Sin resultados para &ldquo;${q}&rdquo;</div>`;
            resultsContainer.hidden = false;
            return;
        }
        resultsContainer.innerHTML = items.map((item, idx) => {
            const url = escapeHtml(window.CARSPECIO_SEARCH ? window.CARSPECIO_SEARCH.getUrl(item) : item.url);
            const label = item.type === 'guide' ? 'Guía' : 'Coche';
            return `
                <a href="${url}" class="search-result" role="option" data-idx="${idx}" aria-selected="false">
                    <span class="search-result-type">${escapeHtml(label)}</span>
                    <span class="search-result-name">${highlight(item.name, query)}</span>
                    <span class="search-result-category">${escapeHtml(item.categoryName || item.category || '')}</span>
                </a>`;
        }).join('');
        resultsContainer.hidden = false;
    }

    function closeResults() {
        resultsContainer.innerHTML = '';
        resultsContainer.hidden = true;
        results = [];
        activeIndex = -1;
    }

    function updateActiveIndex(idx) {
        const items = resultsContainer.querySelectorAll('.search-result');
        items.forEach((el, i) => {
            el.classList.toggle('active', i === idx);
            el.setAttribute('aria-selected', String(i === idx));
        });
        activeIndex = idx;
    }

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (!query || query.length < 2) {
                closeResults();
                return;
            }
            if (typeof window.CARSPECIO_SEARCH !== 'object') {
                renderResults([], query);
                return;
            }
            renderResults(window.CARSPECIO_SEARCH.search(query), query);
        }, 180);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (!results.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            updateActiveIndex((activeIndex + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            updateActiveIndex((activeIndex - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0 && activeIndex < results.length) {
                e.preventDefault();
                window.location.href = window.CARSPECIO_SEARCH.getUrl(results[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            closeResults();
            searchInput.blur();
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            closeResults();
        }
    });
}

initHeaderSearch();

// Legacy: filter cards on pages that still rely on inline search
const cards = document.querySelectorAll(".review-card, .review-card-dash, .articles .card");
if (searchInput && cards.length) {
    searchInput.addEventListener("keyup", () => {
        const value = searchInput.value.toLowerCase().trim();
        cards.forEach(card => {
            const title = card.querySelector("h3");
            if (!title) return;
            const match = !value || title.textContent.toLowerCase().includes(value);
            card.style.display = match ? "" : "none";
        });
    });
}

// ================= HERO SLIDER =================

/* Hero rotation: home page uses #heroKicker in js/home.js; legacy pages may rotate title */
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const heroKicker = document.getElementById("heroKicker");

if (heroTitle && heroText && !heroKicker) {
    const tr = typeof window.t === "function" ? window.t : (k) => k;
    const heroData = [
        { title: tr("heroSlider.slide1"), text: tr("heroSlider.slide1Text") },
        { title: tr("heroSlider.slide2"), text: tr("heroSlider.slide2Text") },
        { title: tr("heroSlider.slide3"), text: tr("heroSlider.slide3Text") }
    ];

    let heroIndex = 0;

    setInterval(() => {
        heroIndex = (heroIndex + 1) % heroData.length;
        heroTitle.textContent = heroData[heroIndex].title;
        heroText.textContent = heroData[heroIndex].text;
    }, 5000);

}

// ================= HEADER SCROLL =================

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {

    if (header) {

        const isScrolled = window.scrollY > 50;
        header.classList.toggle("scroll-header", isScrolled);
        header.classList.toggle("scrolled", isScrolled);

    }

});

// ================= CATEGORY FILTER =================

const filterBtns =
document.querySelectorAll(".filter-btn");

const categoryCards =
document.querySelectorAll(".category-card");

filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        filterBtns.forEach(b => {

            b.classList.remove("active");

        });

        btn.classList.add("active");

        const filter = btn.dataset.filter;

        categoryCards.forEach(card => {

            const category =
            card.dataset.category;

            if (
                filter === "all" ||
                category === filter
            ) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

});

const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const brandsMarquee = document.querySelector(".brands-scroll--marquee");
if (brandsMarquee && !reducedMotion && !brandsMarquee.dataset.duped) {
    const items = Array.from(brandsMarquee.children);
    items.forEach(item => brandsMarquee.appendChild(item.cloneNode(true)));
    brandsMarquee.dataset.duped = "true";
}

// ================= BRAND HUB SEARCH =================

const brandHubSearch = document.querySelector("[data-brand-hub-search]");
const brandHubCards = Array.from(document.querySelectorAll("[data-brand-card]"));
const brandHubDirectoryItems = Array.from(document.querySelectorAll("[data-brand-directory-item]"));
const brandHubCount = document.querySelector("[data-brand-results-count]");
const brandHubEmpty = document.querySelector("[data-brand-empty-state]");
const brandHubLetterLinks = Array.from(document.querySelectorAll("[data-letter-filter]"));
const brandHubDirectoryGroups = Array.from(document.querySelectorAll(".directory-group"));

if (brandHubSearch && (brandHubCards.length || brandHubDirectoryItems.length)) {
    const getVisibleBrandName = (item) => {
        const heading = item.querySelector("h3");
        if (heading) return heading.textContent.toLowerCase().trim();
        return item.textContent.toLowerCase().trim();
    };

    const updateBrandHub = () => {
        const query = brandHubSearch.value.toLowerCase().trim();
        const visibleBrands = new Set();

        [...brandHubCards, ...brandHubDirectoryItems].forEach(item => {
            const label = (item.dataset.brand || item.textContent).toLowerCase();
            const matches = !query || label.includes(query);
            item.hidden = !matches;

            if (matches) {
                visibleBrands.add(getVisibleBrandName(item));
            }
        });

        brandHubDirectoryGroups.forEach(group => {
            const hasVisibleItems = Array.from(group.querySelectorAll("[data-brand-directory-item]"))
                .some(item => !item.hidden);
            group.hidden = !hasVisibleItems;
        });

        brandHubLetterLinks.forEach(link => {
            const targetId = link.getAttribute("href");
            if (!targetId || !targetId.startsWith("#")) return;

            const targetGroup = document.querySelector(targetId);
            if (!targetGroup) return;

            const hasVisibleItems = Array.from(targetGroup.querySelectorAll("[data-brand-directory-item]"))
                .some(item => !item.hidden);

            link.hidden = !hasVisibleItems;
        });

        if (brandHubCount) {
            const tr = typeof window.t === "function" ? window.t : (k) => k;
            const countLabel = visibleBrands.size === 1 ? tr("brand.singular") : tr("brand.plural");
            brandHubCount.textContent = `${visibleBrands.size} ${countLabel}`;
        }

        if (brandHubEmpty) {
            brandHubEmpty.hidden = visibleBrands.size !== 0;
        }
    };

    brandHubSearch.addEventListener("input", updateBrandHub);
    updateBrandHub();
}

// ================= SCROLL REVEAL =================

const revealElements = document.querySelectorAll(
".category-card, .testimonial-card, .gallery-grid img, .info-card, .version-card, .consumption-card, .interior-card, .pros-card, .opinion-card, .related-card, .specs-card, .vs-card, .stat-item, .review-card-dash, .cat-tile, .brand-tile, .rank-card, .news-card, .newsletter-inner, .footer-col, .tools-hero-panel, .tools-benefit-card, .calc-controls, .tools-results-shell, .tools-panel, .marcas-hero__panel, .finder-shell, .brand-card-hub, .category-card-marcas, .directory-group, .future-card"
);

revealElements.forEach(el => el.classList.add("reveal"));

const staggerContainers = document.querySelectorAll(
".vs-grid, .stats-bar-inner, .review-grid, .cat-grid, .brands-scroll, .rank-grid, .news-grid, .footer-grid, .tools-card-grid, .tools-benefit-grid, .brand-grid, .category-grid-marcas, .directory-layout, .future-grid"
);

const baseDelay = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--reveal-stagger")) || 80;

staggerContainers.forEach(container => {
    Array.from(container.children).forEach((child, index) => {
        if (!child.classList || !child.classList.contains("reveal")) return;
        child.style.setProperty("--reveal-delay", `${index * baseDelay}ms`);
    });
});

const revealNow = (el) => {
    el.classList.add("is-visible");
    el.classList.add("active");
    el.classList.add("show");
    el.classList.add("show-spec");
};

if (revealElements.length) {
    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach(revealNow);
    } else {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    revealNow(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
        );

        revealElements.forEach(el => observer.observe(el));
    }
}

// ================= FAQ =================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    item.addEventListener("click", () => {

        item.classList.toggle("open");
        item.classList.toggle("active");

    });

});

// ================= PARALLAX HERO =================

window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    const heroVideo =
    document.querySelector(".hero-video");

    if (heroVideo) {

        heroVideo.style.transform =
        `translateY(${scroll * 0.2}px)`;

    }

});

// ================= CARD HOVER EFFECT =================

const hoverCards = document.querySelectorAll(
".card, .related-card, .deal-card, .price-card"
);

hoverCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect =
        card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.background =
        `radial-gradient(circle at ${x}px ${y}px,
        rgba(59,130,246,0.15),
        #111827 40%)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.background = "#111827";

    });

});

// ================= COUNTER ANIMATION =================

const counters = document.querySelectorAll(".price");

counters.forEach(counter => {

    const target =
    +counter.innerText.replace(/\D/g,'');

    let count = 0;

    const increment = target / 80;

    const updateCounter = setInterval(() => {

        count += increment;

        if(count >= target){

            counter.innerText =
            target.toLocaleString() + "€";

            clearInterval(updateCounter);

        }

        else{

            counter.innerText =
            Math.floor(count)
            .toLocaleString() + "€";

        }

    },20);

});

// ================= ACTIVE NAV LINKS =================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".rs3-nav a, .rs7-nav a, .bmw-m5-nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop;

        if(window.scrollY >= sectionTop - 200){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active");

        }

    });

});
const playBtn = document.getElementById("playSound");
const audio = document.getElementById("rs3Audio") || document.getElementById("bmw-m5Audio") || document.getElementById("rs7Audio");

if(playBtn && audio){

    playBtn.addEventListener("click", () => {

        audio.play();

    });

}
