
        const rooms = {
            1: {
                title: "Habitación Premium King",
                desc: "Habitación amplia con cama King y estilo moderno.",
                images: ["../img/rooms/room-1.jpg", "../img/rooms/room-2.jpg"],
                left: ["Tamaño: 30 m²", "Capacidad: 3 personas", "Cama: King"],
                right: ["WiFi", "TV HD", "Baño privado"]
            },
            2: {
                title: "Habitación Deluxe",
                desc: "Confort y elegancia en espacio acogedor.",
                images: ["../img/rooms/room-3.jpg", "../img/rooms/room-4.jpg"],
                left: ["Tamaño: 28 m²", "Capacidad: 2 personas", "Cama: Queen"],
                right: ["WiFi", "TV", "Baño privado"]
            },
            3: {
                title: "Suite Ejecutiva",
                desc: "Espacio ideal para viajes de negocios.",
                images: ["../img/rooms/details/rd-1.jpg", "../img/rooms/details/rd-2.jpg"],
                left: ["Tamaño: 40 m²", "Capacidad: 4 personas", "Cama: King + Sofá cama"],
                right: ["Minibar", "TV Smart", "WiFi"]
            },
            4: {
                title: "Suite Familiar",
                desc: "Perfecta para grupos y familias.",
                images: ["../img/rooms/details/rd-3.jpg", "../img/rooms/details/rd-4.jpg"],
                left: ["Tamaño: 50 m²", "Capacidad: 5 personas", "Cama: 2 Queen"],
                right: ["Cocina pequeña", "WiFi", "TV"]
            }
        };

        const roomId = new URLSearchParams(window.location.search).get("room") || 1;
        const room = rooms[roomId];

        document.getElementById("room-title").textContent = room.title;
        document.getElementById("room-desc").textContent = room.desc;

      
        room.images.forEach(img => {
            document.getElementById("slider").innerHTML +=
                `<div class="room__details__pic__slider__item set-bg" data-setbg="${img}"></div>`;
        });

        
        room.left.forEach(i => {
            document.getElementById("room-details-left").innerHTML +=
                `<p><span class="icon_check"></span> ${i}</p>`;
        });

       
        room.right.forEach(i => {
            document.getElementById("room-details-right").innerHTML +=
                `<p><span class="icon_check"></span> ${i}</p>`;
        });

        
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