(function () {
    const token = localStorage.getItem("token");

    if (!token) {
        // No está logueado → llevar al login
        window.location.href = "login.html";
    }
})();

// js/authGuardReservas.js
(function () {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
    }
})();