/**
 * ==========================================================================
 * Pricing Page JS
 * ==========================================================================
 * Handles GSAP scroll animations and FAQ accordion logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    initPricingAnimations();
    initFAQAccordion();
});

function initPricingAnimations() {
    if (typeof gsap === 'undefined') return;

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Header Animation (Immediate)
    gsap.from(".pricing-header h1", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
    
    gsap.from(".pricing-header p", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out"
    });

    // 2. Pricing Cards Stagger (Immediate)
    gsap.from(".pricing-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3
    });

    // Stop here if ScrollTrigger isn't loaded (fallback)
    if (typeof ScrollTrigger === 'undefined') return;

    // 3. Comparison Table Scroll Reveal
    gsap.from(".comparison-table tr", {
        scrollTrigger: {
            trigger: ".comparison-section",
            start: "top 80%"
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out"
    });

    // 4. FAQ Stagger Reveal
    gsap.from(".faq-item", {
        scrollTrigger: {
            trigger: ".faq-section",
            start: "top 80%"
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });

    // 5. CTA Box Reveal
    gsap.from(".cta-box", {
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 85%"
        },
        scale: 0.95,
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });
}

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');
        
        if (!questionBtn || !answerDiv) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items (Optional: remove if you want multiple open)
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 40 + "px"; // 40px for padding
            }
        });
    });
}
