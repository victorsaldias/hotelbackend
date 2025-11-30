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
});


async function cargarReservas() {
    try {
        const res = await fetch("http://localhost:3000/api/reservas");
        const data = await res.json();

        listaReservas = data;
        renderTablaReservas(listaReservas);

    } catch (error) {
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
        const res = await fetch("http://localhost:3000/api/habitaciones/disponibles");
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

    const data = {
        idCliente,
        idHabitacion,
        fechaInicio,
        fechaFin
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
