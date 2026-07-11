/* CarSpecio — compare page: nav + búsqueda header */

(function () {
    const headerSearch = document.getElementById("headerSearch");
    const popularCards = document.querySelectorAll(".popular-compare-card");

    if (headerSearch && popularCards.length) {
        headerSearch.addEventListener("input", () => {
            const q = headerSearch.value.toLowerCase().trim();
            popularCards.forEach((card) => {
                const text = card.textContent.toLowerCase();
                card.style.display = !q || text.includes(q) ? "" : "none";
            });
        });
    }
})();
