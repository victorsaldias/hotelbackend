// authStatus.js
document.addEventListener("DOMContentLoaded", () => {

    const isLogged = localStorage.getItem("userLogged") === "true";

    // Desktop
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    // Mobile
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const mobileRegisterBtn = document.getElementById("mobileRegisterBtn");
    const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

    function updateUI(logged) {
        if (loginBtn) loginBtn.style.display = logged ? "none" : "inline-block";
        if (registerBtn) registerBtn.style.display = logged ? "none" : "inline-block";
        if (logoutBtn) logoutBtn.style.display = logged ? "inline-block" : "none";

        if (mobileLoginBtn) mobileLoginBtn.style.display = logged ? "none" : "block";
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = logged ? "none" : "block";
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = logged ? "block" : "none";
    }

    updateUI(isLogged);

    function logout() {
        localStorage.removeItem("userLogged");
        localStorage.removeItem("clienteNombre");
        localStorage.removeItem("clienteApellido");
        localStorage.removeItem("clienteId");

        updateUI(false);

        window.location.href = "index.html";
    }

    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", logout);
});
