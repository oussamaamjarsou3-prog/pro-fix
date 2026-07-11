/**
 * CarSpecio — Mega Menu Full Implementation
 * Dynamically generates brands, categories, and models for all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initMegaMenu();
});

function initMegaMenu() {
    const container = document.getElementById('megaMenuContainer');
    const panel = document.getElementById('megaMenuPanel');
    const closeBtn = document.getElementById('megaMenuClose');
    const trigger = document.getElementById('megaMenuTrigger');
    const searchInput = document.getElementById('megaMenuSearch');

    if (!container || !panel || !trigger) {
        return;
    }

    const stepBrands = document.getElementById('stepBrands');
    const stepCategories = document.getElementById('stepCategories');
    const stepModels = document.getElementById('stepModels');
    const crumbBrands = document.getElementById('crumbBrands');
    const crumbCategory = document.getElementById('crumbCategory');
    const crumbModel = document.getElementById('crumbModel');

    let currentBrand = '';
    let currentCategory = '';
    let clickOpened = false;

    // ── DYNAMIC CONTENT GENERATION ────────────────────────
    populateMegaMenu();

    function populateMegaMenu() {
        const brandsContainer = document.getElementById('megaBrands');
        let categoriesContainer = document.getElementById('megaCategories');
        let modelsContainer = document.getElementById('megaModels');

        if (!brandsContainer) return;

        // If brands already exist in HTML (like index.html), skip generation
        if (brandsContainer.querySelector('.mega-menu__brand')) return;

        const brandList = [
            'Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen', 'Opel',
            'Toyota', 'Honda', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Mitsubishi', 'Suzuki', 'Infiniti', 'Acura',
            'Tesla', 'Ford', 'Chevrolet', 'Jeep', 'Cadillac', 'Dodge', 'Lincoln', 'GMC', 'Buick', 'Ram', 'Chrysler',
            'Ferrari', 'Lamborghini', 'Maserati', 'Alfa Romeo', 'Fiat',
            'Renault', 'Peugeot', 'Citroën', 'DS', 'Hyundai', 'Kia', 'Genesis',
            'Aston Martin', 'Bentley', 'Rolls-Royce', 'McLaren', 'Jaguar', 'Land Rover', 'Mini', 'Lotus', 'Morgan',
            'Volvo', 'Polestar', 'BYD', 'NIO', 'Chery'
        ];

        const allCategories = ['deportivos', 'sedan', 'suv', 'electricos', 'híbridos', 'lujo', 'compactos', 'familiar', 'hatchback', 'pickup'];

        // Generate brands
        brandList.forEach(brandName => {
            const a = document.createElement('a');
            a.href = '#';
            a.className = 'mega-menu__brand';
            a.dataset.brand = brandName;
            // Check if this brand has any models with pages
            const brandData = (typeof brandModels !== 'undefined') ? brandModels[brandName] : null;
            const hasPages = brandData && Object.values(brandData).some(models =>
                models && models.some(m => typeof modelPageMap !== 'undefined' && modelPageMap[m])
            );
            if (!hasPages) {
                a.classList.add('mega-menu__brand--soon');
            }
            a.innerHTML = `<span>${brandName}</span>`;
            brandsContainer.appendChild(a);
        });

        // Generate category groups into the dedicated list container (preserve header)
        const categoriesList = document.getElementById('megaCategoriesList');
        if (categoriesList) {
            // Check if already has proper category groups (index.html style)
            if (!categoriesList.querySelector('.mega-menu__category-group')) {
                // Clear existing content (like flat category buttons)
                categoriesList.innerHTML = '';
                brandList.forEach(brandName => {
                    const b = { name: brandName };
                    const group = document.createElement('div');
                    group.className = 'mega-menu__category-group';
                    group.dataset.brand = b.name;

                    const h4 = document.createElement('h4');
                    h4.textContent = b.name;
                    group.appendChild(h4);

                    const list = document.createElement('div');
                    list.className = 'mega-menu__category-list';

                    // Use brandModels categories if available, otherwise use all
                    const brandData = (typeof brandModels !== 'undefined') ? brandModels[b.name] : null;
                    const cats = brandData ? Object.keys(brandData).filter(c => brandData[c] && brandData[c].length > 0) : allCategories;

                    cats.forEach(cat => {
                        const catLink = document.createElement('a');
                        catLink.href = '#';
                        catLink.className = 'mega-menu__category';
                        catLink.dataset.category = cat;
                        catLink.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                        list.appendChild(catLink);
                    });

                    group.appendChild(list);
                    categoriesList.appendChild(group);
                });
            }
        }

        // Generate model groups if container exists and is empty
        if (modelsContainer && !modelsContainer.querySelector('.mega-menu__model-group')) {
            brandList.forEach(brandName => {
                const brandData = (typeof brandModels !== 'undefined') ? brandModels[brandName] : null;
                if (brandData) {
                    Object.keys(brandData).forEach(cat => {
                        const models = brandData[cat];
                        if (!models || models.length === 0) return;

                        const group = document.createElement('div');
                        group.className = 'mega-menu__model-group';
                        group.dataset.brand = brandName;
                        group.dataset.category = cat;

                        const h4 = document.createElement('h4');
                        h4.textContent = brandName + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1);
                        group.appendChild(h4);

                        const list = document.createElement('div');
                        list.className = 'mega-menu__model-list';

                        models.forEach(modelName => {
                            const modelLink = document.createElement('a');
                            const modelPage = (typeof modelPageMap !== 'undefined' && modelPageMap[modelName]) ? modelPageMap[modelName] : '#';
                            modelLink.href = modelPage;
                            modelLink.className = 'mega-menu__model';
                            if (modelPage === '#') {
                                modelLink.classList.add('mega-menu__model--soon');
                                modelLink.title = 'Próximamente';
                                modelLink.innerHTML = modelName + ' <span class="mega-menu__soon-badge">Próximamente</span>';
                            } else {
                                modelLink.textContent = modelName;
                            }
                            modelLink.dataset.model = modelName;
                            list.appendChild(modelLink);
                        });

                        group.appendChild(list);
                        modelsContainer.appendChild(group);
                    });
                } else {
                    // Brand has no model data at all — generate placeholder groups for all categories
                    allCategories.forEach(cat => {
                        const group = document.createElement('div');
                        group.className = 'mega-menu__model-group';
                        group.dataset.brand = brandName;
                        group.dataset.category = cat;

                        const h4 = document.createElement('h4');
                        h4.textContent = brandName + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1);
                        group.appendChild(h4);

                        const list = document.createElement('div');
                        list.className = 'mega-menu__model-list';
                        list.innerHTML = '<p class="mega-menu__empty">Próximamente</p>';

                        group.appendChild(list);
                        modelsContainer.appendChild(group);
                    });
                }
            });
        }
    }

    // ── STEP NAVIGATION ───────────────────────────────────
    function showStep(step) {
        [stepBrands, stepCategories, stepModels].forEach(s => {
            if (s) {
                s.classList.remove('active', 'mm-step--active');
            }
        });

        switch(step) {
            case 'brands':
                if (stepBrands) stepBrands.classList.add('active', 'mm-step--active');
                if (crumbBrands) crumbBrands.classList.add('mega-menu__crumb--active');
                if (crumbCategory) { crumbCategory.classList.remove('mega-menu__crumb--active'); crumbCategory.textContent = ''; }
                if (crumbModel) { crumbModel.classList.remove('mega-menu__crumb--active'); crumbModel.textContent = ''; }
                break;
            case 'categories':
                if (stepCategories) stepCategories.classList.add('active', 'mm-step--active');
                if (crumbBrands) crumbBrands.classList.remove('mega-menu__crumb--active');
                if (crumbCategory) crumbCategory.classList.add('mega-menu__crumb--active');
                if (crumbModel) { crumbModel.classList.remove('mega-menu__crumb--active'); crumbModel.textContent = ''; }
                break;
            case 'models':
                if (stepModels) stepModels.classList.add('active', 'mm-step--active');
                if (crumbBrands) crumbBrands.classList.remove('mega-menu__crumb--active');
                if (crumbCategory) crumbCategory.classList.remove('mega-menu__crumb--active');
                if (crumbModel) crumbModel.classList.add('mega-menu__crumb--active');
                break;
        }
    }

    showStep('brands');

    // ── EVENT LISTENERS ─────────────────────────────────────

    function getFocusables() {
        return Array.from(panel.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter(el => !el.disabled && el.offsetParent !== null);
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const focusables = getFocusables();
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function openWithFocus() {
        panel.classList.add('mm-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        clickOpened = true;
        setTimeout(() => {
            const focusables = getFocusables();
            const search = panel.querySelector('input[type="search"]');
            if (search) search.focus();
            else if (focusables.length) focusables[0].focus();
        }, 50);
        panel.addEventListener('keydown', trapFocus);
    }

    function closeAndReturnFocus() {
        panel.classList.remove('mm-open');
        clickOpened = false;
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
        }
        panel.removeEventListener('keydown', trapFocus);
    }

    function toggleMenu(e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const isOpen = panel.classList.contains('mm-open');
        if (isOpen) {
            closeAndReturnFocus();
        } else {
            openWithFocus();
        }
    }

    // Trigger click / touch
    if (trigger) {
        trigger.addEventListener('click', toggleMenu);
        trigger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        });
    }

    // Hover open (desktop only)
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (container && !isTouchDevice) {
        container.addEventListener('mouseenter', () => {
            if (!clickOpened) {
                panel.classList.add('mm-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'true');
            }
        });
        container.addEventListener('mouseleave', () => {
            if (!clickOpened) {
                panel.classList.remove('mm-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                setTimeout(() => {
                    if (!panel.classList.contains('mm-open')) {
                        currentBrand = ''; currentCategory = '';
                        showStep('brands');
                        if (searchInput) searchInput.value = '';
                        document.querySelectorAll('.mega-menu__brand').forEach(b => { b.style.display = 'flex'; });
                    }
                }, 300);
            }
        });
    }

    // Brand / Category / Model clicks (event delegation for dynamic content)
    panel.addEventListener('click', function(e) {
        const brand = e.target.closest('.mega-menu__brand');
        if (brand) {
            e.preventDefault();
            e.stopPropagation();
            currentBrand = brand.dataset.brand;
            document.querySelectorAll('.mega-menu__category-group').forEach(g => g.classList.remove('active'));
            const group = document.querySelector(`.mega-menu__category-group[data-brand="${currentBrand}"]`);
            if (group) {
                group.classList.add('active');
            } else {
                // Fallback: show empty categories state if no group generated for this brand
                const catsContainer = document.getElementById('megaCategoriesList');
                if (catsContainer) {
                    // Remove any previous fallback message
                    const oldMsg = catsContainer.querySelector('.mega-menu__fallback-msg');
                    if (oldMsg) oldMsg.remove();
                    const msg = document.createElement('p');
                    msg.className = 'mega-menu__empty mega-menu__fallback-msg';
                    msg.textContent = 'No hay categorías disponibles para esta marca. Próximamente.';
                    catsContainer.appendChild(msg);
                }
            }
            if (crumbCategory) crumbCategory.textContent = currentBrand;
            showStep('categories');
            return;
        }

        const category = e.target.closest('.mega-menu__category');
        if (category) {
            e.preventDefault();
            e.stopPropagation();
            currentCategory = category.dataset.category;
            document.querySelectorAll('.mega-menu__model-group').forEach(g => g.classList.remove('active'));
            const group = document.querySelector(`.mega-menu__model-group[data-brand="${currentBrand}"][data-category="${currentCategory}"]`);
            if (group) {
                group.classList.add('active');
            } else {
                const modelsContainer = document.getElementById('megaModelsList');
                if (modelsContainer) {
                    const oldMsg = modelsContainer.querySelector('.mega-menu__fallback-msg');
                    if (oldMsg) oldMsg.remove();
                    const msg = document.createElement('p');
                    msg.className = 'mega-menu__empty mega-menu__fallback-msg';
                    msg.textContent = 'No hay modelos disponibles para esta categoría. Próximamente.';
                    modelsContainer.appendChild(msg);
                }
            }
            if (crumbModel) crumbModel.textContent = category.textContent;
            showStep('models');
            return;
        }
    });

    // Also intercept clicks on model links to prevent them from closing the mobile menu
    panel.addEventListener('click', function(e) {
        const modelLink = e.target.closest('.mega-menu__model');
        if (modelLink) {
            e.stopPropagation();
        }
    });

    // Back buttons
    const backToBrands = document.getElementById('backToBrands');
    if (backToBrands) backToBrands.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showStep('brands'); });

    const backToCategories = document.getElementById('backToCategories');
    if (backToCategories) backToCategories.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showStep('categories'); });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            closeAndReturnFocus();
        });
    }

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.mega-menu__brand').forEach(brand => {
                const span = brand.querySelector('span');
                if (span) brand.style.display = span.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
            });
        });
    }

    // Click outside + Escape
    document.addEventListener('click', e => {
        if (!e.target.closest('.mega-menu-container')) {
            if (panel.classList.contains('mm-open')) closeAndReturnFocus();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && panel.classList.contains('mm-open')) closeAndReturnFocus();
    });
}
