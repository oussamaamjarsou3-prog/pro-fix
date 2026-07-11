/* News Magazine: Table of Contents active state */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const tocLinks = document.querySelectorAll('.article-toc a');
        const headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
        if (!tocLinks.length || !headings.length) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    tocLinks.forEach(function(link) { link.classList.remove('active'); });
                    const active = document.querySelector('.article-toc a[href="#' + entry.target.id + '"]');
                    if (active) active.classList.add('active');
                }
            });
        }, { rootMargin: '-20% 0px -60% 0px' });

        headings.forEach(function(h) { observer.observe(h); });
    });
})();
