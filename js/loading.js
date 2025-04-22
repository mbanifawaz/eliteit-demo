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
            }, 50); // Same duration as the CSS transition
        } else {
            resolve();
        }
    });
}

// Forcefully remove all loading elements (used for troubleshooting stuck loaders)
function forceRemoveLoading() {
    // Remove the 'loading' class from the HTML element
    document.documentElement.classList.remove('loading');
    
    // Find and remove all loading overlays
    const overlays = document.querySelectorAll('.loading-overlay');
    overlays.forEach(overlay => {
        overlay.classList.remove('active');
        // Optional: completely remove from DOM after transition
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 50);
    });
    
    console.log('Loading screens forcibly removed');
    return 'Loading screens have been forcibly removed';
}

// Create a global emergency utility function to fix stuck loading screens
// Users can run this from the console if needed
window.__fixLoadingScreen = function() {
    forceRemoveLoading();
    // Log instructions for users
    console.log('Loading screens have been forcibly removed.');
    console.log('If you continue to have issues, please refresh the page.');
    return 'Loading screen fix attempted';
};

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
            }, 50); // Increased from 50ms to 100ms to ensure loading is visible
        }
    });
}

// Create loading overlay as early as possible, even before DOM is ready
// This will help prevent flickering of content
(function() {
    // Create a simple loading overlay that doesn't depend on DOM being fully loaded
    function createEarlyLoadingOverlay() {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay active';
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.zIndex = '99999';
        loadingOverlay.style.opacity = '1';
        loadingOverlay.style.visibility = 'visible';
        
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        spinner.style.width = '70px';
        spinner.style.height = '70px';
        spinner.style.border = '5px solid rgba(255, 255, 255, 0.3)';
        spinner.style.borderRadius = '50%';
        spinner.style.borderTopColor = '#3498db';
        spinner.style.animation = 'spin 1s ease-in-out infinite';
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.style.position = 'absolute';
        loadingText.style.bottom = 'calc(50% - 60px)';
        loadingText.style.color = 'white';
        loadingText.style.fontSize = '18px';
        loadingText.textContent = 'Loading...';
        
        loadingOverlay.appendChild(spinner);
        loadingOverlay.appendChild(loadingText);
        
        // Add to document as soon as possible
        if (document.body) {
            document.body.appendChild(loadingOverlay);
        } else {
            // If body isn't available yet, add it as soon as it is
            document.addEventListener('DOMContentLoaded', function() {
                if (!document.querySelector('.loading-overlay')) {
                    document.body.appendChild(loadingOverlay);
                }
            });
        }
    }
    
    // Try to create overlay immediately
    createEarlyLoadingOverlay();
})();

// Function to initialize loading when DOM is ready
async function initializeLoading() {
    // Create or ensure loading overlay
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
        
        // Remove the loading class from the HTML element
        document.documentElement.classList.remove('loading');
        
        // Failsafe: If loading is still visible after 1 second, force remove it
        setTimeout(() => {
            forceRemoveLoading();
        }, 250);
    }, 125); // Increased from 300ms to 500ms to ensure page is fully rendered
});

// Set an emergency timeout to remove loading screen if it gets stuck
setTimeout(forceRemoveLoading, 1000); // Failsafe: Remove loading after 10 seconds no matter what

// Export functions for use in other scripts
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.forceRemoveLoading = forceRemoveLoading; 