const LOGIN_URL = "../login-aseo.html";
const API = "http://localhost:3000/api/perfil";

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

async function cargarPerfil() {
    const id = obtenerEmpleadoActual();
    if (!id) return;

    try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();

        if (!data.ok) {
            return Swal.fire("Error", "No se pudo cargar el perfil", "error");
        }

        const e = data.empleado;

        document.getElementById("perfilRut").value = e.rut;
        document.getElementById("perfilNombre").value = e.nombre;
        document.getElementById("perfilApellido").value = e.apellido;
        document.getElementById("perfilRol").value = e.rol;
        document.getElementById("perfilEstado").value = e.estado;
        document.getElementById("perfilSucursal").value = e.sucursal;
        document.getElementById("perfilPass").value = "";

        document.getElementById("perfilNombreHeader").textContent =
            e.nombre + " " + e.apellido;

    } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
}

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

        if (!data.ok) {
            return Swal.fire("Error", data.message, "error");
        }

        Swal.fire("Listo", "Contraseña actualizada", "success");
        cancelarEdicion();

    } catch (error) {
        Swal.fire("Error", "No se pudo actualizar la contraseña", "error");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPerfil();

    btnEditar.addEventListener("click", activarEdicion);
    btnGuardar.addEventListener("click", guardar);
    btnCancelar.addEventListener("click", cancelarEdicion);
});
