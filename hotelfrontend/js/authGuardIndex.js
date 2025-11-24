(function () {
    const token = localStorage.getItem("token");

    // Si NO hay sesión → redirigir a login
    if (!token) {
        window.location.href = "login.html";
    }
})();
