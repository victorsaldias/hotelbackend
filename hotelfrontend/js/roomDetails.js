document.addEventListener("DOMContentLoaded", async function () {

    const room = JSON.parse(localStorage.getItem("habitacionSeleccionada"));

    if (!room) {
        alert("No se pudo cargar la habitación seleccionada.");
        return;
    }

    // --- Maps ---
    const tipos = {
        1: "Premium King",
        2: "Habitación Deluxe",
        3: "Suite Ejecutiva",
        4: "Suite Familiar"
    };

    const imagenes = {
        1: ["../img/rooms/room-1.jpg"],
        2: ["../img/rooms/room-2.jpg"],
        3: ["../img/rooms/details/rd-1.jpg", "../img/rooms/details/rd-2.jpg"],
        4: ["../img/rooms/details/rd-3.jpg", "../img/rooms/details/rd-4.jpg"],
    };

    const imgs = imagenes[room.idTipoHabitacion] || ["../img/rooms/default.jpg"];

    // --- Información principal ---
    document.getElementById("room-title").textContent = tipos[room.idTipoHabitacion];
    document.getElementById("room-price").textContent = room.precio || 0;
    document.getElementById("room-desc").textContent =
        `Habitación número ${room.numero}, ideal para ${room.capacidad} personas.`;

    // --- Características ---
    document.getElementById("room-details-left").innerHTML = `
        <p><span class="icon_check"></span> Tamaño: ${room.tamano || "No especificado"} m2</p>
        <p><span class="icon_check"></span> Capacidad: ${room.capacidad} personas</p>
        <p><span class="icon_check"></span> Cama: ${room.cama || "No especificado"}</p>
    `;

    // --- Cargar servicios desde backend ---
    cargarServicios(room.idHabitacion);

    // --- Slider ---
    const slider = document.getElementById("slider");
    slider.innerHTML = "";

    imgs.forEach(img => {
        slider.innerHTML += `
            <div class="room__details__pic__slider__item set-bg" data-setbg="${img}"></div>
        `;
    });

    setTimeout(() => {
        $(".set-bg").each(function () {
            const bg = $(this).data("setbg");
            $(this).css("background-image", `url(${bg})`);
        });

        $("#slider").owlCarousel({
            loop: true,
            items: 1,
            nav: true,
            dots: true,
            smartSpeed: 800
        });
    }, 200);

    // --- Botón Reservar Ahora ---
    document.getElementById("btnReservar").addEventListener("click", () => {
        window.location.href = `../pages/reserva.html?room=${room.idHabitacion}`;
    });

});


// =============================
// FUNCIÓN PARA CARGAR SERVICIOS
// =============================
async function cargarServicios(idHabitacion) {
    try {
        const response = await fetch(`https://hotelbackend-5tdjgei3o.onrender.com/api/habitaciones/servicios/${idHabitacion}`);
        const servicios = await response.json();

        const contenedor = document.getElementById("room-details-right");
        contenedor.innerHTML = "";

        if (!Array.isArray(servicios) || servicios.length === 0) {
            contenedor.innerHTML = `
                <p><span class="icon_close"></span> No hay servicios disponibles.</p>
            `;
            return;
        }

        servicios.forEach(s => {
            contenedor.innerHTML += `
                <p><span class="icon_check"></span> ${s.nombre}</p>
            `;
        });

    } catch (error) {
        console.error("Error al cargar servicios:", error);
    }
}
