/* ============================================================
   RESERVA.JS — VERSIÓN FINAL CON PASARELA STEPPER (OPCIÓN A)
============================================================ */

document.addEventListener("DOMContentLoaded", async () => {

    /* ============================================================
       1) Cargar habitación desde API
    ============================================================= */
    const idHabitacion = new URLSearchParams(window.location.search).get("room");

    if (!idHabitacion) {
        Swal.fire("Error", "Habitación no especificada", "error");
        return;
    }

    const res = await fetch(`http://localhost:3000/api/habitaciones/id/${idHabitacion}`);
    const habitacion = await res.json();

    document.getElementById("room-title").textContent = habitacion.tipoHabitacion;
    document.getElementById("room-price").textContent = habitacion.precio;


    /* ============================================================
       2) Recuperar datos base
    ============================================================= */

    const fechaInicio = localStorage.getItem("fechaInicioReserva");
    const fechaFin = localStorage.getItem("fechaFinReserva");
    const cantidadHuespedes = parseInt(localStorage.getItem("cantidadHuespedesReserva") || 1);

    document.getElementById("previewFechaInicio").textContent = fechaInicio;
    document.getElementById("previewFechaFin").textContent = fechaFin;
    document.getElementById("previewHuespedes").textContent = cantidadHuespedes;

    /* ============================================================
       3) PASARELA (STEPPER)
    ============================================================= */

    const totalAcomp = cantidadHuespedes - 1;
    const pasosContainer = document.getElementById("pasoPills");
    const pasoContenido = document.getElementById("pasoContenido");
    const wrapperPasarela = document.getElementById("pasarelaAcompanantes");

    let datosAcompanantes = {};
    let pasoActual = 1;

    if (totalAcomp > 0) {
        wrapperPasarela.style.display = "block";

        // Crear pastillas (A1, A2, A3...)
        pasosContainer.innerHTML = "";
        for (let i = 1; i <= totalAcomp; i++) {
            pasosContainer.innerHTML += `
                <div class="step-pill" id="pill_${i}">A${i}</div>
            `;
        }

        mostrarPaso(1);
    } else {
        wrapperPasarela.style.display = "none";
    }

    function mostrarPaso(num) {
        pasoActual = num;

        pasoContenido.innerHTML = `
            <h5>Acompañante ${num}</h5>

            <input id="nombre_${num}" class="form-control mb-2" placeholder="Nombre" />

            <input id="apellido_${num}" class="form-control mb-2" placeholder="Apellido" />

            <input id="rut_${num}" class="form-control mb-2" placeholder="RUT" />

            <input id="telefono_${num}" class="form-control mb-2" placeholder="Teléfono" />

            <select id="tipo_${num}" class="form-control mb-3">
                <option value="Adulto">Adulto</option>
                <option value="Niño">Niño</option>
            </select>

            <button class="btn ${num === totalAcomp ? 'btn-success' : 'btn-warning'} mt-2" id="btnPaso">
                ${num === totalAcomp ? "Finalizar" : "Siguiente"}
            </button>
        `;

        // actualizar visual stepper
        document.querySelectorAll(".step-pill").forEach(p => p.classList.remove("active"));
        document.getElementById(`pill_${num}`).classList.add("active");

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

        document.getElementById(`pill_${num}`).classList.add("done");

        if (num < totalAcomp) {
            mostrarPaso(num + 1);
        } else {
            pasoContenido.innerHTML = `
                <p class="mt-2 text-success">✔ Todos los acompañantes ingresados.</p>
            `;
        }
    }

    // Esta función se usará en la reserva
    function obtenerAcompanantes() {
        return Object.values(datosAcompanantes);
    }


    /* ============================================================
       4) MÉTODO DE PAGO
    ============================================================= */

    const radios = document.getElementsByName("metodoPago");
    const btnPresencial = document.getElementById("btnReservarPresencial");
    const btnWebPay = document.getElementById("btnPagarWebPay");

    let metodoSeleccionado = null;

    btnPresencial.disabled = true;
    btnPresencial.style.opacity = ".5";
    btnWebPay.style.display = "none";

    radios.forEach(r => {
        r.addEventListener("change", () => {
            metodoSeleccionado = r.value;

            if (metodoSeleccionado === "Presencial") {
                btnPresencial.disabled = false;
                btnPresencial.style.opacity = "1";
                btnWebPay.style.display = "none";
            }

            if (metodoSeleccionado === "WebPay") {
                btnPresencial.disabled = true;
                btnPresencial.style.opacity = ".5";
                btnWebPay.style.display = "block";
            }
        });
    });


    /* ============================================================
       5) RESERVA PRESENCIAL — ENVÍA ACOMPAÑANTES YA CAPTURADOS
    ============================================================= */

    btnPresencial.addEventListener("click", async () => {

        if (!metodoSeleccionado) {
            Swal.fire("Seleccione un método de pago");
            return;
        }

        if (metodoSeleccionado !== "Presencial") {
            Swal.fire("Seleccione Pago Presencial");
            return;
        }

        const idCliente = localStorage.getItem("idCliente");

        if (!idCliente) {
            Swal.fire("Debes iniciar sesión para reservar");
            return;
        }

        const acompanantes = obtenerAcompanantes(); // 🔥 CAPTURADOS DESDE LA PASARELA

        try {
            const response = await fetch("http://localhost:3000/api/reservas/completa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idCliente,
                    idHabitacion,
                    fechaInicio,
                    fechaFin,
                    cantidadHuespedes,
                    acompanantes,
                    metodoPago: "Presencial"
                })
            });

            const data = await response.json();

            if (!response.ok) {
                Swal.fire("Error", data.error || "No se pudo crear la reserva", "error");
                return;
            }

            Swal.fire({
                icon: "success",
                title: "Reserva confirmada",
                text: "Pagarás cuando llegues al hotel."
            }).then(() => {
                window.location.href = "index.html";
            });

        } catch (err) {
            console.error(err);
            Swal.fire("Error del servidor");
        }
    });


    /* ============================================================
       6) WEBPAY (SIMULACIÓN)
    ============================================================= */
    btnWebPay.addEventListener("click", () => {
        Swal.fire("Redirigiendo a WebPay… (Simulación)");
    });

});
