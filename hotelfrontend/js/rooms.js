
// 
document.addEventListener("DOMContentLoaded", function () {

    const rooms = JSON.parse(localStorage.getItem("habitacionesBusqueda"));
    const contenedor = document.getElementById("roomsContainer");

    if (!rooms || rooms.length === 0) {
        contenedor.innerHTML = `
            <div class="col-lg-12">
                <h3 style="color:red; text-align:center;">No hay habitaciones disponibles</h3>
            </div>
        `;
        return;
    }

    // Mapeo de tipos de habitación
    const tipos = {
        1: "Premium King",
        2: "Habitación Deluxe",
        3: "Suite Ejecutiva",
        4: "Suite Familiar"
    };

    rooms.forEach(h => {
        const tipo = tipos[h.idTipoHabitacion] ?? "Habitación";

        contenedor.innerHTML += `
            <div class="col-lg-6 mb-4">

                <div class="room__pic__slider owl-carousel">
                    <div class="room__pic__item set-bg" data-setbg="../img/rooms/default.jpg"></div>
                </div>

                <div class="room__text">
                    <h3>${tipo}</h3>
                    <h2><sup>$</sup>${h.precio}<span>/día</span></h2>

                    <ul>
    <li><span>Número:</span> ${h.numero}</li>
    <li><span>Capacidad:</span> ${h.capacidad} huéspedes</li>
    <li><span>Cama:</span> ${h.caracteristica}</li>
    <li><span>Precio:</span> $${h.precio}</li>
</ul>

                    <a href="room-details.html?room=${h.idHabitacion}">
                        Ver Detalles
                    </a>
                </div>
            </div>
        `;
    });

    // Recargar slider e imágenes dinámicas
    setTimeout(() => {
        $(".set-bg").each(function () {
            var bg = $(this).data("setbg");
            $(this).css("background-image", "url(" + bg + ")");
        });

        $(".owl-carousel").owlCarousel({
            loop: true,
            margin: 10,
            items: 1,
            dots: true,
            nav: true
        });
    }, 100);
});

