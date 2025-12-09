document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "https://hotelbackend-hzc4.onrender.com/api/metricas";

    const counters = document.querySelectorAll(".counter");
    if (counters.length === 0) return;

    // Elementos específicos
    const countAnios = document.getElementById("countAnios");
    const countSucursales = document.getElementById("countSucursales");
    const countClientes = document.getElementById("countClientes");

    // ===============================
    // 1) CARGAR DATOS DINÁMICOS
    // ===============================
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        countAnios.dataset.target = data.yearFundacion;
        countSucursales.dataset.target = data.sucursales;
        countClientes.dataset.target = data.clientes;

    } catch (err) {
        console.error("Error cargando métricas:", err);
        return;
    }

    // ===============================
    // 2) ANIMACIÓN DE CONTADORES
    // ===============================
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.target, 10);
        let start = 0;

        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const value = Math.floor(progress * target);
            el.textContent = value.toLocaleString("es-CL");

            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    };

    // ===============================
    // 3) OBSERVER (cuando aparece)
    // ===============================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target); // solo una vez
            }
        });
    }, {
        threshold: 0.4
    });

    counters.forEach(counter => observer.observe(counter));

});
