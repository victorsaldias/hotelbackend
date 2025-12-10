document.addEventListener("DOMContentLoaded", () => {

    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];
    const contenedor = document.getElementById("carritoContainer");
    const totalSpan = document.getElementById("carritoTotal");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay habitaciones en tu carrito.</p>";
        totalSpan.textContent = "$0";
        return;
    }

    contenedor.innerHTML = "";

    let total = 0;

    carrito.forEach(h => {
        total += h.precio;

        contenedor.innerHTML += `
            <div class="carrito-item">
                <h4>${h.tipoHabitacion}</h4>
                <p>Precio: $${h.precio.toLocaleString("es-CL")}</p>
                <button class="btn btn-danger btn-sm eliminar-item" data-id="${h.idHabitacion}">
                    Eliminar
                </button>
                <hr>
            </div>
        `;
    });

    totalSpan.textContent = "$" + total.toLocaleString("es-CL");

    // Eliminar habitación del carrito
    document.querySelectorAll(".eliminar-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.dataset.id);

            carrito = carrito.filter(h => h.idHabitacion !== id);
            localStorage.setItem("carritoFinal", JSON.stringify(carrito));

            location.reload(); // refrescar carrito
        });
    });
});