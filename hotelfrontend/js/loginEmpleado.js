document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginEmpleadoForm").addEventListener("submit", loginEmpleado);
});

async function loginEmpleado(e) {
    e.preventDefault();

    const correo = document.getElementById("correoEmpleado").value.trim();
    const password = document.getElementById("passwordEmpleado").value.trim();

    if (!correo || !password) {
        return Swal.fire({
            icon: "warning",
            title: "Campos requeridos",
            text: "Ingrese correo y contraseña."
        });
    }

    try {
        const response = await fetch("http://localhost:3000/api/empleados/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: data.message || "Credenciales incorrectas."
            });
        }

        Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: `Hola ${data.nombre} ${data.apellido}`
        });

        setTimeout(() => {

            console.log("➡ Rol recibido:", data.rol);

            
            if (data.rol === "Administrador" || data.rol === "admin") {
                window.location.href = "http://127.0.0.1:5500/hotelfrontend/pages/dashboard-admin.html";
            } 
            else if (data.rol === "Recepcionista") {
                window.location.href = "http://127.0.0.1:5500/hotelfrontend/pages/recepcionista.html";
            }
            else if (data.rol === "Aseo") {
                window.location.href = "http://127.0.0.1:5500/hotelfrontend/pages/aseo.html";
            } 
            else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Rol desconocido. Contacte al administrador."
                });
            }

        }, 1200);

    } catch (error) {
        console.error("❌ Error en fetch:", error);
        Swal.fire({
            icon: "error",
            title: "Error interno",
            text: "No se pudo conectar al servidor."
        });
    }
}
