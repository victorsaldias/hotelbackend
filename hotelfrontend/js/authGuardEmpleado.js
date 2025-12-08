// --- LOGIN --- solo en la página que tiene el formulario
const loginForm = document.getElementById("loginEmpleadoForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correo = document.getElementById("correoEmpleado").value.trim();
        const password = document.getElementById("passwordEmpleado").value.trim();

        if (!correo || !password) {
            Swal.fire("Campos incompletos", "Debe ingresar correo y contraseña", "warning");
            return;
        }

        function validarFormatoCorreo(correo) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(correo);
        }

        if (!validarFormatoCorreo(correo)) {
            Swal.fire("Correo inválido", "Debe ingresar un correo válido", "warning");
            return;
        }

        try {
            const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/empleados/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, password })
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.message || "Credenciales incorrectas", "error");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("empleado", JSON.stringify(data.empleado));
            localStorage.setItem("empleadoId", data.empleado.idEmpleado);

            await Swal.fire({
                icon: "success",
                title: "Bienvenido",
                timer: 1500,
                showConfirmButton: false
            });

            const rol = data.empleado.rolNombre.toLowerCase();

            if (rol === "administrador") {
                window.location.href = "dashboard-admin.html";
            } else if (rol === "recepcionista") {
                window.location.href = "recepcionista.html";
            } else if (rol === "aseo" || rol === "personal de aseo") {
                window.location.href = "personal-aseo.html";
            } else {
                Swal.fire("Rol desconocido", `El rol "${data.empleado.rolNombre}" no tiene dashboard`, "error");
            }

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        }
    });
}



// --- PROTECCIÓN DE PÁGINAS --- (se ejecuta en todas las páginas excepto login)
(function () {
    const empleado = localStorage.getItem("empleado");
    const token = localStorage.getItem("token");

    if (!empleado || !token) {
        window.location.href = "login-aseo.html";
        return;
    }

    // Bloquea botón atrás
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
})();
