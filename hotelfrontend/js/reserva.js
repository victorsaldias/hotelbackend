
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

    /* Mostrar resumen del carrito (solo título y precios) */
    let listadoHTML = "";
    carrito.forEach(h => {
        listadoHTML += `
            <p><b>${h.nombreTipo}</b> - $${h.precio.toLocaleString("es-CL")}</p>
        `;
    });

    document.getElementById("room-title").innerHTML = "Habitaciones Seleccionadas";
    document.getElementById("previewPrecio").innerHTML = listadoHTML;


    /* ============================================================
       2) Recuperar datos de la reserva
    ============================================================ */
    const fechaInicio = localStorage.getItem("fechaInicioReserva");
    const fechaFin = localStorage.getItem("fechaFinReserva");
    const cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva"));

    // Fechas bonitas
    const fechaBonitaInicio = new Date(fechaInicio).toLocaleDateString("es-CL");
    const fechaBonitaFin = new Date(fechaFin).toLocaleDateString("es-CL");

    document.getElementById("previewFechaInicio").textContent = fechaBonitaInicio;
    document.getElementById("previewFechaFin").textContent = fechaBonitaFin;
    document.getElementById("previewHuespedes").textContent = cantidadHuespedes;


    /* ============================================================
       3) Calcular total para TODAS las habitaciones
    ============================================================ */
    const fechaI = new Date(fechaInicio);
    const fechaF = new Date(fechaFin);
    const dias = Math.ceil((fechaF - fechaI) / (1000 * 60 * 60 * 24));

    const total = carrito.reduce((sum, h) => sum + (h.precio * dias), 0);

    document.getElementById("previewTotal").textContent =
        total.toLocaleString("es-CL");

    /* ============================================================
       4) PASARELA ACOMPAÑANTES
    ============================================================ */
    const totalAcomp = cantidadHuespedes - 1;
    const wrapperPasarela = document.getElementById("pasarelaAcompanantes");
    const pasosContainer = document.getElementById("pasoPills");
    const pasoContenido = document.getElementById("pasoContenido");

    let datosAcompanantes = {};
    let pasoActual = 1;

    if (totalAcomp > 0) {
        wrapperPasarela.style.display = "block";
        pasosContainer.innerHTML = "";

        for (let i = 1; i <= totalAcomp; i++) {
    pasosContainer.innerHTML += `<div class="step-pill" id="pill_${i}">A${i}</div>`;
}

// Activar click en cada pill (A1, A2, A3…)
for (let i = 1; i <= totalAcomp; i++) {
    document.getElementById(`pill_${i}`).addEventListener("click", () => {
        mostrarPaso(i);   // ← cargar los datos guardados
    });
}

        mostrarPaso(1);
    }

   function mostrarPaso(num) {
    // Recuperar datos guardados previamente
    const guardado = datosAcompanantes[num] || {};

    pasoContenido.innerHTML = `
        <h5>Acompañante ${num}</h5>
        <select id="tipo_${num}" class="form-control mb-3">
            <option value="adulto" ${guardado.tipoPersona === "adulto" ? "selected" : ""}>Adulto</option>
            <option value="niño" ${guardado.tipoPersona === "niño" ? "selected" : ""}>Niño</option>
        </select>

        <button class="btn ${num === totalAcomp ? 'btn-success' : 'btn-warning'} mt-2" id="btnPaso">
            ${num === totalAcomp ? "Finalizar" : "Siguiente"}
        </button>
    `;

    // Cambiar estado visual de los pills
    document.querySelectorAll(".step-pill").forEach(p => p.classList.remove("active"));
    document.getElementById(`pill_${num}`).classList.add("active");

    // Al hacer clic en el botón → guardar datos
    document.getElementById("btnPaso").onclick = () => guardarPaso(num);
}

    function guardarPaso(num) {
        datosAcompanantes[num] = {
        
            tipoPersona: document.getElementById(`tipo_${num}`).value
        };

        // Guardar inmediatamente
        localStorage.setItem("acompanantesReserva", JSON.stringify(datosAcompanantes));

        document.getElementById(`pill_${num}`).classList.add("done");

        if (num < totalAcomp) {
            mostrarPaso(num + 1);
        } else {
            pasoContenido.innerHTML = `
                <p class="mt-2 text-success">✔ Todos los acompañantes listos.</p>
            `;
        }

        actualizarBoton();
    }


    /* ============================================================
       5) BOTÓN DINÁMICO – UN SOLO BOTÓN
    ============================================================ */
    const btn = document.getElementById("btnReservar");

    function validarFormulario() {
        let metodo = document.querySelector("input[name='metodoPago']:checked");
        if (!metodo) return false;

        // Validar acompañantes
        if (totalAcomp > 0) {
            for (let i = 1; i <= totalAcomp; i++) {
                const acomp = datosAcompanantes[i];
                if (!acomp || !acomp.nombre || !acomp.apellido) {
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
    const acompanantes = obtenerAcompanantes();

    if (!clienteId) {
        Swal.fire("Debes iniciar sesión para reservar");
        return;
    }

    // YA NO recalculamos las fechas
    total = total; 

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
        const data = localStorage.getItem("acompanantesReserva");
        if (!data) return [];
        return Object.values(JSON.parse(data));
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
