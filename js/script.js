// Main JavaScript File

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeThemeSelector();
    
    // Preload all service images to prevent flickering
    preloadServiceImages();
    
    // Navigation Link Active State
    const navLinkElements = document.querySelectorAll('.nav-links a');
    
    navLinkElements.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinkElements.forEach(el => el.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile menu if open
            const mobileMenuToggle = document.querySelector('.hamburger');
            if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.click();
            }
        });
    });
    
    // Function to initialize mobile menu
    function initializeMobileMenu() {
        const mobileMenuToggle = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const bodyElement = document.body;
        const hasSubmenuItems = document.querySelectorAll('.has-submenu > a');
        
        // Set submenu as active by default on mobile
        if (window.innerWidth <= 767) {
            document.querySelectorAll('.has-submenu').forEach(item => {
                item.classList.add('active');
            });
        }
        
        if (mobileMenuToggle) {
            // Remove any existing event listeners
            const newMobileMenuToggle = mobileMenuToggle.cloneNode(true);
            mobileMenuToggle.parentNode.replaceChild(newMobileMenuToggle, mobileMenuToggle);
            
            // Handle submenu toggles in mobile view
            hasSubmenuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (window.innerWidth <= 767) {
                        e.preventDefault();
                        const parent = this.parentElement;
                        parent.classList.toggle('active');
                    }
                });
            });
            
            newMobileMenuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Create or remove overlay
                const existingOverlay = document.querySelector('.menu-overlay');
                
                if (this.classList.contains('active')) {
                    if (!existingOverlay) {
                        const overlay = document.createElement('div');
                        overlay.className = 'menu-overlay active';
                        document.body.appendChild(overlay);
                        
                        // Prevent body scrolling when menu is open
                        bodyElement.style.overflow = 'hidden';
                        
                        // Close menu when clicking on overlay
                        overlay.addEventListener('click', function() {
                            newMobileMenuToggle.classList.remove('active');
                            navLinks.classList.remove('active');
                            this.classList.remove('active');
                            bodyElement.style.overflow = '';
                            
                            setTimeout(() => {
                                this.remove();
                            }, 300);
                        });
                    }
                } else {
                    if (existingOverlay) {
                        existingOverlay.classList.remove('active');
                        bodyElement.style.overflow = '';
                        
                        setTimeout(() => {
                            existingOverlay.remove();
                        }, 300);
                    }
                }
            });
        }
    }
    
    // Services Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    let currentTabIndex = 0;
    let tabCarouselInterval;
    
    // Initialize tab carousel
    startTabCarousel();
    
    // Add mouse enter/leave events to stop/start carousel
    const servicesSection = document.querySelector('.services');
    if (servicesSection) {
        servicesSection.addEventListener('mouseenter', stopTabCarousel);
        servicesSection.addEventListener('mouseleave', startTabCarousel);
    }
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            switchToTab(index);
            stopTabCarousel(); // Stop carousel when user manually clicks
            
            // Restart carousel after 10 seconds of inactivity
            setTimeout(() => {
                if (!servicesSection.matches(':hover')) {
                    startTabCarousel();
                }
            }, 1000);
        });
    });
    
    // Function to switch to a specific tab
    function switchToTab(index) {
        currentTabIndex = index;
        const serviceId = tabButtons[index].getAttribute('data-service');
        
        // Remove active class from all buttons and add to current
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabButtons[index].classList.add('active');
        
        // Hide all tab panes first
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Show the selected tab pane with animation
        const activePane = document.getElementById(serviceId);
        activePane.classList.add('active');
    }
    
    // Start tab carousel
    function startTabCarousel() {
        if (tabCarouselInterval) clearInterval(tabCarouselInterval);
        
        tabCarouselInterval = setInterval(() => {
            currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
            switchToTab(currentTabIndex);
        }, 5000); // Change tab every 5 seconds
    }
    
    // Stop tab carousel
    function stopTabCarousel() {
        if (tabCarouselInterval) {
            clearInterval(tabCarouselInterval);
            tabCarouselInterval = null;
        }
    }
    
    // Preload service images
    function preloadServiceImages() {
        const serviceImages = document.querySelectorAll('.service-img img');
        
        serviceImages.forEach(img => {
            const src = img.getAttribute('src');
            if (src) {
                const preloadImg = new Image();
                preloadImg.src = src;
            }
        });
    }
    
    // Read More Button Functionality
    const readMoreButtons = document.querySelectorAll('.btn-secondary');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the service type from the closest tab-pane
            const tabPane = this.closest('.tab-pane');
            const serviceType = tabPane ? tabPane.id : '';
            
            // Navigate to the corresponding service page
            if (serviceType) {
                window.location.href = 'services/' + serviceType + '.html';
            }
        });
    });
    
    // Learn More button in ERP Implementation section
    const learnMoreButton = document.querySelector('.service-info .btn-secondary');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'services/erp.html';
        });
    }
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }
            
            // In a real project, you would send this data to a server
            // For this static site, we'll just show a success message
            
            // Create a success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <h3>Thank you for your message!</h3>
                <p>We'll get back to you as soon as possible.</p>
            `;
            
            // Clear form
            contactForm.reset();
            
            // Replace form with success message
            contactForm.style.display = 'none';
            contactForm.parentNode.appendChild(successMessage);
            
            // For demonstration only - reset form after 5 seconds
            setTimeout(() => {
                contactForm.style.display = 'block';
                successMessage.remove();
            }, 5000);
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Function to initialize theme selector
    function initializeThemeSelector() {
        const themeDropdown = document.querySelector('.theme-dropdown');
        const themeBtn = themeDropdown.querySelector('.theme-btn');
        const dropdownContent = themeDropdown.querySelector('.theme-dropdown-content');
        const head = document.head;
        
        // Get available themes
        const themes = [
            { file: 'variables.css', name: 'Default' },
            { file: 'red_variables.css', name: 'Red' },
            { file: 'saudi_variables.css', name: 'Saudi' }
        ];
        
        // Create theme options
        themes.forEach(theme => {
            const option = document.createElement('div');
            option.className = 'theme-option';
            option.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${theme.name}</span>
            `;
            option.setAttribute('data-theme', theme.file);
            dropdownContent.appendChild(option);
            
            option.addEventListener('click', async () => {
                await setTheme(theme.file);
                themeDropdown.classList.remove('active');
            });
        });
        
        // Toggle dropdown
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            themeDropdown.classList.remove('active');
        });
        
        // Set initial theme
        const defaultTheme = localStorage.getItem('theme') || 'variables.css';
        setTheme(defaultTheme, false); // Don't show loading on initial load
        
        async function setTheme(themeFile, showLoader = true) {
            // Show loading screen if this is not the initial page load
            if (showLoader && window.showLoading) {
                await window.showLoading('Changing theme...');
            }
            
            return new Promise((resolve) => {
                // Remove existing theme stylesheet if it exists
                const existingTheme = document.getElementById('theme-variables');
                if (existingTheme) {
                    existingTheme.remove();
                }
                
                // Add new theme stylesheet
                const themeLink = document.createElement('link');
                themeLink.id = 'theme-variables';
                themeLink.rel = 'stylesheet';
                
                // Check if we're in a service page or main page
                const isServicePage = window.location.pathname.includes('/services/');
                const basePath = isServicePage ? '../css/themes/' : 'css/themes/';
                themeLink.href = basePath + themeFile;
                
                // Hide loading screen after theme has loaded
                themeLink.onload = function() {
                    // Give a small delay to allow browser to apply styles
                    setTimeout(async () => {
                        if (window.hideLoading) {
                            await window.hideLoading();
                        }
                        resolve();
                    }, 500);
                };
                
                // Set a timeout in case the onload event doesn't fire
                setTimeout(() => {
                    if (window.hideLoading) {
                        window.hideLoading();
                    }
                    resolve();
                }, 3000);
                
                // Insert theme stylesheet before other stylesheets
                const firstStylesheet = head.querySelector('link[rel="stylesheet"]');
                head.insertBefore(themeLink, firstStylesheet);
                
                // Save theme preference
                localStorage.setItem('theme', themeFile);
                
                // Update active state in dropdown
                const options = dropdownContent.querySelectorAll('.theme-option');
                options.forEach(option => {
                    option.classList.toggle('active', option.getAttribute('data-theme') === themeFile);
                });
            });
        }
    }
}); 