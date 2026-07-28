/**
 * ==========================================================================
 * Profile Page JS
 * ==========================================================================
 * Handles GSAP animations and animated counters.
 */

document.addEventListener('DOMContentLoaded', () => {
    initProfileAnimations();
    animateCounters();
});

function initProfileAnimations() {
    if (typeof gsap === 'undefined') return;

    // Stagger in the main cards
    gsap.from(".profile-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1
    });

    // Animate timeline items
    gsap.from(".timeline-item", {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
    });

    // Animate badge items
    gsap.from(".badge-item", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
        delay: 0.6
    });
}

/**
 * Animates numbers from 0 to their target value
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000; // ms
        const steps = 60;
        const stepTime = Math.abs(Math.floor(duration / steps));
        
        let current = 0;
        const increment = target / steps;
        
        const timer = setInterval(() => {
            current += increment;
            
            // Check if reached target
            if (current >= target) {
                counter.innerText = target.toLocaleString() + suffix;
                clearInterval(timer);
            } else {
                // If it's a small decimal number vs large integer
                if (target % 1 !== 0) {
                    counter.innerText = current.toFixed(1) + suffix;
                } else {
                    counter.innerText = Math.ceil(current).toLocaleString() + suffix;
                }
            }
        }, stepTime);
    });
}
