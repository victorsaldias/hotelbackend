/* ============================================================
   VARIABLES GLOBALES NECESARIAS
============================================================ */

let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];
let fechaInicio = localStorage.getItem("fechaInicioReserva");
let fechaFin = localStorage.getItem("fechaFinReserva");
let cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva"));
let clienteId = localStorage.getItem("clienteId");
let acompanantes = JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");
let total = 0; // se acumula más abajo

let acompanantesPorHabitacion = {};

document.addEventListener("DOMContentLoaded", async () => {
/* ============================================================
   0) DETECTAR ORIGEN DE LA RESERVA
============================================================ */

let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];
let habitacionSeleccionada = JSON.parse(localStorage.getItem("habitacionSeleccionada") || "null");

let modo = "carrito"; // por defecto

if (habitacionSeleccionada && carrito.length === 0) {
    // Reservando solo 1 habitación directamente
    carrito = [habitacionSeleccionada];
    modo = "directo";
}

if (!carrito || carrito.length === 0) {
    Swal.fire("No hay habitaciones seleccionadas", "Selecciona una habitación", "error")
        .then(() => window.location.href = "rooms.html");
    return;
}
    /* ============================================================
       1) VALIDAR CARRITO VACÍO
    ============================================================ */
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "No has seleccionado habitaciones", "error")
            .then(() => window.location.href = "rooms.html");
        return;
    }

    /* ============================================================
       2) CONSTRUIR TARJETAS DE HABITACIÓN
    ============================================================ */

    let fechasHTML = "";

    carrito.forEach((h, index) => {

        const fiDate = new Date(h.fechaInicio);
        const ffDate = new Date(h.fechaFin);

        const fi = fiDate.toLocaleDateString("es-CL");
        const ff = ffDate.toLocaleDateString("es-CL");

        const noches = Math.ceil((ffDate - fiDate) / (1000 * 60 * 60 * 24));

        const totalHabitacion = h.precio * noches;
        total += totalHabitacion; // ACUMULAR TOTAL GLOBAL

        const acompCount = (h.capacidad || 1) - 1;

        let acompHTML = "";
        if (acompCount > 0) {
            acompHTML = `
                <div class="acompanantes-box">
                    <b>Acompañantes (${acompCount})</b>
                    <div id="acomps_h${index}">
                        ${Array.from({ length: acompCount }).map((_, i) => `
                            <div class="acom-item">
                                <label>A${i + 1}</label>
                                <select class="form-control acomp-select"
                                        data-hindex="${index}"
                                        data-idx="${i}">
                                    <option value="adulto">Adulto</option>
                                    <option value="niño">Niño</option>
                                </select>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        fechasHTML += `
            <div class="habitacion-card">
                <div class="habitacion-title">${h.nombreTipo}</div>

                <div class="habitacion-sub">
                    Sucursal: <b>${h.nombreSucursal || "No disponible"}</b>
                </div>

                <div class="habitacion-info">
                    <b>Fecha:</b> ${fi} → ${ff}
                </div>

                <div class="habitacion-info">
                    <b>Huéspedes permitidos:</b> ${h.capacidad || "N/A"}
                </div>

                <div class="habitacion-info">
                    <b>Cama:</b> ${h.cama || "N/A"}  
                    &nbsp;|&nbsp;
                    <b>Tamaño:</b> ${h.tamano || "N/A"}
                </div>

                <div class="habitacion-info">
                    <b>Precio / día:</b> $${h.precio.toLocaleString("es-CL")}
                </div>

                <div class="habitacion-info">
                    <b>Noches:</b> ${noches}
                </div>

                <div class="habitacion-info">
                    <b>Total habitación:</b> $${totalHabitacion.toLocaleString("es-CL")}
                </div>

                ${acompHTML}
            </div>
        `;
    });

    document.getElementById("previewFechasMultiples").innerHTML = fechasHTML;

    const elHuespedes = document.getElementById("previewHuespedes");
    if (elHuespedes) elHuespedes.textContent = cantidadHuespedes;


    /* ============================================================
       3) GUARDAR ACOMPAÑANTES POR HABITACIÓN
    ============================================================ */

    document.addEventListener("change", (e) => {
        if (!e.target.classList.contains("acomp-select")) return;

        const hIndex = e.target.dataset.hindex;
        const idx = e.target.dataset.idx;
        const tipo = e.target.value;

        if (!acompanantesPorHabitacion[hIndex]) {
            acompanantesPorHabitacion[hIndex] = [];
        }

        acompanantesPorHabitacion[hIndex][idx] = { tipoPersona: tipo };

        localStorage.setItem("acompanantesReserva",
            JSON.stringify(acompanantesPorHabitacion)
        );
    });


    /* ============================================================
       4) VALIDACIÓN DEL BOTÓN
    ============================================================ */

    const btn = document.getElementById("btnReservar");

    function validarFormulario() {
        let metodo = document.querySelector("input[name='metodoPago']:checked");
        if (!metodo) return false;

        const data = JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");

        for (const habIndex in data) {
            const acompList = data[habIndex];
            if (!acompList) return false;

            for (const acomp of acompList) {
                if (!acomp || !acomp.tipoPersona) return false;
            }
        }

        return true;
    }

    function actualizarBoton() {
        const metodo = document.querySelector("input[name='metodoPago']:checked");

        if (metodo) {
            btn.textContent = metodo.value === "Presencial"
                ? "Reservar Ahora (Presencial)"
                : "Pagar con WebPay";
        }

        if (validarFormulario()) {
            btn.disabled = false;
            btn.style.cursor = "pointer";
        } else {
            btn.disabled = true;
            btn.style.cursor = "not-allowed";
        }
    }

    document.querySelectorAll("input[name='metodoPago']").forEach(r => {
        r.addEventListener("change", actualizarBoton);
    });

    document.addEventListener("input", actualizarBoton);

    actualizarBoton();


    /* ============================================================
       5) ACCIÓN DEL BOTÓN (PRESENCIAL / WEBPAY)
    ============================================================ */

    btn.addEventListener("click", async () => {

        const metodo = document.querySelector("input[name='metodoPago']:checked");

        if (!clienteId) {
            Swal.fire("Debes iniciar sesión para reservar");
            return;
        }

        if (!metodo) {
            Swal.fire("Selecciona un método de pago");
            return;
        }

        if (metodo.value === "Presencial") {
            await enviarReservaPresencial();
            return;
        }

        if (metodo.value === "WebPay") {
            await iniciarWebPay();
            return;
        }
    });


    /* ============================================================
       6) RESERVA PRESENCIAL
    ============================================================ */

    async function enviarReservaPresencial() {
        try {

            const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/reservas/completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idCliente: clienteId,
                    habitaciones: carrito.map(h => h.idHabitacion),
                    fechaInicio,
                    fechaFin,
                    cantidadHuespedes,
                    total,
                    acompanantes: acompanantesPorHabitacion,
                    metodoPago: "Presencial"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.error || "No se pudo crear la reserva");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Reserva realizada",
                text: "Tu reserva fue registrada correctamente",
                timer: 1500,
                showConfirmButton: false
            });

            localStorage.removeItem("carritoFinal");
            localStorage.removeItem("acompanantesReserva");

            setTimeout(() => window.location.href = "../index.html", 1000);

        } catch (e) {
            console.error("ERROR RESERVA:", e);
            Swal.fire("Error del servidor", e.message || "", "error");
        }
    }


    /* ============================================================
       7) WEBPAY
    ============================================================ */

    async function iniciarWebPay() {

        const reserva = {
            idCliente: clienteId,
            habitaciones: carrito.map(h => h.idHabitacion),
            fechaInicio,
            fechaFin,
            cantidadHuespedes,
            total,
            acompanantes: acompanantesPorHabitacion,
            metodoPago: "WebPay"
        };

        localStorage.setItem("reservaCompleta", JSON.stringify(reserva));

        const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/webpay/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });

        const data = await response.json();

        if (!response.ok) {
            Swal.fire("Error", data.error || data.message || "No se inició WebPay");
            return;
        }

        localStorage.removeItem("carritoFinal");
        localStorage.removeItem("acompanantesReserva");

        localStorage.setItem("tokenTransbank", data.token);

        window.location.href = `webpay-pago.html?token=${data.token}`;
    }

});
