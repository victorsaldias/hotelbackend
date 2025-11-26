document.addEventListener("DOMContentLoaded", async function () {

    // 1. Obtener ID de la URL
    const roomId = new URLSearchParams(window.location.search).get("room");

    if (!roomId) {
        alert("ID de habitación no encontrada en la URL");
        return;
    }

    try {
        // 2. Obtener datos reales desde backend
        const response = await fetch(`http://localhost:3000/api/habitaciones/id/${roomId}`);
        const room = await response.json();

        if (!response.ok) {
            alert("No se pudo cargar la habitación");
            return;
        }

        // 3. Map de imágenes según tipo
        const imagenes = {
            1: ["../img/rooms/room-1.jpg", "../img/rooms/room-2.jpg"],
            2: ["../img/rooms/room-3.jpg", "../img/rooms/room-4.jpg"],
            3: ["../img/rooms/details/rd-1.jpg", "../img/rooms/details/rd-2.jpg"],
            4: ["../img/rooms/details/rd-3.jpg", "../img/rooms/details/rd-4.jpg"],
        };

        const tipos = {
            1: "Premium King",
            2: "Habitación Deluxe",
            3: "Suite Ejecutiva",
            4: "Suite Familiar"
        };

        const imgs = imagenes[room.idTipoHabitacion] || ["../img/rooms/default.jpg"];

        // 4. Coloca título y descripción base
        document.getElementById("room-title").textContent = tipos[room.idTipoHabitacion];
        document.getElementById("room-desc").textContent =
            `Habitación número ${room.numero}, ideal para ${room.capacidad} personas.`;
        document.getElementById("room-price").textContent = room.precio;

        // 5. Cargar imágenes dinámicamente
        imgs.forEach(img => {
            document.getElementById("slider").innerHTML +=
                `<div class="room__details__pic__slider__item set-bg" data-setbg="${img}"></div>`;
        });

        // 6. Características reales
        const left = [
            `Tamaño: ${room.tamano || "No especificado"}`,
            `Capacidad: ${room.capacidad} personas`,
            `Cama: ${room.cama || "No especificado"}`
        ];

        const right = [
            "WiFi",
            "TV HD",
            "Baño privado"
        ];

        left.forEach(i => {
            document.getElementById("room-details-left").innerHTML +=
                `<p><span class="icon_check"></span> ${i}</p>`;
        });

        right.forEach(i => {
            document.getElementById("room-details-right").innerHTML +=
                `<p><span class="icon_check"></span> ${i}</p>`;
        });

        // 7. Activar imágenes + slider
        setTimeout(() => {

            $('.set-bg').each(function () {
                var bg = $(this).data('setbg');
                $(this).css('background-image', 'url(' + bg + ')');
            });

            $("#slider").owlCarousel({
                loop: true,
                items: 1,
                nav: true,
                dots: false,
                smartSpeed: 800
            });

        }, 200);

    } catch (error) {
        console.error(error);
        alert("Error cargando habitación");
    }

});
