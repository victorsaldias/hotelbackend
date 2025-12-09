const API = "https://hotelbackend-hzc4.onrender.com/api/empleados";

// Obtener datos guardados en localStorage
const empleadoLocal = JSON.parse(localStorage.getItem("empleado"));
if (!empleadoLocal) {
    window.location.href = "../pages/perfil.html";
}

// Elementos del DOM
const rutInput = document.getElementById("perfilRut");
const nombreInput = document.getElementById("perfilNombre");
const apellidoInput = document.getElementById("perfilApellido");
const correoInput = document.getElementById("perfilCorreo");
const passInput = document.getElementById("perfilPass");

const btnEditar = document.getElementById("btnEditar");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

// Cargar perfil del backend
async function cargarPerfil() {
    try {
        const resp = await fetch(`${API}/perfil/${empleadoLocal.idEmpleado}`);
        const data = await resp.json();

        rutInput.value = data.rut;
        nombreInput.value = data.nombre;
        apellidoInput.value = data.apellido;
        correoInput.value = data.correo;
        passInput.value = "";
    } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
    }
}

// Activar modo edición
function activarEdicion() {
    correoInput.disabled = false;
    passInput.disabled = false;

    btnEditar.style.display = "none";
    btnGuardar.style.display = "inline-block";
    btnCancelar.style.display = "inline-block";
}

// Cancelar edición
function cancelarEdicion() {
    correoInput.disabled = true;
    passInput.disabled = true;

    btnEditar.style.display = "inline-block";
    btnGuardar.style.display = "none";
    btnCancelar.style.display = "none";

    cargarPerfil();
}

// Guardar cambios
async function guardarCambios() {
    const correo = correoInput.value.trim();
    const password = passInput.value.trim();

    if (!correo) {
        Swal.fire("Atención", "El correo no puede estar vacío", "warning");
        return;
    }

    try {
        const resp = await fetch(`${API}/perfil/${empleadoLocal.idEmpleado}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo,
                password: password || null
            })
        });

        if (!resp.ok) {
            Swal.fire("Error", "No se pudo actualizar el perfil", "error");
            return;
        }

        Swal.fire("Listo", "Perfil actualizado correctamente", "success");

        cancelarEdicion();
    } catch (err) {
        console.error(err);
        Swal.fire("Error", "Ocurrió un problema al guardar", "error");
    }
}

// Eventos
btnEditar.addEventListener("click", activarEdicion);
btnCancelar.addEventListener("click", cancelarEdicion);
btnGuardar.addEventListener("click", guardarCambios);

// Cargar datos al entrar
cargarPerfil();
