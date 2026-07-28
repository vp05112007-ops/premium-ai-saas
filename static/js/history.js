/**
 * ==========================================================================
 * History JS
 * ==========================================================================
 * Handles filtering logic for the History page.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHistoryFilters();
});

function initHistoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const rows = document.querySelectorAll('.history-row');

    if (!filterBtns.length || !rows.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Animate rows
            gsap.to(rows, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                stagger: 0.05,
                onComplete: () => {
                    rows.forEach(row => {
                        if (filter === 'all' || row.dataset.type === filter) {
                            row.style.display = 'table-row';
                            gsap.to(row, { opacity: 1, y: 0, duration: 0.3 });
                        } else {
                            row.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}
