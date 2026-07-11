/* News page filtering */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const filters = document.querySelectorAll('.news-filter');
        const cards = document.querySelectorAll('.news-card');
        if (!filters.length || !cards.length) return;

        filters.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filters.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');

                cards.forEach(function(card) {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    });
})();
