/**
 * ScrollReveal - Advanced scroll animation library
 * Handles element reveal animations when scrolling
 */

class ScrollReveal {
    constructor(options = {}) {
        // Default configuration
        this.defaults = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.15,
            delay: 0,
            duration: 800,
            easing: 'cubic-bezier(0.5, 0, 0, 1)',
            distance: '60px',
            opacity: 0,
            scale: 1,
            origin: 'bottom',
            rotate: { x: 0, y: 0, z: 0 },
            cleanup: false, // Whether to unobserve after animation
            container: window.document.documentElement,
            mobile: true,
            desktop: true,
            reset: false, // Whether to replay animations when scrolling back up
        };

        // Merge user options with defaults
        this.options = Object.assign({}, this.defaults, options);
        
        // Initialize IntersectionObserver
        this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
            root: this.options.root,
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold
        });
        
        // Store all animated elements
        this.elements = new Map();
        
        // Check device type to apply device-specific settings
        this.isMobile = window.innerWidth < 768;
    }
    
    // Handle intersection events
    onIntersection(entries) {
        entries.forEach(entry => {
            const el = entry.target;
            const settings = this.elements.get(el);
            
            if (!settings) return;
            
            if (entry.isIntersecting) {
                this.applyAnimation(el, settings, true);
                
                // Unobserve if cleanup is enabled
                if (settings.cleanup) {
                    this.observer.unobserve(el);
                    this.elements.delete(el);
                }
            } else if (settings.reset) {
                // Reset animation when scrolling back up if reset is enabled
                this.applyAnimation(el, settings, false);
            }
        });
    }
    
    // Apply animation to element
    applyAnimation(el, settings, isVisible) {
        const { delay, duration, easing } = settings;
        
        // Build transform string based on settings
        let transform = '';
        
        if (isVisible) {
            // Apply visible state
            setTimeout(() => {
                el.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
                el.style.opacity = '1';
                el.style.transform = 'translateX(0) translateY(0) scale(1) rotate3d(0, 0, 0, 0deg)';
                el.classList.add('is-revealed');
            }, delay);
        } else {
            // Apply hidden state (for reset)
            if (settings.origin === 'left') transform += `translateX(-${settings.distance}) `;
            if (settings.origin === 'right') transform += `translateX(${settings.distance}) `;
            if (settings.origin === 'top') transform += `translateY(-${settings.distance}) `;
            if (settings.origin === 'bottom') transform += `translateY(${settings.distance}) `;
            
            if (settings.scale !== 1) transform += `scale(${settings.scale}) `;
            
            const { x, y, z } = settings.rotate;
            if (x || y || z) transform += `rotate3d(${x}, ${y}, ${z}, 15deg) `;
            
            el.style.opacity = settings.opacity;
            el.style.transform = transform;
            el.classList.remove('is-revealed');
        }
    }
    
    // Reveal method to register an element with settings
    reveal(selector, customOptions = {}) {
        // Select elements
        const elements = Array.from(
            typeof selector === 'string' 
                ? document.querySelectorAll(selector) 
                : [selector]
        );
        
        // Process each element
        elements.forEach(el => {
            // Skip if device type doesn't match settings
            if ((this.isMobile && !this.options.mobile) || (!this.isMobile && !this.options.desktop)) {
                return;
            }
            
            // Get settings by combining defaults, global options, and element-specific options
            const dataOptions = this.getDataOptions(el);
            const settings = Object.assign({}, this.options, dataOptions, customOptions);
            
            // Add to tracked elements map
            this.elements.set(el, settings);
            
            // Set initial styles
            el.style.visibility = 'visible';
            el.style.opacity = settings.opacity;
            
            // Apply initial transform based on origin
            let transform = '';
            
            if (settings.origin === 'left') transform += `translateX(-${settings.distance}) `;
            if (settings.origin === 'right') transform += `translateX(${settings.distance}) `;
            if (settings.origin === 'top') transform += `translateY(-${settings.distance}) `;
            if (settings.origin === 'bottom') transform += `translateY(${settings.distance}) `;
            
            if (settings.scale !== 1) transform += `scale(${settings.scale}) `;
            
            const { x, y, z } = settings.rotate;
            if (x || y || z) transform += `rotate3d(${x}, ${y}, ${z}, 15deg) `;
            
            el.style.transform = transform;
            
            // Start observing
            this.observer.observe(el);
        });
        
        return this;
    }
    
    // Parse data attributes from element
    getDataOptions(el) {
        const options = {};
        
        if (el.dataset.srOrigin) options.origin = el.dataset.srOrigin;
        if (el.dataset.srDistance) options.distance = el.dataset.srDistance;
        if (el.dataset.srDuration) options.duration = parseInt(el.dataset.srDuration, 10);
        if (el.dataset.srDelay) options.delay = parseInt(el.dataset.srDelay, 10);
        if (el.dataset.srOpacity) options.opacity = parseFloat(el.dataset.srOpacity);
        if (el.dataset.srScale) options.scale = parseFloat(el.dataset.srScale);
        if (el.dataset.srEasing) options.easing = el.dataset.srEasing;
        if (el.dataset.srCleanup) options.cleanup = el.dataset.srCleanup === 'true';
        if (el.dataset.srReset) options.reset = el.dataset.srReset === 'true';
        
        return options;
    }
    
    // Sync method to reveal all registered elements
    sync() {
        this.elements.forEach((settings, el) => {
            this.observer.observe(el);
        });
        
        return this;
    }
    
    // Method to reveal custom sequences of elements
    sequence(options = {}) {
        const { selector, interval = 100, delayStart = 0, origin } = options;
        
        const elements = Array.from(document.querySelectorAll(selector));
        
        elements.forEach((el, index) => {
            this.reveal(el, {
                delay: delayStart + (interval * index),
                origin: origin || this.options.origin
            });
        });
        
        return this;
    }
}

// Make available globally
window.ScrollReveal = ScrollReveal; 