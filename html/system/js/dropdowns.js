/**
 * carspecio Dropdown System
 * Centralized dropdown functionality for country and language selectors
 * Usage: Include this script and add data-dropdown attributes to HTML
 */

(function() {
    'use strict';
    
    // Configuration
    const config = {
        debug: false,
        closeOnOutsideClick: true,
        closeOnEscape: true
    };

    // Utility: Log with prefix
    function log(message, type = 'info') {
        if (!config.debug) return;
        const prefix = '[Dropdowns]';
        if (type === 'error') console.error(prefix, message);
        else if (type === 'warn') console.warn(prefix, message);
        else console.log(prefix, message);
    }

    // Utility: Get elements by ID
    function getEl(id) {
        return document.getElementById(id);
    }

    // Dropdown Manager
    const DropdownManager = {
        // Store active dropdowns
        activeDropdowns: new Map(),

        // Initialize a dropdown
        init: function(toggleId, menuId, options = {}) {
            log(`INIT CALLED: ${toggleId}, ${menuId}`);
            
            // Prevent duplicate initialization
            if (this.activeDropdowns.has(toggleId)) {
                log(`${toggleId} already initialized, skipping`);
                return this.activeDropdowns.get(toggleId);
            }
            
            const toggle = getEl(toggleId);
            const menu = getEl(menuId);

            if (!toggle || !menu) {
                log(`Elements not found: ${toggleId} or ${menuId}`, 'error');
                return null;
            }

            log(`Initializing: ${toggleId} + ${menuId} - SUCCESS`);

            // Move menu to body so position:fixed is relative to viewport,
            // not constrained by the glass header (which creates a containing block).
            if (menu.parentElement && menu.parentElement !== document.body) {
                menu.dataset.originalParent = menu.parentElement.id || '';
                document.body.appendChild(menu);
            }

            // Normalize dropdown buttons: wrap the leading flag/emoji in a fixed-width
            // icon span so rows stay aligned and the icon size is consistent.
            menu.querySelectorAll('button[data-icon]').forEach(btn => {
                if (btn.querySelector('.dropdown-icon')) return;
                const icon = btn.dataset.icon || '';
                const text = btn.textContent.replace(icon, '').trim();
                let iconHTML = icon;
                if (window.flagEmojiToCode && window.createFlagImg) {
                    const code = window.flagEmojiToCode(icon);
                    if (code) {
                        iconHTML = window.createFlagImg(code).outerHTML;
                    }
                }
                btn.innerHTML = '<span class="dropdown-icon">' + iconHTML + '</span><span class="dropdown-label">' + (text || btn.textContent.trim()) + '</span>';
            });

            // Store reference
            this.activeDropdowns.set(toggleId, { toggle, menu, options });

            // Add click handler to toggle
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle(toggleId);
            });

            // Prevent menu clicks from closing
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Handle selection items
            const items = menu.querySelectorAll('[data-value], [data-country], [data-lang]');
            log(`Found ${items.length} selection items in ${toggleId}`);
            
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = item.dataset.value || item.dataset.country || item.dataset.lang;
                    const label = item.dataset.label || value;
                    const icon = item.dataset.icon || '';

                    log(`CLICKED: ${value} (${label}), icon: ${icon}`);

                    // Update active state
                    items.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');

                    // Update toggle button
                    const iconSpan = toggle.querySelector('.btn-icon');
                    const textSpan = toggle.querySelector('.btn-text');
                    log(`Updating toggle: iconSpan=${iconSpan ? 'found' : 'missing'}, textSpan=${textSpan ? 'found' : 'missing'}`);
                    log(`New values: icon=${icon}, label=${label}`);
                    
                    if (iconSpan) {
                        if (window.flagEmojiToCode && window.createFlagImg) {
                            const code = window.flagEmojiToCode(icon);
                            if (code) {
                                iconSpan.innerHTML = '';
                                iconSpan.appendChild(window.createFlagImg(code));
                            } else {
                                iconSpan.textContent = icon;
                            }
                        } else {
                            iconSpan.textContent = icon;
                        }
                        log('Icon updated');
                    }
                    if (textSpan) {
                        textSpan.textContent = label;
                        log('Text updated');
                    }

                    // Update data attribute on toggle for CSS styling
                    if (toggleId.includes('country')) {
                        toggle.setAttribute('data-country', value);
                    } else if (toggleId.includes('lang')) {
                        toggle.setAttribute('data-lang', value);
                        // Load the selected language
                        if (typeof loadLanguage === 'function') {
                            loadLanguage(value);
                        }
                    }

                    // Close menu
                    this.close(toggleId);
                    log('Menu closed');

                    // Trigger callback if provided
                    if (options.onSelect) {
                        options.onSelect({ value, label, icon, item });
                    }

                    // Dispatch custom event
                    const eventName = toggleId.includes('country') ? 'country:changed' : 
                                     toggleId.includes('lang') ? 'language:changed' : 'dropdown:changed';
                    document.dispatchEvent(new CustomEvent(eventName, {
                        detail: { value, label, icon, dropdownId: toggleId }
                    }));
                });
            });

            log(`Initialized: ${toggleId}`);
            return { toggle, menu };
        },

        // Toggle dropdown
        toggle: function(toggleId) {
            log(`TOGGLE CALLED: ${toggleId}`);
            const dropdown = this.activeDropdowns.get(toggleId);
            if (!dropdown) {
                log(`Toggle: ${toggleId} not found in activeDropdowns`, 'error');
                return;
            }

            const { toggle, menu } = dropdown;
            const isOpen = menu.classList.contains('active');
            log(`Toggle: ${toggleId}, isOpen: ${isOpen}`);

            // Close all other dropdowns first
            this.activeDropdowns.forEach((d, id) => {
                if (id !== toggleId) this.close(id);
            });

            // Toggle current
            if (isOpen) {
                this.close(toggleId);
            } else {
                const rect = toggle.getBoundingClientRect();
                const menuWidth = 180;
                const menuHeight = Math.min(320, window.innerHeight - rect.bottom - 12);
                const leftPos = Math.max(8, rect.right - menuWidth);
                menu.style.setProperty('position', 'fixed', 'important');
                menu.style.setProperty('top', `${rect.bottom + 4}px`, 'important');
                menu.style.setProperty('left', `${leftPos}px`, 'important');
                menu.style.setProperty('right', 'auto', 'important');
                menu.style.setProperty('bottom', 'auto', 'important');
                menu.style.setProperty('width', `${menuWidth}px`, 'important');
                menu.style.setProperty('min-width', `${menuWidth}px`, 'important');
                menu.style.setProperty('max-height', `${menuHeight}px`, 'important');
                menu.classList.add('active');
                toggle.setAttribute('aria-expanded', 'true');
                log(`${toggleId}: opened`);
            }
        },

        // Close dropdown
        close: function(toggleId) {
            const dropdown = this.activeDropdowns.get(toggleId);
            if (!dropdown) return;

            const { toggle, menu } = dropdown;
            menu.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        },

        // Close all dropdowns
        closeAll: function() {
            this.activeDropdowns.forEach((_, id) => this.close(id));
        }
    };

    // Global click handler to close dropdowns
    if (config.closeOnOutsideClick) {
        document.addEventListener('click', (e) => {
            log('Global click detected, target:', e.target.className || e.target.tagName);
            DropdownManager.closeAll();
        });
    }

    // Escape key handler
    if (config.closeOnEscape) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                DropdownManager.closeAll();
            }
        });
    }

    // Auto-initialize on DOM ready
    function autoInit() {
        log('Auto-initializing dropdowns...');
        // 1. Initialize known country/language dropdowns FIRST with specific handlers
        if (getEl('countryToggle') && getEl('countryMenu')) {
            DropdownManager.init('countryToggle', 'countryMenu', {
                onSelect: (data) => {
                    log('Country selected:', data.value, data.label);
                    // Update all country-dependent info (prices, currency, fiscal table)
                    if (typeof window.applyCountry === 'function') {
                        window.applyCountry(data.value);
                    } else if (typeof applyCountry === 'function') {
                        applyCountry(data.value);
                    }
                }
            });
        }

        if (getEl('langToggle') && getEl('langMenu')) {
            DropdownManager.init('langToggle', 'langMenu', {
                onSelect: (data) => {
                    document.documentElement.lang = data.value;
                    if (typeof window.loadLanguage === 'function') {
                        window.loadLanguage(data.value);
                    } else if (typeof applyTranslations === 'function') {
                        applyTranslations();
                    }
                }
            });
        }

        // 2. Initialize any other dropdowns via data attributes (skips already initialized)
        const dropdownContainers = document.querySelectorAll('[data-dropdown]');
        dropdownContainers.forEach(container => {
            const toggle = container.querySelector('[data-dropdown-toggle]');
            const menu = container.querySelector('[data-dropdown-menu]');
            
            if (toggle && menu) {
                const toggleId = toggle.id || `dropdown-toggle-${Math.random().toString(36).substr(2, 9)}`;
                const menuId = menu.id || `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;
                
                if (!toggle.id) toggle.id = toggleId;
                if (!menu.id) menu.id = menuId;

                DropdownManager.init(toggleId, menuId, {
                    onSelect: (data) => {
                        log('Selection:', data.value, data.label);
                    }
                });
            }
        });

        log('Auto-initialization complete');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    // Expose to global scope for manual use
    window.DropdownManager = DropdownManager;
    window.initDropdowns = autoInit;
})();
