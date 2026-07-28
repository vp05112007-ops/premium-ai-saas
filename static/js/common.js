/**
 * ==========================================================================
 * Premium AI SaaS Platform - Common JS
 * ==========================================================================
 * Global utilities, theme management, custom cursor, and shared animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initThemeManager();
});



/**
 * Handles Navbar styling on scroll.
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-panel');
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.classList.remove('glass-panel');
            navbar.style.boxShadow = 'none';
        }
    });
}

/**
 * Theme Manager for toggling (stubbed for future light/dark switch if needed).
 * The project defaults to Premium White theme as requested.
 */
function initThemeManager() {
    // Stub function. The platform is designed around a Premium White theme, 
    // but this structure allows for seamless dark mode expansion later.
    console.log("Theme Manager Initialized. Current: Premium White.");
}

/**
 * Utility: Create and show a toast notification.
 * @param {string} message 
 * @param {string} type - 'success', 'error', 'info'
 */
window.showToast = function(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-panel`;
    toast.style.position = 'fixed';
    toast.style.bottom = 'var(--space-md)';
    toast.style.right = 'var(--space-md)';
    toast.style.padding = 'var(--space-sm) var(--space-md)';
    toast.style.zIndex = 'var(--z-toast)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
