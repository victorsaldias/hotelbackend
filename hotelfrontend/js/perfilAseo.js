const LOGIN_URL = "./pages/login-aseo.html";
const API = "https://hotelbackend-hzc4.onrender.com/api/empleados-admin";

//Obtener empleado actual
function obtenerEmpleadoActual() {
    const id = localStorage.getItem("empleadoId");

    if (!id) {
        Swal.fire({
            icon: "warning",
            title: "Sesión expirada",
            text: "Debes iniciar sesión nuevamente"
        }).then(() => location.href = LOGIN_URL);
        return null;
    }

    return id;
}


// Perfil del empleado
async function cargarPerfil() {
    const id = obtenerEmpleadoActual();
    if (!id) return;

    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        // Backend devuelve: { success: true, empleado: {...} }
        if (!data.success || !data.empleado) {
            return Swal.fire("Error", "No se pudo cargar el perfil de este empleado", "error");
        }

        const e = data.empleado;

        // Llenar campos del perfil
        document.getElementById("perfilRut").value = e.rut;
        document.getElementById("perfilNombre").value = e.nombre;
        document.getElementById("perfilApellido").value = e.apellido;
        document.getElementById("perfilRol").value = e.rol;   // usa texto, no idRol
        document.getElementById("perfilEstado").value = e.idEstadoEmpleado;
        document.getElementById("perfilSucursal").value = e.idSucursal;

        // Limpiar password
        document.getElementById("perfilPass").value = "";

        // Mostrar nombre en header
        document.getElementById("perfilNombreHeader").textContent =
            `${e.nombre} ${e.apellido}`;

    } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
}


  // Editar contraseña

function activarEdicion() {
    perfilPass.disabled = false;

    btnEditar.style.display = "none";
    btnGuardar.style.display = "inline-block";
    btnCancelar.style.display = "inline-block";
}

function cancelarEdicion() {
    perfilPass.value = "";
    perfilPass.disabled = true;

    btnEditar.style.display = "inline-block";
    btnGuardar.style.display = "none";
    btnCancelar.style.display = "none";
}

// Guardar nueva contraseña
async function guardar() {
    const id = obtenerEmpleadoActual();
    if (!id) return;

    const nuevaPass = perfilPass.value.trim();
    if (!nuevaPass) {
        return Swal.fire("Advertencia", "Ingrese una nueva contraseña", "warning");
    }

    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: nuevaPass })
        });

        const data = await res.json();

        if (!data.success) {
            return Swal.fire("Error", data.message || "No se pudo actualizar la contraseña", "error");
        }

        Swal.fire("Listo", "Contraseña actualizada correctamente", "success");
        cancelarEdicion();

    } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
}

// Inicialización de elementos y eventos
document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();

    btnEditar.addEventListener("click", activarEdicion);
    btnGuardar.addEventListener("click", guardar);
    btnCancelar.addEventListener("click", cancelarEdicion);
});
