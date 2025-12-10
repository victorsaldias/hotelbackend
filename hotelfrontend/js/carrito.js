function fechasSolapan(f1, f2, g1, g2) {
    return (f1 <= g2 && g1 <= f2);
}
document.addEventListener("DOMContentLoaded", () => {

    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    const contenedor = document.getElementById("carritoContainer");
    const totalSpan = document.getElementById("carritoTotal");
    const btnContinuar = document.getElementById("btnContinuar");

    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay habitaciones en tu carrito.</p>";
        totalSpan.textContent = "0";
        btnContinuar.style.display = "none";
        return;
    }

    contenedor.innerHTML = ""; // limpiar
    let total = 0;

    carrito.forEach(h => {

        total += h.precio;

        contenedor.innerHTML += `
            <div class="carrito-item border p-3 mb-2">
               <h4>${r.nombreTipo}</h4>
<p>Fecha: ${r.fechaInicio} → ${r.fechaFin}</p>
<p>Precio por día: $${r.precio.toLocaleString("es-CL")}</p>
<p>Total: $${r.total.toLocaleString("es-CL")}</p>

                <button class="btn btn-danger btn-sm eliminar-btn"
                        data-id="${h.idHabitacion}">
                    Eliminar
                </button>
            </div>
        `;
    });

    totalSpan.textContent = total.toLocaleString("es-CL");

    // 🔥 Eliminar del carrito
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("eliminar-btn")) return;

        const id = parseInt(e.target.dataset.id);

        carrito = carrito.filter(h => h.idHabitacion !== id);
        localStorage.setItem("carritoFinal", JSON.stringify(carrito));

        Swal.fire("Eliminado", "Habitación quitada del carrito", "success")
            .then(() => location.reload());
    });

    // 🔥 Continuar
    btnContinuar.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire("Carrito vacío", "Agrega habitaciones antes de continuar", "info");
            return;
        }

        // Guardar habitaciones seleccionadas para reserva.html
        localStorage.setItem("habitacionesSeleccionadas", JSON.stringify(carrito));

        window.location.href = "reserva.html";
    });

});
