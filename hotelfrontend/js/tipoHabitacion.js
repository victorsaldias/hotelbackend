document.addEventListener("DOMContentLoaded", async () => {

    const tipo = JSON.parse(localStorage.getItem("tipoHabitacionSeleccionada"));
    if (!tipo) {
        alert("No se encontró información del tipo de habitación.");
        return;
    }

    // Cargar título y precio
    document.getElementById("tipo-title").textContent = tipo.nombre;
    document.getElementById("tipo-precio").textContent = tipo.precio;
    document.getElementById("tipo-desc").textContent = tipo.descripcion ?? "Sin descripción disponible.";

    // Cargar imágenes por tipo
    const slider = document.getElementById("slider");

    const imagenesPorTipo = {
        1: ["../img/rooms/room-1.jpg"],
        2: ["../img/rooms/room-2.jpg"],
        3: ["../img/rooms/details/rd-1.jpg", "../img/rooms/details/rd-2.jpg"],
        4: ["../img/rooms/details/rd-3.jpg", "../img/rooms/details/rd-4.jpg"]
    };

    const imagenes = imagenesPorTipo[tipo.idTipoHabitacion] || ["../img/rooms/default.jpg"];

    imagenes.forEach(img => {
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
    }, 300);

    // ===============================
    //   Cargar CARACTERÍSTICAS
    // ===============================
    try {
        const res = await fetch(`https://hotelbackend-5tdjgei3o.onrender.com/api/habitaciones/tipo/${tipo.idTipoHabitacion}/caracteristicas`);
        const caracteristicas = await res.json();

        const cont = document.getElementById("tipo-caracteristicas");
        cont.innerHTML = "";

        caracteristicas.forEach(c => {
            cont.innerHTML += `
                <p><span class="icon_check"></span> Tamaño: ${c.tamano} m2</p>
                <p><span class="icon_check"></span> Capacidad: ${c.capacidad} personas</p>
                <p><span class="icon_check"></span> Cama: ${c.cama}</p>
            `;
        });

    } catch (e) {
        console.error("Error características:", e);
    }

    // ===============================
    //   Cargar SERVICIOS
    // ===============================
    try {
        const res = await fetch(`https://hotelbackend-5tdjgei3o.onrender.com/api/habitaciones/tipo/${tipo.idTipoHabitacion}/servicios`);
        const servicios = await res.json();

        const cont = document.getElementById("tipo-servicios");
        cont.innerHTML = "";

        servicios.forEach(s => {
            cont.innerHTML += `
                <p><span class="icon_check"></span> ${s.nombre}</p>
            `;
        });

    } catch (e) {
        console.error("Error servicios:", e);
    }

});
