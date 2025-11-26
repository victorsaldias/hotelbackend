document.addEventListener("DOMContentLoaded", async () => {

    const roomId = new URLSearchParams(window.location.search).get("room");

    if (!roomId) {
        alert("Error: No se especificó una habitación.");
        return;
    }

    // Cargar datos reales de la habitación
    const res = await fetch(`http://localhost:3000/api/habitaciones/id/${roomId}`);
    const room = await res.json();

    document.getElementById("room-title").textContent = room.tipoHabitacion;
    document.getElementById("room-price").textContent = room.precio;


    /* ---------------------- AÑADIR ACOMPAÑANTES DINÁMICOS ---------------------- */
    const cantAcomp = document.getElementById("cantAcomp");
    const contAcomp = document.getElementById("acompanantesContainer");

    cantAcomp.addEventListener("input", () => {
        const n = parseInt(cantAcomp.value);
        contAcomp.innerHTML = "";

        for (let i = 1; i <= n; i++) {
            contAcomp.innerHTML += `
                <div class="acompanante-box">
                    <h5>Acompañante ${i}</h5>

                    <label>Nombre completo:</label>
                    <input type="text" class="form-control acomp-nombre" required>

                    <label class="mt-2">RUT:</label>
                    <input type="text" class="form-control acomp-rut" required>

                    <label class="mt-2">Tipo:</label>
                    <select class="form-control acomp-tipo">
                        <option value="Adulto">Adulto</option>
                        <option value="Niño">Niño</option>
                    </select>
                </div>
            `;
        }
    });


    /* ---------------------------- ENVIAR RESERVA ---------------------------- */
    document.getElementById("reservaForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const fechaInicio = document.getElementById("fechaInicio").value;
        const fechaFin = document.getElementById("fechaFin").value;

        let acomp = [];
        const boxes = document.querySelectorAll(".acompanante-box");

        boxes.forEach(b => {
            acomp.push({
                nombre: b.querySelector(".acomp-nombre").value,
                rut: b.querySelector(".acomp-rut").value,
                tipo: b.querySelector(".acomp-tipo").value
            });
        });

        const data = {
            idHabitacion: roomId,
            fechaInicio,
            fechaFin,
            acompanantes: acomp
        };

        const resp = await fetch("http://localhost:3000/api/reservas/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const json = await resp.json();

        if (!resp.ok) {
            alert("Error creando la reserva: " + json.message);
            return;
        }

        alert("Reserva creada con éxito!");
        window.location.href = "mis-reservas.html";
    });

});
