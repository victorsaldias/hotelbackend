document.addEventListener("DOMContentLoaded", () => {

    // CLIENTE
    const clienteLogueado = localStorage.getItem("userLogged") === "true";

    // EMPLEADO
    const empleado = localStorage.getItem("empleado");
    const empleadoLogueado = empleado !== null;

    // Desktop
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // Mobile
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    function updateUI() {

        // Si está logueado como cliente
        if (clienteLogueado) {
            if (loginBtn) loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";

            if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = "none";
            if (mobileLogoutBtn) mobileLogoutBtn.style.display = "block";
            return;
        }

        // Si está logueado como empleado
        if (empleadoLogueado) {
            if (loginBtn) loginBtn.style.display = "none";
            if (registerBtn) registerBtn.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";

            if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
            if (mobileRegisterBtn) mobileRegisterBtn.style.display = "none";
            if (mobileLogoutBtn) mobileLogoutBtn.style.display = "block";
            return;
        }

        // Si NO hay ningún logueado
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (registerBtn) registerBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";

        if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = "block";
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = "none";
    }

    updateUI();

    // ======================================
    // LOGOUT CLIENTE
    // ======================================
   window.logoutCliente = function () {

    // Borra todo rastro de sesión
    localStorage.removeItem("userLogged");
    localStorage.removeItem("clienteNombre");
    localStorage.removeItem("clienteApellido");
    localStorage.removeItem("clienteId");
    localStorage.removeItem("token"); // por si acaso

    // Previene volver atrás a páginas protegidas
    history.replaceState(null, null, "./pages/index.html");

    // Redirige limpio
    window.location.href = "./pages/index.html";

    // Limpia cache de navegación hacia atrás
    setTimeout(() => {
        window.location.reload();
    }, 50);
};

    // ======================================
    // LOGOUT EMPLEADO
    // ======================================
    window.logoutEmpleado = function () {
        localStorage.removeItem("empleado");
        localStorage.removeItem("token");

        window.location.href = "./pages/login-aseo.html";
    };

});
