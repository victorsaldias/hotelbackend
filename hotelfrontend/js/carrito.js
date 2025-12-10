document.addEventListener("DOMContentLoaded", () => {
    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    const contenedor = document.getElementById("carritoContainer");
    const totalSpan = document.getElementById("carritoTotal");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay habitaciones en tu carrito.</p>";
        totalSpan.textContent = "0";
        return;
    }

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
       total += item.total * (item.cantidad || 1);

        contenedor.innerHTML += `
            <div class="carrito-item">
                <h4>${item.nombreTipo || "Habitación"}</h4>

                <p><b>Sucursal:</b> ${item.nombreSucursal || "No disponible"}</p>
                <p><b>Capacidad:</b> ${item.capacidad || "-"} personas</p>
                <p><b>Cama:</b> ${item.cama || "-"}</p>
                <p><b>Tamaño:</b> ${item.tamano || "-"} m²</p>

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

/* 🚮 ELIMINAR DEL CARRITO */
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("eliminar-item")) return;

    const id = e.target.dataset.id;
    const inicio = e.target.dataset.inicio;
    const fin = e.target.dataset.fin;

    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    carrito = carrito.filter(item =>
        !(item.idHabitacion == id &&
          item.fechaInicio == inicio &&
          item.fechaFin == fin)
    );

    localStorage.setItem("carritoFinal", JSON.stringify(carrito));

    Swal.fire("Eliminado", "La habitación fue eliminada.", "success")
        .then(() => location.reload());
});

/* ▶️ CONTINUAR CON LA RESERVA */
document.getElementById("btnContinuarReserva").addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Agrega habitaciones antes de continuar", "info");
        return;
    }

    window.location.href = "../pages/reserva.html";
});
