document.addEventListener("DOMContentLoaded", () => {

    const listaCarrito = document.getElementById("listaCarrito");
    const totalFinal = document.getElementById("totalFinal");
    const btnContinuar = document.getElementById("btnContinuar");

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>No hay habitaciones en tu carrito.</p>";
        btnContinuar.style.display = "none";
        return;
    }

    let total = 0;

    carrito.forEach(h => {
        total += h.precio;

        listaCarrito.innerHTML += `
            <div class="card mb-3 p-3">
                <h4>${h.tipoHabitacion || "Habitación"}</h4>
                <p><b>Precio:</b> $${h.precio}</p>
                <p><b>Sucursal:</b> ${h.nombreSucursal}</p>

                <button class="btn btn-danger btn-sm eliminar" data-id="${h.idHabitacion}">
                    Quitar
                </button>
            </div>
        `;
    });

    totalFinal.textContent = total.toLocaleString("es-CL");

    // QUITAR ELEMENTO DEL CARRITO
    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);

            carrito = carrito.filter(h => h.idHabitacion !== id);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            location.reload();
        });
    });

    // CONTINUAR → RESERVA CON CARRITO
    btnContinuar.addEventListener("click", () => {
        localStorage.setItem("carritoFinal", JSON.stringify(carrito));
        window.location.href = "reserva.html";
    });

});
