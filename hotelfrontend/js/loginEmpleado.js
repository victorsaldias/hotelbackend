document.getElementById("loginEmpleadoForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const correo = document.getElementById("correoEmpleado").value.trim();
    const password = document.getElementById("passwordEmpleado").value.trim();

    if (!correo || !password) {
        alert("Ingrese correo y contraseña");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/empleados/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        // validar que la respuesta sea correcta
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            alert("Error en servidor: " + errorText);
            return;
        }

        // si todo está OK, parsear JSON
        const data = await response.json();

        // Guardar datos
        localStorage.setItem("empleadoToken", data.token);
        localStorage.setItem("empleadoId", data.empleado.idEmpleado);
        localStorage.setItem("empleadoNombre", data.empleado.nombre + " " + data.empleado.apellido);
        localStorage.setItem("empleadoRol", data.empleado.rol);

        alert("Inicio de sesión exitoso");
        window.location.href = "../dashboard-admin.html";

    } catch (error) {
        console.error("Error en la solicitud de inicio de sesión:", error);
        alert("Error al iniciar sesión. Intente nuevamente.");
    }
});
