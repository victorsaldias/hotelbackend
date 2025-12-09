document.addEventListener("DOMContentLoaded", async () => {

    const clienteId = localStorage.getItem("clienteId");
    const container = document.getElementById("reservasContainer");

    let reservas = []; 

    if (!clienteId) {
        Swal.fire("Debes iniciar sesión");
        return window.location.href = "login.html";
    }

    console.log("Cargando reservas del cliente...");

    try {
        const res = await fetch(`http://localhost:3000/api/reservas/cliente/${clienteId}`);
        reservas = await res.json();

        renderReservas(reservas);

    } catch (e) {
        container.innerHTML = "<p class='text-danger'>Error al cargar tus reservas.</p>";
    }

   
    function renderReservas(lista) {

        if (!lista || lista.length === 0) {
            container.innerHTML = "<p class='text-center'>No tienes reservas.</p>";
            return;
        }

        container.innerHTML = "";

        lista.forEach(r => {

            const estadoClase =
                r.estadoReserva === "Confirmada" ? "estado-confirmada" :
                r.estadoReserva === "Cancelada" ? "estado-cancelada" :
                "estado-pendiente";

            container.innerHTML += `
                <div class="col-12 col-md-6 col-xl-4">
                    <div class="reserva-card">
                        <h5>Reserva #${r.idReserva}</h5>

                        <p><strong>Habitación:</strong> ${r.numeroHabitacion || "N/A"}</p>
                        <p><strong>Entrada:</strong> ${formatear(r.fechaInicio)}</p>
                        <p><strong>Salida:</strong> ${formatear(r.fechaFin)}</p>
                        <p><strong>Huéspedes:</strong> ${r.cantidadHuespedes}</p>
                        <p><strong>Total:</strong> $${r.total}</p>

                        <span class="estado ${estadoClase}">
                            ${r.estadoReserva}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    function formatear(fecha) {
        return new Date(fecha).toLocaleString("es-CL", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }

    
    document.getElementById("btnFiltrar").addEventListener("click", () => {
        const desde = document.getElementById("filterDesde").value;
        const hasta = document.getElementById("filterHasta").value;

        let filtradas = reservas;

        if (desde) {
            filtradas = filtradas.filter(r => new Date(r.fechaInicio) >= new Date(desde));
        }

        if (hasta) {
            const finHasta = new Date(hasta);
            finHasta.setHours(23, 59, 59);
            filtradas = filtradas.filter(r => new Date(r.fechaFin) <= finHasta);
        }

        renderReservas(filtradas);
    });

});
