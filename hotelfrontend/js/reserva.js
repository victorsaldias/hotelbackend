
document.addEventListener("DOMContentLoaded", async () => {

    /* ============================================================
       1) Recuperar CARRITO desde localStorage
    ============================================================ */
    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "No has seleccionado habitaciones", "error")
            .then(() => window.location.href = "rooms.html");
        return;
    }


    /* ============================================================
       2) Recuperar datos de la reserva
    ============================================================ */
    const fechaInicio = localStorage.getItem("fechaInicioReserva");
    const fechaFin = localStorage.getItem("fechaFinReserva");
    const cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva"));

    // Fechas bonitas
    const fechaBonitaInicio = new Date(fechaInicio).toLocaleDateString("es-CL");
    const fechaBonitaFin = new Date(fechaFin).toLocaleDateString("es-CL");

    let fechasHTML = "";

carrito.forEach((h, index) => {
    const fiDate = new Date(h.fechaInicio);
    const ffDate = new Date(h.fechaFin);

    const fi = fiDate.toLocaleDateString("es-CL");
    const ff = ffDate.toLocaleDateString("es-CL");

    const noches = Math.ceil((ffDate - fiDate) / (1000 * 60 * 60 * 24));
    const totalHabitacion = h.precio * noches;

    // Cantidad de acompañantes permitidos según la capacidad
    const acompCount = (h.capacidad || 1) - 1;

    // Construir acompañantes HTML
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

document.addEventListener("change", (e) => {
    if (!e.target.classList.contains("acomp-select")) return;

    const idHab = e.target.dataset.hab;
    const index = e.target.dataset.index;

    acompPorHabitacion[idHab][index].tipoPersona = e.target.value;

    localStorage.setItem("acompsPorHab", JSON.stringify(acompPorHabitacion));
});

document.getElementById("previewFechasMultiples").innerHTML = fechasHTML;
  const elHuespedes = document.getElementById("previewHuespedes");
if (elHuespedes) elHuespedes.textContent = cantidadHuespedes;

    /* ============================================================
       5) BOTÓN DINÁMICO – UN SOLO BOTÓN
    ============================================================ */
    const btn = document.getElementById("btnReservar");

   function validarFormulario() {
    let metodo = document.querySelector("input[name='metodoPago']:checked");
    if (!metodo) return false;

    // Validar acompañantes por habitación
    const data = JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");

    for (const habIndex in data) {
        const acompList = data[habIndex];

        if (!acompList) return false;

        for (const acomp of acompList) {
            if (!acomp || !acomp.tipoPersona) {
                return false;
            }
        }
    }

    return true;
}

    function actualizarBoton() {
        const metodo = document.querySelector("input[name='metodoPago']:checked");

        if (metodo) {
            if (metodo.value === "Presencial") {
                btn.textContent = "Reservar Ahora (Presencial)";
            } else {
                btn.textContent = "Pagar con WebPay";
            }
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


    /* ============================================================
       6) ACCIÓN DEL BOTÓN – DINÁMICA
    ============================================================ */
btn.addEventListener("click", async () => {

    const metodo = document.querySelector("input[name='metodoPago']:checked");
    const clienteId = localStorage.getItem("clienteId");

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


    async function enviarReservaPresencial() {
        try {
            const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/reservas/completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idCliente: clienteId,
                    idHabitacion: room.idHabitacion,
                    fechaInicio: fechaInicioSQL,
                    fechaFin: fechaFinSQL,
                    cantidadHuespedes,
                    total,
                    acompanantes,
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
    text: "Tu reserva quedó registrada.",
    timer: 2000,
    showConfirmButton: false
}).setTimeout(() => {
    window.location.href = "../index.html";
}, 1200);


        } catch (e) {
    console.error("ERROR RESERVA:", e);
    Swal.fire("Error del servidor", e.message || "", "error");
    }
}

    async function iniciarWebPay() {

    const reserva = {
        idCliente: clienteId,
        habitaciones: carrito.map(h => h.idHabitacion),
        fechaInicio,
        fechaFin,
        cantidadHuespedes,
        total,
        acompanantes,
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
    console.error("ERROR API:", data);
    Swal.fire("Error", data.error || data.message || "No se pudo crear la reserva");
    return;
}

        localStorage.setItem("tokenTransbank", data.token);

        window.location.href = `webpay-pago.html?token=${data.token}`;
    }

});

    /* ============================================================
       7) UTILIDADES
    ============================================================ */
    function obtenerAcompanantes() {
    return JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");
}

    function formatearFechaSQL(date) {
    const pad = n => String(n).padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    return `${y}-${m}-${d}`;
}
    function convertirFecha(texto) {
        if (!texto) return null;

        const partes = texto.split(" ");
        const dia = parseInt(partes[0], 10);
        const año = parseInt(partes[2], 10);

        const meses = {
            Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
            Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
        };

        return new Date(año, meses[partes[1]], dia);
    }

    actualizarBoton();

});

let acompanantesPorHabitacion = {};

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
