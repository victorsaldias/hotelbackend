document.addEventListener("DOMContentLoaded", () => {

    const clienteLogueado = localStorage.getItem("userLogged") === "true";
    const empleadoLogueado = localStorage.getItem("usuario") !== null;

    // Desktop
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // Mobile
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    // 🔥 Si es cliente, mostramos botones del cliente
    // 🔥 Si es empleado, NO mostramos botones del cliente (admin NO usa navbar del cliente)
    function updateUI() {
        const logged = clienteLogueado; // SOLO afecta clientes

        if (loginBtn) loginBtn.style.display = logged ? "none" : "inline-block";
        if (registerBtn) registerBtn.style.display = logged ? "none" : "inline-block";
        if (logoutBtn) logoutBtn.style.display = logged ? "inline-block" : "none";

        if (mobileLoginBtn) mobileLoginBtn.style.display = logged ? "none" : "block";
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = logged ? "none" : "block";
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = logged ? "block" : "none";
    }

    updateUI();

    // =============================
    // 🔵 LOGOUT CLIENTE
    // =============================
    window.logoutCliente = function () {
        localStorage.removeItem("userLogged");
        localStorage.removeItem("clienteNombre");
        localStorage.removeItem("clienteApellido");
        localStorage.removeItem("clienteId");
        

        updateUI();

        window.location.href = "index.html";
    };

    // =============================
    // 🔴 LOGOUT EMPLEADO
    // =============================
    window.logoutEmpleado = function () {
        localStorage.removeItem("usuario");
        localStorage.removeItem("empleado");
    localStorage.removeItem("token");

        // Login empleados está en pages
        window.location.href = "login-aseo.html";
        window.history.replaceState(null, null, "login-aseo.html");
    };

    // Eventos SOLO PARA CLIENTES
    if (logoutBtn) logoutBtn.addEventListener("click", logoutCliente);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", logoutCliente);
});
