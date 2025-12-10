let totalGlobal = 0;
let acompanantesPorHabitacion = {};

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
       2) Recuperar datos de reserva
    ============================================================ */
    const fechaInicio = localStorage.getItem("fechaInicioReserva");
    const fechaFin = localStorage.getItem("fechaFinReserva");
    const cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva"));

    let fechasHTML = "";

    carrito.forEach((h, index) => {
        const fiDate = new Date(h.fechaInicio);
        const ffDate = new Date(h.fechaFin);

        const fi = fiDate.toLocaleDateString("es-CL");
        const ff = ffDate.toLocaleDateString("es-CL");

        const noches = Math.ceil((ffDate - fiDate) / 86400000);
        const totalHabitacion = h.precio * noches;

        // calcular acompañantes reales por habitación
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
                    Sucursal: <b>${h.nombreSucursal}</b>
                </div>

                <div class="habitacion-info">
                    <b>Fecha:</b> ${fi} → ${ff}
                </div>

                <div class="habitacion-info">
                    <b>Huéspedes permitidos:</b> ${h.capacidad}
                </div>

                <div class="habitacion-info">
                    <b>Cama:</b> ${h.cama}
                    &nbsp;|&nbsp;
                    <b>Tamaño:</b> ${h.tamano}
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

    /* ============================================================
       3) Calcular total de TODAS las habitaciones
    ============================================================ */
    totalGlobal = carrito.reduce((sum, h) => {
        const fi = new Date(h.fechaInicio);
        const ff = new Date(h.fechaFin);
        const noches = Math.ceil((ff - fi) / 86400000);
        return sum + h.precio * noches;
    }, 0);

    document.getElementById("previewTotal").textContent =
        totalGlobal.toLocaleString("es-CL");

    /* ============================================================
       4) MANEJO DE ACOMPAÑANTES POR HABITACIÓN
    ============================================================ */
    document.addEventListener("change", (e) => {
        if (!e.target.classList.contains("acomp-select")) return;

        const hIndex = e.target.dataset.hindex;
        const idx = e.target.dataset.idx;

        if (!acompanantesPorHabitacion[hIndex]) {
            acompanantesPorHabitacion[hIndex] = [];
        }

        acompanantesPorHabitacion[hIndex][idx] = {
            tipoPersona: e.target.value
        };

        localStorage.setItem("acompanantesReserva",
            JSON.stringify(acompanantesPorHabitacion)
        );

        actualizarBoton();
    });


    /* ============================================================
       5) BOTÓN DINÁMICO
    ============================================================ */
    const btn = document.getElementById("btnReservar");

    function validarFormulario() {
        let metodo = document.querySelector("input[name='metodoPago']:checked");
        if (!metodo) return false;

        const data = JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");

        for (const hab in data) {
            for (const acomp of data[hab]) {
                if (!acomp || !acomp.tipoPersona) return false;
            }
        }

        return true;
    }

    function actualizarBoton() {
        const metodo = document.querySelector("input[name='metodoPago']:checked");

        if (metodo) {
            btn.textContent =
                metodo.value === "Presencial"
                    ? "Reservar Ahora (Presencial)"
                    : "Pagar con WebPay";
        }

        btn.disabled = !validarFormulario();
        btn.style.cursor = btn.disabled ? "not-allowed" : "pointer";
    }

    document.querySelectorAll("input[name='metodoPago']").forEach(r => {
        r.addEventListener("change", actualizarBoton);
    });

    actualizarBoton();


    /* ============================================================
       6) ACCIÓN FINAL DEL BOTÓN
    ============================================================ */
    btn.addEventListener("click", async () => {

        const metodo = document.querySelector("input[name='metodoPago']:checked");
        const clienteId = localStorage.getItem("clienteId");

        if (!clienteId) {
            Swal.fire("Debes iniciar sesión para reservar");
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
       7) RESERVA PRESENCIAL
    ============================================================ */
    async function enviarReservaPresencial() {
        try {
            const acompanantes = obtenerAcompanantes();

            const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/reservas/completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idCliente: localStorage.getItem("clienteId"),
                    habitaciones: carrito.map(h => h.idHabitacion),
                    fechaInicio,
                    fechaFin,
                    cantidadHuespedes,
                    total: totalGlobal,
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
            });

            setTimeout(() => {
    // LIMPIAR CARRO Y DATOS
    localStorage.removeItem("carritoFinal");
    localStorage.removeItem("acompanantesReserva");
    localStorage.removeItem("fechaInicioReserva");
    localStorage.removeItem("fechaFinReserva");
    localStorage.removeItem("cantidadHuespedesReserva");

    window.location.href = "../index.html";
}, 1500);

        } catch (e) {
            console.error("ERROR RESERVA:", e);
            Swal.fire("Error del servidor", e.message);
        }
    }


    /* ============================================================
       8) RESERVA WEBPAY
    ============================================================ */
    async function iniciarWebPay() {

        const acompanantes = obtenerAcompanantes();

        const reserva = {
            idCliente: localStorage.getItem("clienteId"),
            habitaciones: carrito.map(h => h.idHabitacion),
            fechaInicio,
            fechaFin,
            cantidadHuespedes,
            total: totalGlobal,
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
            Swal.fire("Error", data.error || "No se pudo iniciar WebPay");
            return;
        }

        localStorage.setItem("tokenTransbank", data.token);
localStorage.removeItem("carritoFinal");
localStorage.removeItem("acompanantesReserva");
localStorage.removeItem("fechaInicioReserva");
localStorage.removeItem("fechaFinReserva");
localStorage.removeItem("cantidadHuespedesReserva");
        window.location.href = `webpay-pago.html?token=${data.token}`;
    }

});

/* ============================================================
   9) UTILIDADES
============================================================ */
function obtenerAcompanantes() {
    const data = JSON.parse(localStorage.getItem("acompanantesReserva") || "{}");
    return Object.values(data).flat(); // ← ESTA LÍNEA ES LA SOLUCIÓN
    
}

console.log("Acompañantes enviados:", acompanantes);