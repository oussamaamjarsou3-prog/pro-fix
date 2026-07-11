/* CarSpecio — Home dashboard */

(function () {

    const headerSearch = document.getElementById("headerSearch");
    const reviewCards = document.querySelectorAll(".review-card-dash, .review-card");

    if (headerSearch && reviewCards.length) {
        headerSearch.addEventListener("input", () => {
            const value = headerSearch.value.toLowerCase().trim();
            reviewCards.forEach((card) => {
                const title = card.querySelector("h3");
                if (!title) return;
                const match = !value || title.textContent.toLowerCase().includes(value);
                card.style.display = match ? "" : "none";
            });
        });
    }

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const newsletterMessage = document.getElementById("newsletterMessage");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = newsletterEmail || newsletterForm.querySelector('input[type="email"]');
            if (input && input.value) {
                let subscriptions = JSON.parse(localStorage.getItem("newsletterSubscriptions")) || [];
                subscriptions.push({
                    email: input.value,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem("newsletterSubscriptions", JSON.stringify(subscriptions));
                if (newsletterMessage) {
                    newsletterMessage.innerHTML = '<p style="color: var(--accent); font-weight: 600;">✓ ¡Gracias por suscribirte! Recibirás nuestras novedades en tu correo.</p>';
                    newsletterMessage.style.display = "block";
                    setTimeout(() => {
                        newsletterMessage.style.display = "none";
                    }, 5000);
                }
                input.value = "";
            }
        });
    }

})();
