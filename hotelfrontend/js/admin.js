const API_URL = "http://localhost:3000/api/empleados-admin";
let empleadoEditando = null;

// 🟢 Convertir idEstadoEmpleado a texto
function getEstadoTexto(id) {
    switch (id) {
        case 1: return "Activo";
        case 2: return "Ocupado";
        case 3: return "Libre";
        case 4: return "Suspendido";
        default: return "Desconocido";
    }
}

// 🟢 Cargar empleados en tabla
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
        if (window.Swal) {
            Swal.fire("Error", "No se pudieron cargar los empleados", "error");
        } else {
            alert("No se pudieron cargar los empleados");
        }
    }
}

// 🟢 Abrir modal para nuevo empleado
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

// 🟢 Editar empleado
        console.error('❌ Error al cargar empleados:', error);
        alert('Error al cargar empleados');
    
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

        // En edición no mostramos ni pedimos password
        document.getElementById('groupPassword').style.display = "none";

        document.getElementById('empRol').value = String(emp.idRol);
        document.getElementById('empEstado').value = String(emp.idEstadoEmpleado);

        document.querySelector('.modal-title').textContent = 'Editar Empleado';
        document.getElementById('btnGuardar').textContent = 'Actualizar';
        document.getElementById('groupPassword').style.display = "none";

        document.querySelector('.modal-title').textContent = "Editar Empleado";
        document.getElementById('btnGuardar').textContent = "Actualizar";

        empleadoEditando = id;
        document.getElementById('modalEmpleado').classList.add('show');

    } catch (error) {
        console.error('❌ Error:', error);
        if (window.Swal) {
            Swal.fire("Error", "Error al cargar empleado: " + error.message, "error");
        } else {
            alert('Error al cargar empleado: ' + error.message);
        }
    }
}

// 🟢 Guardar o actualizar empleado
async function guardarEmpleado() {
    const nombre = document.getElementById('empNombre').value.trim();
    const apellido = document.getElementById('empApellido').value.trim();
    const rut = document.getElementById('empRut').value.trim();
    const correo = document.getElementById('empCorreo').value.trim();
    const password = document.getElementById('empPassword').value;
    const idRol = parseInt(document.getElementById('empRol').value);
    const idEstadoEmpleado = parseInt(document.getElementById('empEstado').value);

    // 🔴 Validación básica antes de mandar al backend
    if (!nombre || !apellido || !rut || !correo || !idRol || !idEstadoEmpleado || isNaN(idRol) || isNaN(idEstadoEmpleado)) {
        if (window.Swal) {
            Swal.fire("Campos requeridos",
                "Completa todos los campos obligatorios y selecciona Rol y Estado válidos.",
                "warning"
            );
        } else {
            alert("Completa todos los campos obligatorios y selecciona Rol y Estado válidos.");
        }
        return;
    }

    // Si es nuevo empleado, password es obligatorio
    if (!empleadoEditando && !password) {
        if (window.Swal) {
            Swal.fire("Campos requeridos", "La contraseña es obligatoria para un nuevo empleado.", "warning");
        } else {
            alert("La contraseña es obligatoria para un nuevo empleado.");
        }
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

    // Solo enviamos password al crear
    if (!empleadoEditando) {
        datos.password = password;
    }

    const metodo = empleadoEditando ? "PUT" : "POST";
    const url = empleadoEditando ? `${API_URL}/${empleadoEditando}` : API_URL;

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            credentials: "include",          // 🔴 IMPORTANTE: mandar cookie de sesión
            body: JSON.stringify(datos)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Respuesta error:", data);
            if (window.Swal) {
                Swal.fire("Error", data.message || "No se pudo guardar el empleado", "error");
            } else {
                alert('Error: ' + (data.message || "No se pudo guardar el empleado"));
            }
            return;
        }

        if (window.Swal) {
            Swal.fire("Listo", "Empleado guardado con éxito", "success");
        } else {
            alert("Empleado guardado con éxito");
        }

        document.getElementById('modalEmpleado').classList.remove('show');
        cargarEmpleados();

    } catch (error) {
        console.error('❌ Error:', error);
        if (window.Swal) {
            Swal.fire("Error", "Error al guardar empleado: " + error.message, "error");
        } else {
            alert('Error al guardar empleado: ' + error.message);
        }
    }
}

// 🟢 Eliminar (suspender)
async function eliminarEmpleado(id) {
    if (!confirm("¿Seguro que deseas suspender este empleado?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"   // 🔴 También necesita la cookie
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error("❌ Error suspendiendo:", data);
            if (window.Swal) {
                Swal.fire("Error", data.message || "Error al suspender empleado", "error");
            } else {
                alert("Error al suspender empleado");
            }
            return;
        }

        if (window.Swal) {
            Swal.fire("Listo", "Empleado suspendido", "success");
        } else {
            alert("Empleado suspendido");
        }

        cargarEmpleados();

    } catch (error) {
        console.error("❌ Error:", error);
        if (window.Swal) {
            Swal.fire("Error", "Error al suspender empleado: " + error.message, "error");
        } else {
            alert("Error al suspender empleado: " + error.message);
        }
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
