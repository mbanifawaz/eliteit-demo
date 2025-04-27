/**
 * Internationalization handler for Elite IT website
 */

class I18n {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.initialized = false;
        this.observers = [];
    }

    /**
     * Initialize the internationalization system
     */
    async init() {
        // Check if user has a language preference stored
        const storedLang = localStorage.getItem('elite_lang') || 'en';
        
        // Load translations for the default/stored language
        await this.loadTranslations(storedLang);
        
        // Add language switcher to the page
        this.addLanguageSwitcher();
        
        // Apply translations
        this.applyTranslations();
        
        this.initialized = true;
        
        // Apply RTL/LTR based on language
        this.applyDirection();
    }

    /**
     * Load translations for a specific language
     * @param {string} lang - Language code (en, ar)
     */
    async loadTranslations(lang) {
        try {
            const response = await fetch(`/i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            
            const translations = await response.json();
            this.translations[lang] = translations;
            this.currentLang = lang;
            
            // Save language preference
            localStorage.setItem('elite_lang', lang);
            
            return translations;
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to English if translations fail to load
            if (lang !== 'en') {
                console.log('Falling back to English');
                return this.loadTranslations('en');
            }
        }
    }

    /**
     * Switch to a different language
     * @param {string} lang - Language code to switch to
     */
    async switchLanguage(lang) {
        if (this.currentLang === lang) return;
        
        await this.loadTranslations(lang);
        this.applyTranslations();
        this.applyDirection();
        
        // Notify any observers
        this.notifyObservers();
    }

    /**
     * Add language switcher to the page
     */
    addLanguageSwitcher() {
        // Create language switcher container
        const switcher = document.createElement('div');
        switcher.className = 'language-toggle';
        
        // Add language options
        const langBtn = document.createElement('button');
        langBtn.className = 'lang-btn';
        langBtn.innerHTML = `<i class="fas fa-globe"></i><span data-i18n="language.switcher">Language</span>`;
        
        const langContent = document.createElement('div');
        langContent.className = 'lang-dropdown-content';
        
        // Add English option
        const enOption = document.createElement('a');
        enOption.href = '#';
        enOption.setAttribute('data-i18n', 'language.en');
        enOption.textContent = 'English';
        enOption.setAttribute('data-lang', 'en');
        enOption.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchLanguage('en');
            switcher.classList.remove('active');
        });
        
        // Add Arabic option
        const arOption = document.createElement('a');
        arOption.href = '#';
        arOption.setAttribute('data-i18n', 'language.ar');
        arOption.textContent = 'العربية';
        arOption.setAttribute('data-lang', 'ar');
        arOption.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchLanguage('ar');
            switcher.classList.remove('active');
        });
        
        // Append options to dropdown
        langContent.appendChild(enOption);
        langContent.appendChild(arOption);
        
        // Build the dropdown
        switcher.appendChild(langBtn);
        switcher.appendChild(langContent);
        
        // Toggle dropdown on click
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            switcher.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            switcher.classList.remove('active');
        });
        
        // Add the language switcher to the header
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const rightButtons = document.querySelector('.right-buttons');
            if (rightButtons) {
                rightButtons.insertBefore(switcher, rightButtons.firstChild);
            } else {
                themeToggle.parentNode.insertBefore(switcher, themeToggle);
            }
        }
    }

    /**
     * Apply translations to the DOM
     */
    applyTranslations() {
        const translations = this.translations[this.currentLang];
        if (!translations) return;
        
        // Update document title
        document.title = translations.meta.title;
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(translations, key);
            
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Set placeholder for form elements
                    element.placeholder = translation;
                } else {
                    // Set innerHTML for other elements
                    element.innerHTML = translation;
                }
            }
        });
        
        // The language switcher is now automatically updated with other elements
        // that have data-i18n attributes
        
        // Update theme dropdown if it exists (it gets created after i18n init)
        setTimeout(() => {
            document.querySelectorAll('.theme-option span[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.getNestedTranslation(translations, key);
                if (translation) {
                    element.textContent = translation;
                }
            });
        }, 500);
    }

    /**
     * Apply RTL or LTR direction based on language
     */
    applyDirection() {
        const translations = this.translations[this.currentLang];
        if (!translations || !translations.meta) return;
        
        // Set direction on root element
        document.documentElement.setAttribute('dir', translations.meta.dir);
        document.documentElement.setAttribute('lang', translations.meta.lang);
    }

    /**
     * Get a nested translation by key path
     * @param {Object} obj - Translation object
     * @param {string} path - Dot notation path to translation (e.g., "header.nav.home")
     * @return {string|null} - The translation or null if not found
     */
    getNestedTranslation(obj, path) {
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            } else {
                return null;
            }
        }
        
        return result;
    }

    /**
     * Add an observer to be notified of language changes
     * @param {Function} callback - Function to call when language changes
     */
    addObserver(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
        }
    }

    /**
     * Notify all observers of a language change
     */
    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.currentLang, this.translations[this.currentLang]);
            } catch (error) {
                console.error('Error in observer:', error);
            }
        });
    }

    /**
     * Get translation for a specific key
     * @param {string} key - The translation key (dot notation)
     * @return {string} - The translation or the key if not found
     */
    t(key) {
        const translation = this.getNestedTranslation(
            this.translations[this.currentLang],
            key
        );
        return translation || key;
    }
}

// Create and export a singleton instance
const i18n = new I18n();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});

// Export for global use
window.i18n = i18n; 