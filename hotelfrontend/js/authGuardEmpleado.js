document.getElementById("loginEmpleadoForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarga

    // 📌 VALIDACIONES
    const correo = document.getElementById("correoEmpleado").value.trim();
    const password = document.getElementById("passwordEmpleado").value.trim();

    // ⚠ Validar campos vacíos
    if (!correo || !password) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Debe ingresar correo y contraseña"
        });
        return;
    }

    // ⚠ Validar formato de correo
    function validarFormatoCorreo(correo) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(correo);
    }

    if (!validarFormatoCorreo(correo)) {
        Swal.fire({
            icon: "warning",
            title: "Correo inválido",
            text: "Debe ingresar un correo válido"
        });
        return;
    }

    // 📡 Inicia solicitud al backend
    try {
        const response = await fetch("http://localhost:3000/api/empleados/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        // ❌ Error del servidor / login inválido
        if (!response.ok) {
            Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: data.message || "Credenciales incorrectas"
            });
            return;
        }

        // ✔ Guardamos datos del empleado
        localStorage.setItem("token", data.token);
        localStorage.setItem("empleado", JSON.stringify(data.empleado));
        

        // ✔ Mensaje de éxito elegante
        await Swal.fire({
            icon: "success",
            title: "¡Bienvenido!",
            text: "Inicio de sesión exitoso",
            timer: 1500,
            showConfirmButton: false
        });

        // 🔥 REDIRECCIÓN SEGÚN ROL
        const rol = data.empleado.rolNombre.toLowerCase();

        if (rol === "administrador") {
            window.location.href = "dashboard-admin.html";
        } 
        else if (rol === "recepcionista") {
            window.location.href = "recepcionista.html";
        } 
        else if (rol === "aseo" || rol === "personal de aseo") {
            window.location.href = "personal-aseo.html";
        } 
        else {
            Swal.fire({
                icon: "error",
                title: "Rol desconocido",
                text: `El rol "${data.empleado.rolNombre}" no tiene un dashboard asignado`
            });
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor"
        });
    }
});

(function () {

    // 1️⃣ Validar token y empleado ID
    const token = localStorage.getItem("token");
    const empleadoId = localStorage.getItem("empleadoId");

    if (!token || !empleadoId) {
        // si no hay sesión -> fuera
        window.location.replace("../index.html");
        return;
    }

    // 2️⃣ Bloquear botón atrás del navegador
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

})();
