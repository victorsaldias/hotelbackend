(function () {
    const token = localStorage.getItem("token");

    if (token) {
        // Ya está logueado → no puede ver login
        window.location.href = "./pages/login.html";
    }
})();
