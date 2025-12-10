/* ============================================================
   CARGA DE HABITACIONES EN ROOMS.HTML — VERSION ARREGLADA
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    const roomsContainer = document.getElementById("roomsContainer");
    const habitaciones = JSON.parse(localStorage.getItem("habitacionesBusqueda")) || [];

    if (habitaciones.length === 0) {
        roomsContainer.innerHTML = "<p>No hay habitaciones disponibles.</p>";
        return;
    }

    const tipos = {
        1: "Premium King",
        2: "Habitación Deluxe",
        3: "Suite Ejecutiva",
        4: "Suite Familiar"
    };

    const imagenesPorTipo = {
        1: "../img/rooms/room-1.jpg",
        2: "../img/rooms/room-2.jpg",
        3: "../img/rooms/room-3.jpg",
        4: "../img/rooms/room-4.jpg"
    };

    roomsContainer.innerHTML = "";

    habitaciones.forEach(h => {
        const nombreTipo = tipos[h.idTipoHabitacion] || "Habitación";
        const imagen = imagenesPorTipo[h.idTipoHabitacion] || "../img/rooms/room-1.jpg";

        roomsContainer.innerHTML += `
            <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="room__item">
                    <img src="${imagen}" alt="${nombreTipo}" style="width:100%; height:250px; object-fit:cover;">
                    <div class="room__text">
                        <h3>${nombreTipo}</h3>
                        <h2>$${h.precio}<span> / día</span></h2>
                        <ul>
                            <li><strong>Capacidad:</strong> ${h.capacidad} personas</li>
                            <li><strong>Camas:</strong> ${h.cama}</li>
                            <li><strong>Tamaño:</strong> ${h.tamano} m²</li>
                            <li><strong>Sucursal:</strong> ${h.nombreSucursal}</li>
                        </ul>

                        <div class="room-buttons">
                            <button class="btn-secondary-small ver-detalles-btn"
                                    data-info='${JSON.stringify(h)}'>
                                Ver Detalles
                            </button>

                            <button class="btn-success agregar-carrito-btn"
                                    data-info='${JSON.stringify(h)}'>
                                Agregar al Carrito
                            </button>

                            <button class="btn-primary-medium reservar-btn"
                                    data-info='${JSON.stringify(h)}'>
                                Reservar Ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    /* Ir a detalles */
    document.querySelectorAll(".ver-detalles-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const info = JSON.parse(btn.dataset.info);
            localStorage.setItem("habitacionSeleccionada", JSON.stringify(info));
            window.location.href = "../pages/room-details.html";
        });
    });

    /* Reservar ahora */
    document.querySelectorAll(".reservar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const info = JSON.parse(btn.dataset.info);
            localStorage.setItem("habitacionSeleccionada", JSON.stringify(info));
            window.location.href = "../pages/reserva.html";
        });
    });
});

/* ============================================================
   EVENTO: AGREGAR AL CARRITO (OFICIAL)
============================================================ */
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("agregar-carrito-btn")) return;

    const data = JSON.parse(e.target.dataset.info);

    let carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];

    if (carrito.some(h => h.idHabitacion === data.idHabitacion)) {
        Swal.fire("Atención", "Esta habitación ya está en el carrito", "info");
        return;
    }

    carrito.push(data);
    localStorage.setItem("carritoFinal", JSON.stringify(carrito));

    Swal.fire({
        icon: "success",
        title: "Agregada al carrito",
        text: `${data.tipoHabitacion || "Habitación"} fue añadida`,
        timer: 1500,
        showConfirmButton: false
    });

    actualizarContadorCarrito();
});

/* ============================================================
   CONTAR ITEMS DEL CARRITO
============================================================ */
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoFinal")) || [];
    const span = document.getElementById("carritoCount");
    if (span) span.textContent = carrito.length;
}
