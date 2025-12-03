let listaReservas = [];
let listaClientes = [];
let listaHabitaciones = [];


document.addEventListener("DOMContentLoaded", () => {
    cargarReservas();
    cargarClientes();
    cargarHabitaciones();

    document.getElementById("btnGuardarReserva")
        .addEventListener("click", registrarReserva);

    document.getElementById("buscarReserva")
        .addEventListener("input", filtrarReservas);
    
    
    setTimeout(() => {
        crearBuscadorCliente();
    }, 500); 
});


async function cargarReservas() {
    try {
        // 🔥 AGREGAR ESTOS CONSOLE.LOG
        const idSucursal = localStorage.getItem('empleadoIdSucursal');
        console.log('🔍 idSucursal del localStorage:', idSucursal);
        
        if (!idSucursal) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró la sucursal del recepcionista."
            });
            return;
        }

        const url = `http://localhost:3000/api/reservas?idSucursal=${idSucursal}`;
        console.log('🔍 URL de la petición:', url);
        
        const res = await fetch(url);
        const data = await res.json();

        console.log('🔍 Reservas recibidas:', data);

        listaReservas = data;
        renderTablaReservas(listaReservas);

    } catch (error) {
        console.error('❌ Error:', error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las reservas."
        });
    }
}



function renderTablaReservas(reservas) {

    const tbody = document.getElementById("listaReservas");
    tbody.innerHTML = "";

    reservas.forEach(r => {

        const numeroHab = r.numeroHabitacion ?? "-";
        const estado = r.idEstadoReserva == 1 ? "Pendiente" :
                       r.idEstadoReserva == 2 ? "Confirmada" :
                       r.idEstadoReserva == 3 ? "Cancelada" : "-";

        const entrada = r.fechaInicio ? r.fechaInicio.split("T")[0] : "-";
        const salida = r.fechaFin ? r.fechaFin.split("T")[0] : "-";

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${r.nombre}</td>
            <td>${r.apellido}</td>
            <td>${r.rut}</td>
            <td>${numeroHab}</td>
            <td>${entrada}</td>
            <td>${salida}</td>
            <td>$${r.total}</td>
            <td>${estado}</td>
        `;

        tbody.appendChild(tr);
    });
}



function filtrarReservas() {

    const texto = document.getElementById("buscarReserva").value.toLowerCase().trim();

    const filtradas = listaReservas.filter(r =>
        r.nombre.toLowerCase().includes(texto) ||
        r.apellido.toLowerCase().includes(texto) ||
        r.rut.toLowerCase().includes(texto) ||
        (r.numeroHabitacion + "").includes(texto)
    );

    renderTablaReservas(filtradas);
}



async function cargarClientes() {
    try {
        const res = await fetch("http://localhost:3000/api/clientes");
        listaClientes = await res.json();

        const select = document.getElementById("reservaCliente");
        select.innerHTML = `<option value="">Seleccione un cliente…</option>`;

        listaClientes.forEach(c => {
            select.innerHTML += `
                <option value="${c.idCliente}">
                    ${c.nombre} ${c.apellido} - ${c.rut}
                </option>
            `;
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los clientes."
        });
    }
}



async function cargarHabitaciones() {
    try {
        
        const idSucursal = localStorage.getItem('empleadoIdSucursal');
        
        if (!idSucursal) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró la sucursal del recepcionista. Por favor, inicie sesión nuevamente."
            });
            return;
        }

        const res = await fetch(`http://localhost:3000/api/habitaciones/disponibles?idSucursal=${idSucursal}`);
        listaHabitaciones = await res.json();

        const select = document.getElementById("reservaHabitacion");
        select.innerHTML = `<option value="">Seleccione una habitación…</option>`;

        listaHabitaciones.forEach(h => {
            select.innerHTML += `
                <option value="${h.idHabitacion}">
                    Habitación ${h.numero} - $${h.precio}
                </option>
            `;
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar las habitaciones."
        });
    }
}



async function registrarReserva() {

    const idCliente = document.getElementById("reservaCliente").value;
    const idHabitacion = document.getElementById("reservaHabitacion").value;
    const fechaInicio = document.getElementById("reservaEntrada").value;
    const fechaFin = document.getElementById("reservaSalida").value;

    if (!idCliente || !idHabitacion || !fechaInicio || !fechaFin) {
        return Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Debes llenar todos los campos antes de continuar."
        });
    }

   
    const idSucursal = localStorage.getItem('empleadoIdSucursal');

    const data = {
        idCliente,
        idHabitacion,
        fechaInicio,
        fechaFin,
        idSucursal  
    };

    try {
        const res = await fetch("http://localhost:3000/api/reservas/completa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const r = await res.json();

        if (res.ok) {

            Swal.fire({
                icon: "success",
                title: "Reserva Registrada",
                text: "La reserva fue creada correctamente.",
                timer: 1500,
                showConfirmButton: false,
                timerProgressBar: true
            });


            cerrarModalReserva();
            cargarReservas();
            cargarHabitaciones();

        } else {
            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: r.error ?? "Ocurrió un error inesperado."
            });
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error interno",
            text: "No se pudo registrar la reserva."
        });
    }
}



function abrirModalReserva() {
    document.getElementById("modalReserva").style.display = "flex";
}

function cerrarModalReserva() {
    document.getElementById("modalReserva").style.display = "none";

    
    const inputBuscarCliente = document.getElementById("buscarCliente");
    if (inputBuscarCliente) {
        inputBuscarCliente.value = "";
        
        const select = document.getElementById("reservaCliente");
        select.innerHTML = '<option value="">Seleccione un cliente…</option>';
        listaClientes.forEach(c => {
            const option = document.createElement('option');
            option.value = c.idCliente;
            option.textContent = c.nombre + ' ' + c.apellido + ' - ' + c.rut;
            select.appendChild(option);
        });
    }

    document.getElementById("reservaCliente").value = "";
    document.getElementById("reservaHabitacion").value = "";
    document.getElementById("reservaEntrada").value = "";
    document.getElementById("reservaSalida").value = "";
}

const empleado = JSON.parse(localStorage.getItem("empleado"));

if (empleado) {
    document.getElementById("recepName").textContent =
        empleado.nombre + " " + empleado.apellido;
}


function crearBuscadorCliente() {
    const selectCliente = document.getElementById("reservaCliente");
    
    if (!selectCliente) {
        console.error("No se encontró el select de clientes");
        return;
    }
    
    const contenedorSelect = selectCliente.parentElement;
    
   
    if (document.getElementById("buscarCliente")) {
        return; 
    }
    
    
    const inputBuscar = document.createElement("input");
    inputBuscar.type = "text";
    inputBuscar.id = "buscarCliente";
    inputBuscar.placeholder = "🔍 Buscar cliente por nombre, apellido o RUT...";
    inputBuscar.style.cssText = "width: 100%; padding: 10px; margin-bottom: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;";
    
    
    contenedorSelect.insertBefore(inputBuscar, selectCliente);
    
    
    inputBuscar.addEventListener("input", filtrarClientesSelect);
}



function filtrarClientesSelect() {
    const texto = document.getElementById("buscarCliente").value.toLowerCase().trim();
    const select = document.getElementById("reservaCliente");
    
    
    select.innerHTML = '<option value="">Seleccione un cliente…</option>';
    
   
    const clientesFiltrados = listaClientes.filter(c =>
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.rut.toLowerCase().includes(texto)
    );
    
    
    clientesFiltrados.forEach(c => {
        const option = document.createElement('option');
        option.value = c.idCliente;
        option.textContent = c.nombre + ' ' + c.apellido + ' - ' + c.rut;
        select.appendChild(option);
    });
    
    
    if (clientesFiltrados.length === 0 && texto !== "") {
        const option = document.createElement('option');
        option.value = "";
        option.disabled = true;
        option.textContent = "❌ No se encontraron clientes";
        select.appendChild(option);
    }
}