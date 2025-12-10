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

    carrito.forEach(item => {          // 👈 AQUÍ ES item, NO h
        total += item.total;

        contenedor.innerHTML += `
            <div class="carrito-item">
                <h4>${item.nombreTipo || "Habitación"}</h4>

                <p><b>Sucursal:</b> ${item.nombreSucursal || "No disponible"}</p>
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