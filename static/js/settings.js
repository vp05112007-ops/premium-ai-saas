/**
 * ==========================================================================
 * Settings Page JS
 * ==========================================================================
 * Handles GSAP animations, smooth scrolling, and scroll spy for sidebar.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSettingsAnimations();
    initScrollSpy();
    initSmoothScroll();
});

function initSettingsAnimations() {
    if (typeof gsap === 'undefined') return;

    // Sidebar animation
    gsap.from(".settings-sidebar", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.1
    });

    // Content sections stagger
    gsap.from(".settings-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
    });
}

/**
 * Updates the active link in the sidebar based on scroll position.
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('.settings-section');
    const navLinks = document.querySelectorAll('.settings-nav a');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        
        // Add offset to trigger slightly before the section hits the top
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Smooth scrolling for sidebar links
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.settings-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // scroll-margin-top in CSS handles the offset
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Manually set active class immediately for better UX
                document.querySelectorAll('.settings-nav a').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}
