document.addEventListener("DOMContentLoaded", async () => {

    const clienteId = localStorage.getItem("clienteId");

    if (!clienteId) {
        Swal.fire("Debes iniciar sesión");
        return window.location.href = "../pages/login.html";
    }

    const container = document.getElementById("reservasContainer");

    try {
        const res = await fetch(`https://hotelbackend-hzc4.onrender.com/api/reservas/cliente/${clienteId}`);
       console.log("RESPONSE STATUS:", res.status);
const data = await res.json();
console.log("DATA RECIBIDA:", data);
        if (!data || data.length === 0) {
            container.innerHTML = "<p>No tienes reservas.</p>";
            return;
        }

        container.innerHTML = "";

        data.forEach(r => {
            container.innerHTML += `
                <div class="col-12 col-md-6">
                    <div class="card p-3">
                        <h5>Reserva #${r.idReserva}</h5>
                        <p><strong>Habitación:</strong> ${r.idHabitacion}</p>
                        <p><strong>Entrada:</strong> ${new Date(r.fechaInicio).toLocaleString()}</p>
                        <p><strong>Salida:</strong> ${new Date(r.fechaFin).toLocaleString()}</p>
                        <p><strong>Huéspedes:</strong> ${r.cantidadHuespedes}</p>
                        <p><strong>Total:</strong> $${r.total}</p>
                        <p><strong>Estado:</strong> ${r.estadoReserva}</p>
                    </div>
                </div>
            `;
        });

    } catch (e) {
        container.innerHTML = "<p>Error al cargar tus reservas.</p>";
    }
});
