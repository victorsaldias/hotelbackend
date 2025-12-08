document.getElementById("loginEmpleadoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const correo = document.getElementById("correoEmpleado").value.trim();
    const password = document.getElementById("passwordEmpleado").value.trim();

    if (!correo || !password) {
        Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Debe ingresar correo y contraseña" });
        return;
    }

    function validarFormatoCorreo(correo) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(correo);
    }

    if (!validarFormatoCorreo(correo)) {
        Swal.fire({ icon: "warning", title: "Correo inválido", text: "Debe ingresar un correo válido" });
        return;
    }

    try {
        const response = await fetch("https://hotelbackend-5tdjgei3o.onrender.com/api/empleados/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        });

        const data = await response.json();

        if (!response.ok) {
            Swal.fire({ icon: "error", title: "Error al iniciar sesión", text: data.message || "Credenciales incorrectas" });
            return;
        }

       
        localStorage.setItem("token", data.token);
        localStorage.setItem("empleado", JSON.stringify(data.empleado));
        localStorage.setItem("empleadoId", data.empleado.idEmpleado);
        localStorage.setItem("empleadoNombre", data.empleado.nombre);
        localStorage.setItem("empleadoApellido", data.empleado.apellido);
        localStorage.setItem("empleadoCorreo", data.empleado.correo);
        localStorage.setItem("empleadoRol", data.empleado.idRol);
        localStorage.setItem("empleadoIdSucursal", data.empleado.idSucursal);
        
        console.log("✅ Sesión guardada - idSucursal:", data.empleado.idSucursal); 
        

        await Swal.fire({
            icon: "success",
            title: "¡Bienvenido!",
            text: "Inicio de sesión exitoso",
            timer: 1200,
            showConfirmButton: false
        });

        const rolId = data.empleado.idRol;

        if (rolId === 1) {
            window.location.href = "../pages/dashboard-admin.html";
        } else if (rolId === 2) {
            window.location.href = "../pages/recepcionista.html";
        } else if (rolId === 3) {
            window.location.href = "../pages/personal-aseo.html";
        } else {
            Swal.fire({
                icon: "error",
                title: "Rol desconocido",
                text: `El ID de rol ${rolId} no tiene dashboard asignado`
            });
        }

    } catch (error) {
        console.error(error);
        Swal.fire({ icon: "error", title: "Error de conexión", text: "No se pudo conectar con el servidor" });
    }
});
