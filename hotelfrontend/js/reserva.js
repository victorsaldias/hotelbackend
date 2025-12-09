
document.addEventListener("DOMContentLoaded", async () => {

    /* ============================================================
       1) Recuperar habitación desde localStorage
    ============================================================ */
    const room = JSON.parse(localStorage.getItem("habitacionSeleccionada"));

    if (!room) {
        Swal.fire("Error", "No se encontró la habitación seleccionada", "error");
        return;
    }

    document.getElementById("room-title").textContent = room.tipoHabitacion;
    document.getElementById("previewPrecio").textContent = room.precio;

    /* ============================================================
       2) Recuperar datos de la reserva
    ============================================================ */
    const fechaInicio = localStorage.getItem("fechaInicioReserva");
    const fechaFin = localStorage.getItem("fechaFinReserva");
    const fechaBonitaInicio = new Date(fechaInicio).toLocaleDateString("es-CL");
const fechaBonitaFin = new Date(fechaFin).toLocaleDateString("es-CL");
    const cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva"));

    document.getElementById("previewFechaInicio").textContent = fechaBonitaInicio;
    document.getElementById("previewFechaFin").textContent = fechaBonitaFin;
    document.getElementById("previewHuespedes").textContent = cantidadHuespedes;


    /* ============================================================
       3) Calcular total
    ============================================================ */

// Convertir fechas desde el texto bonito (06 Dic 2025 → Date real)
const fechaInicioSQL = fechaInicio;
const fechaFinSQL   = fechaFin;

// Creamos Date a partir del string SQL
const fechaI = new Date(fechaInicioSQL);
const fechaF = new Date(fechaFinSQL);

// Calcular días reales
const dias = Math.ceil((fechaF - fechaI) / (1000 * 60 * 60 * 24));
// Calcular total y mostrar
const total = room.precio * dias;
document.getElementById("previewTotal").textContent = total.toLocaleString("es-CL");

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

        <input id="nombre_${num}" class="form-control mb-2" placeholder="Nombre"
            value="${guardado.nombre || ""}" />

        <input id="apellido_${num}" class="form-control mb-2" placeholder="Apellido"
            value="${guardado.apellido || ""}" />

        <input id="rut_${num}" class="form-control mb-2" placeholder="RUT"
            value="${guardado.rut || ""}" />

        <input id="telefono_${num}" class="form-control mb-2" placeholder="Teléfono"
            value="${guardado.telefono || ""}" />

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
            nombre: document.getElementById(`nombre_${num}`).value,
            apellido: document.getElementById(`apellido_${num}`).value,
            rut: document.getElementById(`rut_${num}`).value,
            telefono: document.getElementById(`telefono_${num}`).value,
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
    const total = room.precio * dias;

    if (metodo.value === "Presencial") {
        return enviarReservaPresencial();
    } 
    
    if (metodo.value === "WebPay") {
        return iniciarWebPay();
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
                text: "Tu reserva quedó registrada."
           }).then(() => window.location.href = "../index.html");


        } catch (e) {
            Swal.fire("Error del servidor");
        }
    }

    async function iniciarWebPay() {

        const reserva = {
            idCliente: clienteId,
            idHabitacion: room.idHabitacion,
            fechaInicio: fechaInicioSQL,
            fechaFin: fechaFinSQL,
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
            Swal.fire("Error", data.error);
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
