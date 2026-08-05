// Interactive Client Logic for Rithamaya Website

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Auto-dismiss Alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });

    // Category Filter Buttons on Shop Page
    const catChips = document.querySelectorAll('.cat-chip');
    const productCards = document.querySelectorAll('.product-card');

    if (catChips.length > 0 && productCards.length > 0) {
        catChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const category = chip.getAttribute('data-category');
                
                catChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                productCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (category === 'all' || cardCat === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Quantity Incrementation
function updateQty(btn, change) {
    const input = btn.parentNode.querySelector('.qty-input');
    if (input) {
        let val = parseInt(input.value) + change;
        if (val < 1) val = 1;
        input.value = val;
    }
}
