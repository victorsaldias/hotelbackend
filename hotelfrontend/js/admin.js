const API_URL = 'http://localhost:3000/api/empleados-admin';
let empleadoEditando = null;

document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleados();
    configurarBusqueda();
    cargarNombreAdmin();
});

function cargarNombreAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.nombre) {
        document.getElementById('adminName').textContent = `${usuario.nombre} ${usuario.apellido || ''}`;
    }
}

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
        console.error('❌ Error:', error);
        alert('Error al cargar empleados: ' + error.message);
    }
}

function mostrarEmpleados(empleados) {
    const tbody = document.getElementById('listaEmpleados');

    if (!empleados || empleados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay empleados registrados</td></tr>';
        return;
    }

    tbody.innerHTML = empleados.map(emp => {
        const estadoTexto = emp.idEstadoEmpleado === 1 ? 'Activo' : 'Inactivo';
        const estadoClass = emp.idEstadoEmpleado === 1 ? 'estado-activo' : 'estado-inactivo';

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
                    <button class="btn-edit" onclick="editarEmpleado(${emp.idEmpleado})" title="Editar">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="eliminarEmpleado(${emp.idEmpleado})" title="Eliminar">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function configurarBusqueda() {
    const inputBuscar = document.getElementById('buscar');
    let timeout;

    inputBuscar.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            buscarEmpleados(e.target.value);
        }, 500);
    });
}

async function buscarEmpleados(termino) {
    try {
        const url = termino.trim() !== ''
            ? `${API_URL}/buscar?q=${encodeURIComponent(termino)}`
            : API_URL;

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al buscar');

        mostrarEmpleados(data.empleados);

    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al buscar: ' + error.message);
    }
}

function abrirModal() {
    empleadoEditando = null;
    document.querySelector('.modal-title').textContent = 'Registrar Empleado';
    document.getElementById('btnGuardar').textContent = 'Registrar';
    limpiarFormulario();
    document.getElementById('groupPassword').style.display = "block"; // mostrar pass solo al crear
    document.getElementById('modalEmpleado').classList.add('show');
}

function cerrarModal() {
    document.getElementById('modalEmpleado').classList.remove('show');
    limpiarFormulario();
    empleadoEditando = null;
}

function limpiarFormulario() {
    document.getElementById('empNombre').value = '';
    document.getElementById('empApellido').value = '';
    document.getElementById('empRut').value = '';
    document.getElementById('empCorreo').value = '';
    document.getElementById('empPass').value = '';
    document.getElementById('empRol').value = 'admin';
}

async function guardarEmpleado() {
    try {
        const nombre = document.getElementById('empNombre').value.trim();
        const apellido = document.getElementById('empApellido').value.trim();
        const rut = document.getElementById('empRut').value.trim();
        const correo = document.getElementById('empCorreo').value.trim();
        const password = document.getElementById('empPass').value;
        const rol = document.getElementById('empRol').value;

        if (!nombre || !apellido || !rut || !correo || !rol) {
            alert('Todos los campos son obligatorios');
            return;
        }

        const datos = {
            nombre,
            apellido,
            rut,
            correo,
            rol,
            idSucursal: 2 
        };

        if (!empleadoEditando) {
            if (!password.trim()) {
                alert("La contraseña es obligatoria para crear un empleado.");
                return;
            }
            datos.password = password;
        }

        let url = API_URL;
        let method = 'POST';

        if (empleadoEditando) {
            url = `${API_URL}/${empleadoEditando}`;
            method = 'PUT';
            datos.idEstadoEmpleado = 1;
        }

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(datos)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al guardar');

        alert(data.message || 'Empleado guardado exitosamente');
        cerrarModal();
        cargarEmpleados();

    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al guardar empleado: ' + error.message);
    }
}

async function editarEmpleado(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'GET',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al obtener empleado');

        const emp = data.empleado;

        document.getElementById('empNombre').value = emp.nombre;
        document.getElementById('empApellido').value = emp.apellido;
        document.getElementById('empRut').value = emp.rut;
        document.getElementById('empCorreo').value = emp.correo;

        
        document.getElementById('groupPassword').style.display = "none";

        document.getElementById('empRol').value = emp.rol.toLowerCase();
        document.querySelector('.modal-title').textContent = 'Editar Empleado';
        document.getElementById('btnGuardar').textContent = 'Actualizar';

        empleadoEditando = id;

        document.getElementById('modalEmpleado').classList.add('show');

    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al cargar empleado: ' + error.message);
    }
}

async function eliminarEmpleado(id) {
    if (!confirm('¿Está seguro de eliminar este empleado?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Error al eliminar');

        alert('Empleado eliminado exitosamente');
        cargarEmpleados();

    } catch (error) {
        console.error('❌ Error:', error);
        alert('Error al eliminar empleado: ' + error.message);
    }
}

function cerrarSesion() {
    if (confirm('¿Desea cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = '../pages/login-aseo.html';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modalEmpleado');
    if (event.target === modal) cerrarModal();
};
