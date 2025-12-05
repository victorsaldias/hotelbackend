(function () {

    // Validar sesión del cliente
    const clienteLogueado = localStorage.getItem("userLogged") === "true";

    if (!clienteLogueado) {
        window.location.href = "./pages/login.html";
        return;
    }

    // Bloquear botón atrás
    history.pushState(null, "", location.href);
    window.onpopstate = function () {
        history.pushState(null, "", location.href);
    };

})();
