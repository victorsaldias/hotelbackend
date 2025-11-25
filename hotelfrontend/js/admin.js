const API_URL = 'http://localhost:3000/api/empleados-admin';
let empleadoEditando = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleados();
    configurarBusqueda();
    cargarNombreAdmin();
});

/* ================================
   CARGAR NOMBRE DEL ADMIN
================================ */
function cargarNombreAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.nombre) {
        document.getElementById('adminName').textContent =
            `${usuario.nombre} ${usuario.apellido || ''}`;
    }
}

/* ================================
   CARGAR EMPLEADOS
================================ */
async function cargarEmpleados() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al cargar empleados');

        mostrarEmpleados(data.empleados);

    } catch (error) {
        console.error('❌ Error al cargar empleados:', error);
        alert('Error al cargar empleados');
    }
}

/* ================================
   MOSTRAR EMPLEADOS EN LA TABLA
================================ */
function mostrarEmpleados(empleados) {
    const tbody = document.getElementById('listaEmpleados');

    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay empleados registrados</td></tr>';
        return;
    }

    tbody.innerHTML = empleados.map(emp => {
        const estadoTexto = emp.idEstadoEmpleado === 1 ? "Activo" : "Inactivo";
        const estadoClass = emp.idEstadoEmpleado === 1 ? "estado-activo" : "estado-inactivo";

        return `
            <tr>
                <td>${emp.idEmpleado}</td>
                <td>${emp.nombre}</td>
                <td>${emp.apellido}</td>
                <td>${emp.correo}</td>
                <td>${emp.rut}</td>
                <td>${emp.rol}</td>
                <td><span class="${estadoClass}">${estadoTexto}</span></td>
                <td>
                    <button class="btn-edit" onclick="editarEmpleado(${emp.idEmpleado})">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="eliminarEmpleado(${emp.idEmpleado})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/* ================================
   BUSCADOR
================================ */
function configurarBusqueda() {
    const input = document.getElementById('buscar');
    let timeout;

    input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => buscarEmpleados(e.target.value), 400);
    });
}

async function buscarEmpleados(termino) {
    try {
        const url = termino.trim()
            ? `${API_URL}/buscar?q=${encodeURIComponent(termino)}`
            : API_URL;

        const response = await fetch(url, { credentials: 'include' });
        const data = await response.json();

        mostrarEmpleados(data.empleados);

    } catch (error) {
        console.error('❌ Error al buscar empleados:', error);
    }
}

/* ================================
   MODAL
================================ */
function abrirModal() {
    empleadoEditando = null;
    document.querySelector('.modal-title').textContent = "Registrar Empleado";
    document.getElementById('btnGuardar').textContent = "Registrar";

    document.getElementById('groupPassword').style.display = "block";

    limpiarFormulario();
    document.getElementById('modalEmpleado').classList.add('show');
}

function cerrarModal() {
    document.getElementById('modalEmpleado').classList.remove('show');
    limpiarFormulario();
    empleadoEditando = null;
}

function limpiarFormulario() {
    document.getElementById('empNombre').value = "";
    document.getElementById('empApellido').value = "";
    document.getElementById('empRut').value = "";
    document.getElementById('empCorreo').value = "";
    document.getElementById('empPass').value = "";
    document.getElementById('empRol').value = "1"; // Admin por defecto
}

/* ================================
   GUARDAR EMPLEADO
================================ */
async function guardarEmpleado() {
    try {
        const nombre = document.getElementById('empNombre').value.trim();
        const apellido = document.getElementById('empApellido').value.trim();
        const rut = document.getElementById('empRut').value.trim();
        const correo = document.getElementById('empCorreo').value.trim();
        const password = document.getElementById('empPass').value;
        const idRol = parseInt(document.getElementById('empRol').value);
        const idSucursal = 2;

        if (!nombre || !apellido || !rut || !correo || !idRol) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const datos = {
            nombre,
            apellido,
            rut,
            correo,
            idRol,
            idSucursal,
            idEstadoEmpleado: 1
        };

       
        if (!empleadoEditando) {
            if (!password.trim()) {
                alert("La contraseña es obligatoria para crear un empleado.");
                return;
            }
            datos.password = password;

        } else {
            datos.idRol = idRol;  
        }

        const response = await fetch(
            empleadoEditando ? `${API_URL}/${empleadoEditando}` : API_URL,
            {
                method: empleadoEditando ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(datos)
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        alert(data.message);
        cerrarModal();
        cargarEmpleados();

    } catch (error) {
        console.error("❌ Error al guardar empleado:", error);
        alert(error.message);
    }
}

/* ================================
   EDITAR EMPLEADO
================================ */
async function editarEmpleado(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            credentials: "include"
        });
        const data = await response.json();
        const emp = data.empleado;

        document.getElementById('empNombre').value = emp.nombre;
        document.getElementById('empApellido').value = emp.apellido;
        document.getElementById('empRut').value = emp.rut;
        document.getElementById('empCorreo').value = emp.correo;
        document.getElementById('empRol').value = emp.idRol;

        document.getElementById('groupPassword').style.display = "none";

        document.querySelector('.modal-title').textContent = "Editar Empleado";
        document.getElementById('btnGuardar').textContent = "Actualizar";

        empleadoEditando = id;
        document.getElementById('modalEmpleado').classList.add('show');

    } catch (error) {
        console.error("❌ Error al cargar empleado:", error);
    }
}

/* ================================
   ELIMINAR EMPLEADO
================================ */
async function eliminarEmpleado(id) {
    if (!confirm("¿Seguro de eliminar este empleado?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const data = await response.json();
        alert(data.message);
        cargarEmpleados();

    } catch (error) {
        console.error("❌ Error al eliminar:", error);
    }
}

/* ================================
   CERRAR SESIÓN
================================ */
function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = "../pages/login-admin.html";
}
