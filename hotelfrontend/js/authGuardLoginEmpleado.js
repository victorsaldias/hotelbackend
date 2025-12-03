// ================================
//  AUTH GUARD SOLO PARA EMPLEADOS
// ================================
(function () {

    const empleado = localStorage.getItem("empleado");

    // Si YA está logueado, enviarlo a su dashboard
    if (empleado) {
        const data = JSON.parse(empleado);
        const rol = data.idRol;

        if (rol === 1) {
            window.location.href = "dashboard-admin.html";
        } else if (rol === 2) {
            window.location.href = "recepcionista.html";
        } else if (rol === 3) {
            window.location.href = "personal-aseo.html";
        } else {
            console.warn("Rol desconocido:", rol);
        }
    }

})();
