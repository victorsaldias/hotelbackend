const API = "https://hotelbackend-hzc4.onrender.com/api";

const params = new URLSearchParams(window.location.search);
const idHabitacionURL = params.get("id");

const inputNumero = document.getElementById("numero");
const selectTipo = document.getElementById("idTipoHabitacion");
const selectSucursal = document.getElementById("idSucursal");
const selectCarac = document.getElementById("idCaracteristica");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precioPersonalizado");
const infoHabitacion = document.getElementById("infoHabitacion");
const resumenServicios = document.getElementById("resumenServicios");

const modalHabitaciones = document.getElementById("modalHabitaciones");
const btnAbrirModalHab = document.getElementById("btnAbrirModalHab");
const btnCerrarModalHab = document.getElementById("btnCerrarModalHab");
const listaHabAdmin = document.getElementById("listaHabitacionesAdmin");
const buscarHabInput = document.getElementById("buscarHabitacion");

btnAbrirModalHab.addEventListener("click", () => {
    modalHabitaciones.style.display = "flex";
    cargarHabitacionesAdmin();
});

btnCerrarModalHab.addEventListener("click", () => {
    modalHabitaciones.style.display = "none";
});

buscarHabInput.addEventListener("input", () => {
    const filtro = buscarHabInput.value.trim();
    const filas = listaHabAdmin.querySelectorAll("tr");
    filas.forEach(fila => {
        const numero = fila.children[1].textContent;
        fila.style.display = numero.includes(filtro) ? "" : "none";
    });
});

async function cargarHabitacionesAdmin() {
    const resp = await fetch(`${API}/habitaciones/todas`);
    const habitaciones = await resp.json();
    listaHabAdmin.innerHTML = "";
    habitaciones.forEach(h => {
        listaHabAdmin.innerHTML += `
            <tr>
                <td>${h.idHabitacion}</td>
                <td>${h.numero}</td>
                <td>${h.idTipoHabitacion}</td>
                <td>${h.idSucursal}</td>
                <td><button class="btn-save" onclick="seleccionarHabitacion(${h.idHabitacion})">Editar</button></td>
            </tr>
        `;
    });
}

function seleccionarHabitacion(id) {
    location.href = `editarHabitacion.html?id=${id}`;
}


async function cargarSelects() {
    const [tipos, sucursales, caract] = await Promise.all([
        fetch(`${API}/habitaciones/tipos-habitacion`).then(r => r.json()),
        fetch(`${API}/sucursales`).then(r => r.json()), 
        fetch(`${API}/habitaciones/caracteristicas-habitacion`).then(r => r.json())
    ]);

    const caracteristicasConDescripcion = caract.map(c => ({
        ...c, 
        descripcionCompleta: `Capacidad: ${c.capacidad} | Cama: ${c.cama}` 
    }));

    llenar(selectTipo, tipos, "idTipoHabitacion", "nombre");
    llenar(selectSucursal, sucursales, "idSucursal", "nombre");
    llenar(selectCarac, caracteristicasConDescripcion, "idCaracteristica", "descripcionCompleta");
}

function llenar(select, data, valueField, textField) {
    select.innerHTML = "";
    data.forEach(x => {
        select.innerHTML += `<option value="${x[valueField]}">${x[textField]}</option>`;
    });
}

async function cargarHabitacion() {
    const resp = await fetch(`${API}/habitaciones/id/${idHabitacionURL}`);

    if (!resp.ok) {
        Swal.fire("Error de Carga", "No se pudo encontrar la habitación o la API falló (404).", "error");
        return; 
    }

    const h = await resp.json();

    inputNumero.value = h.numero;
    selectTipo.value = h.idTipoHabitacion;
    selectSucursal.value = h.idSucursal;
    selectCarac.value = h.idCaracteristica;
    inputDescripcion.value = h.descripcion ?? "";
    inputPrecio.value = h.precioPersonalizado ?? "";

    infoHabitacion.textContent = `Editando habitación #${h.numero}`;
    await cargarServiciosHabitacion();
}

const modalCaracteristica = document.getElementById("modalCaracteristica");
const btnEditarCaracteristica = document.getElementById("btnEditarCaracteristica");
const btnCerrarModalCaracteristica = document.getElementById("btnCerrarModalCaracteristica");
const btnGuardarCaracteristica = document.getElementById("btnGuardarCaracteristica");
const carTamano = document.getElementById("carTamano");
const carCapacidad = document.getElementById("carCapacidad");
const carCama = document.getElementById("carCama");

btnEditarCaracteristica.addEventListener("click", async () => {
    const idCar = selectCarac.value;
    if (!idCar) return Swal.fire("Atención", "Debe seleccionar una característica", "warning");
    const resp = await fetch(`${API}/habitaciones/caracteristicas/${idCar}`); 
    const c = await resp.json();
    carTamano.value = c.tamano;
    carCapacidad.value = c.capacidad;
    carCama.value = c.cama;
    modalCaracteristica.style.display = "flex";
});

btnCerrarModalCaracteristica.addEventListener("click", () => {
    modalCaracteristica.style.display = "none";
});

btnGuardarCaracteristica.addEventListener("click", async () => {
    const idCar = selectCarac.value;
    await fetch(`${API}/habitaciones/caracteristicas/${idCar}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            tamano: Number(carTamano.value),
            capacidad: Number(carCapacidad.value),
            cama: carCama.value
        })
    });
    Swal.fire("Listo", "Característica actualizada", "success");
    modalCaracteristica.style.display = "none";
});

const modalServicios = document.getElementById("modalServicios");
const btnEditarServicios = document.getElementById("btnEditarServicios");
const btnCerrarModalServicios = document.getElementById("btnCerrarModalServicios");
const btnGuardarServicios = document.getElementById("btnGuardarServicios");
const listaServicios = document.getElementById("listaServicios");

let serviciosDisponibles = [];
let serviciosSeleccionados = [];

btnEditarServicios.addEventListener("click", async () => {
    await cargarServicios();
    await cargarServiciosHabitacion();
    pintarServiciosEnModal();
    modalServicios.style.display = "flex";
});

btnCerrarModalServicios.addEventListener("click", () => {
    modalServicios.style.display = "none";
});

async function cargarServicios() {
    if (serviciosDisponibles.length) return;
    const resp = await fetch(`${API}/habitaciones/servicios`); 
    serviciosDisponibles = await resp.json();
}

async function cargarServiciosHabitacion() {
    const resp = await fetch(`${API}/habitaciones/servicios/${idHabitacionURL}`);
    
    if (!resp.ok) {
        console.error("Error al obtener servicios:", resp.status);
        const errorData = await resp.json().catch(() => ({ mensaje: "Error desconocido del servidor." }));
        console.error("Detalle del error del servidor:", errorData);
        actualizarResumenServicios([]);
        return; 
    }

    const data = await resp.json();
    serviciosSeleccionados = data.map(s => s.idServicio); 
    actualizarResumenServicios(data);
}

function actualizarResumenServicios(data) {
    resumenServicios.textContent =
        data.length ? "Servicios: " + data.map(s => s.nombre).join(", ") : "Sin servicios asociados";
}

function pintarServiciosEnModal() {
    listaServicios.innerHTML = "";
    serviciosDisponibles.forEach(s => {
        listaServicios.innerHTML += `
            <tr>
                <td><input type="checkbox" class="chk-servicio" value="${s.idServicio}"
                    ${serviciosSeleccionados.includes(s.idServicio) ? "checked" : ""}></td>
                <td>${s.nombre}</td>
            </tr>`;
    });
}

btnGuardarServicios.addEventListener("click", async () => {
    const checks = listaServicios.querySelectorAll(".chk-servicio");
    const seleccionados = [];
    checks.forEach(ch => ch.checked && seleccionados.push(Number(ch.value)));

    await fetch(`${API}/habitaciones/servicios/${idHabitacionURL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicios: seleccionados })
    });

    Swal.fire("Listo", "Servicios actualizados", "success");
    modalServicios.style.display = "none";
});

document.getElementById("btnGuardarHabitacion").addEventListener("click", async () => {
    const numero = inputNumero.value.trim();
    const tipo = selectTipo.value;
    const sucursal = selectSucursal.value;
    const carac = selectCarac.value;
    const descripcion = inputDescripcion.value.trim();
    const precio = inputPrecio.value.trim();

    if (!numero || !tipo || !sucursal || !carac || !descripcion)
        return Swal.fire("Atención", "Todos los campos son obligatorios", "warning");

    const body = {
        numero: Number(numero),
        idTipoHabitacion: Number(tipo),
        idSucursal: Number(sucursal),
        idCaracteristica: Number(carac),
        descripcion,
        precioPersonalizado: precio ? Number(precio) : null
    };

    const resp = await fetch(`${API}/habitaciones/editar/${idHabitacionURL}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!resp.ok) return Swal.fire("Error", "No se pudo actualizar la habitación", "error");

    Swal.fire("Listo", "Habitación actualizada", "success")
        .then(() => location.href = "./pages/dashboard-admin.html");
});

window.addEventListener("DOMContentLoaded", async () => {
    
    await cargarSelects(); 

    if (!idHabitacionURL) {
        return; 
    }

    await cargarHabitacion();
});