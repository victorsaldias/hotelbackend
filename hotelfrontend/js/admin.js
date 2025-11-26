// ==========================
// ADMIN JS LIMPIO Y FUNCIONANDO
// ==========================

const API_URL = "http://localhost:3000/api/empleados-admin";
let empleadoEditando = null;

// Convertir estado numérico a texto
function getEstadoTexto(id) {
    switch (id) {
        case 1: return "Activo";
        case 2: return "Ocupado";
        case 3: return "Libre";
        case 4: return "Suspendido";
        default: return "Desconocido";
    }
}

// Cargar nombre del admin en el header
function cargarNombreAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.nombre) {
        document.getElementById('adminName').textContent =
            `${usuario.nombre} ${usuario.apellido || ''}`;
    }
}

// =====================
// CARGAR EMPLEADOS
// =====================
async function cargarEmpleados() {
    try {
        const response = await fetch(API_URL, { credentials: 'include' });
        const data = await response.json();

        const tbody = document.getElementById("listaEmpleados");
        tbody.innerHTML = "";

        data.empleados.forEach(emp => {
            tbody.innerHTML += `
                <tr>
                    <td>${emp.idEmpleado}</td>
                    <td>${emp.nombre}</td>
                    <td>${emp.apellido}</td>
                    <td>${emp.correo}</td>
                    <td>${emp.rut}</td>
                    <td>${emp.rolNombre}</td>
                    <td>${getEstadoTexto(emp.idEstadoEmpleado)}</td>
                    <td class="acciones">
                        <button class="btn-edit" onclick="editarEmpleado(${emp.idEmpleado})" title="Editar empleado">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="eliminarEmpleado(${emp.idEmpleado})" title="Suspender empleado">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("❌ Error cargando empleados:", error);
        alert("No se pudieron cargar los empleados");
    }
}

// =====================
// NUEVO EMPLEADO
// =====================
function nuevoEmpleado() {
    empleadoEditando = null;

    document.getElementById('empNombre').value = "";
    document.getElementById('empApellido').value = "";
    document.getElementById('empRut').value = "";
    document.getElementById('empCorreo').value = "";
    document.getElementById('empPassword').value = "";

    document.getElementById('empRol').value = "1";
    document.getElementById('empEstado').value = "1";

    document.getElementById('groupPassword').style.display = "block";

    document.querySelector('.modal-title').textContent = 'Nuevo Empleado';
    document.getElementById('btnGuardar').textContent = 'Guardar';

    document.getElementById('modalEmpleado').classList.add('show');
}

// =====================
// CERRAR MODAL
// =====================
function cerrarModal() {
    document.getElementById('modalEmpleado').classList.remove('show');
    empleadoEditando = null;
    // opcional: limpiar formulario también
    document.getElementById('empNombre').value = "";
    document.getElementById('empApellido').value = "";
    document.getElementById('empRut').value = "";
    document.getElementById('empCorreo').value = "";
    document.getElementById('empPassword').value = "";
    document.getElementById('empRol').value = "1";
    document.getElementById('empEstado').value = "1";
}

// =====================
// EDITAR EMPLEADO
// =====================
async function editarEmpleado(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { credentials: "include" });
        const data = await response.json();
        const emp = data.empleado;

        document.getElementById('empNombre').value = emp.nombre;
        document.getElementById('empApellido').value = emp.apellido;
        document.getElementById('empRut').value = emp.rut;
        document.getElementById('empCorreo').value = emp.correo;
        document.getElementById('empRol').value = String(emp.idRol);
        document.getElementById('empEstado').value = String(emp.idEstadoEmpleado);

        document.getElementById('groupPassword').style.display = "none";

        document.querySelector('.modal-title').textContent = 'Editar Empleado';
        document.getElementById('btnGuardar').textContent = 'Actualizar';

        empleadoEditando = id;
        document.getElementById('modalEmpleado').classList.add('show');

    } catch (error) {
        console.error("❌ Error al cargar empleado:", error);
        alert("Error al cargar empleado");
    }
}

// =====================
// GUARDAR EMPLEADO
// =====================
async function guardarEmpleado() {
    const nombre = document.getElementById('empNombre').value.trim();
    const apellido = document.getElementById('empApellido').value.trim();
    const rut = document.getElementById('empRut').value.trim();
    const correo = document.getElementById('empCorreo').value.trim();
    const password = document.getElementById('empPassword').value;
    const idRol = parseInt(document.getElementById('empRol').value);
    const idEstadoEmpleado = parseInt(document.getElementById('empEstado').value);

    if (!nombre || !apellido || !rut || !correo || isNaN(idRol) || isNaN(idEstadoEmpleado)) {
        alert("Completa todos los campos obligatorios.");
        return;
    }

    if (!empleadoEditando && !password) {
        alert("La contraseña es obligatoria para crear un empleado.");
        return;
    }

    const datos = {
        nombre,
        apellido,
        rut,
        correo,
        idRol,
        idEstadoEmpleado,
        idSucursal: 2
    };

    if (!empleadoEditando) {
        datos.password = password;
    }

    const url = empleadoEditando ? `${API_URL}/${empleadoEditando}` : API_URL;
    const metodo = empleadoEditando ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "No se pudo guardar el empleado");
            return;
        }

        alert(data.message || "Empleado guardado");
        document.getElementById('modalEmpleado').classList.remove('show');
        cargarEmpleados();

    } catch (error) {
        console.error("❌ Error al guardar:", error);
        alert("Error al guardar empleado.");
    }
}

// =====================
// ELIMINAR (SUSPENDER)
// =====================
async function eliminarEmpleado(id) {
    if (!confirm("¿Seguro que deseas suspender este empleado?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "No se pudo suspender empleado");
            return;
        }

        alert("Empleado suspendido");
        cargarEmpleados();

    } catch (error) {
        console.error("❌ Error al suspender:", error);
        alert("No se pudo suspender empleado");
    }
}

// =====================
// INICIALIZAR
// =====================
document.addEventListener('DOMContentLoaded', () => {
    cargarNombreAdmin();
    cargarEmpleados();
});

