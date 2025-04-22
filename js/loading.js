// Loading Screen JavaScript

// Create the loading overlay element
function createLoadingOverlay() {
    // Don't proceed if body doesn't exist yet
    if (!document.body) return null;
    
    // Check if overlay already exists
    const existingOverlay = document.querySelector('.loading-overlay');
    if (existingOverlay) return existingOverlay;
    
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay active'; // Make it active by default
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.textContent = 'Loading...';
    
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
    
    return loadingOverlay;
}

// Show loading overlay with async support
async function showLoading(message = 'Loading...') {
    return new Promise((resolve) => {
        let loadingOverlay = document.querySelector('.loading-overlay');
        
        if (!loadingOverlay) {
            loadingOverlay = createLoadingOverlay();
            // If we still couldn't create it, return early
            if (!loadingOverlay) {
                resolve();
                return;
            }
        }
        
        const loadingText = loadingOverlay.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        // Force reflow to ensure transition works
        loadingOverlay.offsetWidth;
        
        // Show the overlay
        loadingOverlay.classList.add('active');
        
        // Small delay to ensure the loading screen is visible
        setTimeout(() => {
            resolve();
        }, 50);
    });
}

// Hide loading overlay with async support
async function hideLoading() {
    return new Promise((resolve) => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
            
            // Wait for the transition to complete
            setTimeout(() => {
                resolve();
            }, 300); // Same duration as the CSS transition
        } else {
            resolve();
        }
    });
}

// Intercept all link clicks to show loading before navigation
function setupLinkInterception() {
    document.addEventListener('click', async function(e) {
        // Find closest anchor tag if the click was on a child element
        const link = e.target.closest('a');
        
        // Only handle clicks on links that navigate to other pages (not anchors, javascript: links, etc.)
        if (link && 
            link.href && 
            link.href.startsWith(window.location.origin) && 
            !link.href.includes('#') && 
            !link.href.startsWith('javascript:') &&
            !e.ctrlKey && !e.metaKey) {
            
            // Prevent default navigation
            e.preventDefault();
            
            // Show loading screen
            await showLoading('Navigating...');
            
            // Navigate to the new page after a short delay
            setTimeout(() => {
                window.location.href = link.href;
            }, 50);
        }
    });
}

// Function to initialize loading when DOM is ready
async function initializeLoading() {
    // Create loading overlay
    const loadingOverlay = createLoadingOverlay();
    
    // Set up link interception for page transitions
    setupLinkInterception();
    
    // Add event listener for beforeunload to show loading when leaving the page
    window.addEventListener('beforeunload', function() {
        showLoading('Loading...');
    });
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    // If not loaded yet, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeLoading);
} else {
    // If already loaded, initialize immediately
    initializeLoading();
}

// Hide loading screen when all resources are fully loaded
window.addEventListener('load', function() {
    // Hide the loading screen with a slight delay to ensure everything is rendered
    setTimeout(async () => {
        await hideLoading();
    }, 300);
});

// Export functions for use in other scripts
window.showLoading = showLoading;
window.hideLoading = hideLoading; 