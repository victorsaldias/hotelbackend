document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");

    if (counters.length === 0) return;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        let count = 0;

        const duration = 1500; // duración total en ms
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            count = Math.floor(progress * target);
            el.textContent = count.toLocaleString("es-CL");

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target); // evitar animarlo otra vez
            }
        });
    }, {
        threshold: 0.4 // cuando el 40% del elemento sea visible
    });

    counters.forEach(counter => observer.observe(counter));
});
