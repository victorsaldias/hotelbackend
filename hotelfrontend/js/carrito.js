document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    const contenedor = document.getElementById("carritoContainer");
    const totalSpan = document.getElementById("carritoTotal");

    // Si está vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay habitaciones en tu carrito.</p>";
        totalSpan.textContent = "0";
        return;
    }

    contenedor.innerHTML = ""; // limpiar

    let total = 0;

    carrito.forEach(item => {
        total += item.total;

        contenedor.innerHTML += `
            <div class="carrito-item">
                <h4>${item.nombreTipo || "Habitación"}</h4>

                <p><b>Sucursal:</b> ${h.nombreSucursal}</p>
                <p><b>Fecha:</b> ${item.fechaInicio} → ${item.fechaFin}</p>
                <p><b>Precio:</b> $${item.precio.toLocaleString("es-CL")}</p>
                <p><b>Total:</b> $${item.total.toLocaleString("es-CL")}</p>

                <button class="btn btn-danger btn-sm eliminar-item"
                        data-id="${item.idHabitacion}"
                        data-inicio="${item.fechaInicio}"
                        data-fin="${item.fechaFin}">
                    Eliminar
                </button>
                <hr>
            </div>
        `;
    });

    totalSpan.textContent = total.toLocaleString("es-CL");
});

// ===============================
// BOTÓN → CONTINUAR CON LA RESERVA
// ===============================
const btnContinuar = document.getElementById("btnContinuarReserva");

if (btnContinuar) {
    btnContinuar.addEventListener("click", () => {
        
        let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

        if (carrito.length === 0) {
            Swal.fire("Carrito vacío", "Agrega habitaciones antes de continuar", "info");
            return;
        }

        // Guardamos el carrito COMPLETO para reserva.html
        localStorage.setItem("carritoReserva", JSON.stringify(carrito));

        // Ir a confirmar la reserva
        window.location.href = "../pages/reserva.html";
    });
}