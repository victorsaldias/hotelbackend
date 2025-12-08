/* ---------------------------------------------------
   Template Name: Hiroto
   Description:  Hiroto Hotel HTML Template
   Author: Colorlib
----------------------------------------------------- */

'use strict';

(function ($) {

/* --------------------------
      Función para convertir fecha
-------------------------- */
function convertirFecha(texto) {
    if (!texto) return null;

    const partes = texto.split(" ");
    const dia = parseInt(partes[0], 10);
    const mesTexto = partes[1];
    const año = parseInt(partes[2], 10);

    const meses = {
        Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
        Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11,
    };

    return new Date(año, meses[mesTexto], dia);
}

/* --------------------------
      Preloader
-------------------------- */
$(window).on('load', function () {
    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");
});


/* --------------------------
      Background set
-------------------------- */
$('.set-bg').each(function () {
    var bg = $(this).data('setbg');
    $(this).css('background-image', 'url(' + bg + ')');
});


/* --------------------------
      Canvas Menu
-------------------------- */
$(".canvas__open").on('click', function () {
    $(".offcanvas-menu-wrapper").addClass("active");
    $(".offcanvas-menu-overlay").addClass("active");
});

$(".offcanvas-menu-overlay").on('click', function () {
    $(".offcanvas-menu-wrapper").removeClass("active");
    $(".offcanvas-menu-overlay").removeClass("active");
});


/* --------------------------
      Navigation
-------------------------- */
$(".menu__class").slicknav({
    appendTo: '#mobile-menu-wrap',
    allowParentLinks: true
});


/* --------------------------
      Gallery Slider
-------------------------- */
$(".gallery__slider").owlCarousel({
    loop: true,
    margin: 10,
    items: 4,
    dots: false,
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
    responsive: {
        992: { items: 4 },
        768: { items: 3 },
        576: { items: 2 },
        0: { items: 1 }
    }
});


/* --------------------------
      Room pic slider
-------------------------- */
$(".room__pic__slider").owlCarousel({
    loop: true,
    margin: 0,
    items: 1,
    dots: false,
    nav: true,
    navText: ["<i class='arrow_carrot-left'></i>", "<i class='arrow_carrot-right'></i>"],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: false
});


/* --------------------------
      Room Details pic slider
-------------------------- */
$(".room__details__pic__slider").owlCarousel({
    loop: true,
    margin: 10,
    items: 2,
    dots: false,
    nav: true,
    navText: ["<i class='arrow_carrot-left'></i>", "<i class='arrow_carrot-right'></i>"],
    autoHeight: false,
    autoplay: false,
    mouseDrag: false,
    responsive: {
        576: { items: 2 },
        0: { items: 1 }
    }
});


/* --------------------------
      Testimonial Slider
-------------------------- */
var testimonialSlider = $(".testimonial__slider");
testimonialSlider.owlCarousel({
    loop: true,
    margin: 30,
    items: 1,
    dots: true,
    nav: true,
    navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: true,
    mouseDrag: false,
    onInitialized: function (e) {
        var a = this.items().length;
        $("#snh-1").html("<span>01</span><span>" + "0" + a + "</span>");
        var percent = Math.round((100 / a));
        $('.slider__progress span').css("width", percent + "%");
    }
}).on("changed.owl.carousel", function (e) {
    var b = --e.item.index, a = e.item.count;
    $("#snh-1").html("<span>0" + (1 > b ? b + a : b > a ? b - a : b) + "</span><span>0" + a + "</span>");
    var current = e.page.index + 1;
    var percent = Math.round((100 / e.page.count) * current);
    $('.slider__progress span').css("width", percent + "%");
});


/* --------------------------
      Logo Slider
-------------------------- */
$(".logo__carousel").owlCarousel({
    loop: true,
    margin: 100,
    items: 5,
    dots: false,
    smartSpeed: 1200,
    autoHeight: false,
    autoplay: false,
    responsive: {
        992: { items: 5 },
        768: { items: 3 },
        320: { items: 2 },
        0: { items: 1 }
    }
});


/* --------------------------
      Select
-------------------------- */
$("select").not("#sucursalSelect").niceSelect();


/* --------------------------
      Regionalización DatePicker
-------------------------- */
$.datepicker.regional['es'] = {
    closeText: 'Cerrar',
    prevText: '< Ant',
    nextText: 'Sig >',
    currentText: 'Hoy',
    monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
    weekHeader: 'Sm',
    dateFormat: 'dd M yy',
    firstDay: 1
};
$.datepicker.setDefaults($.datepicker.regional['es']);


/* --------------------------
      Datepicker Inputs
-------------------------- */
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

var mS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

$(".check__in").val(`${dd} ${mS[mm - 1]} ${yyyy}`);
$(".check__out").val(`${dd} ${mS[mm - 1]} ${yyyy}`);

$(".datepicker_pop").datepicker({ minDate: 0 });

$(".datepicker_pop").on("keydown paste", e => e.preventDefault());
$(".datepicker_pop").on("focus", function(){ $(this).blur(); });

$(".arrow_carrot-down").on("click", function () {
    $(this).siblings(".datepicker_pop").datepicker("show");
});


/* --------------------------
      Cargar Sucursales
-------------------------- */
async function cargarSucursales() {
    const select = document.getElementById("sucursalSelect");
    if (!select) return;

    try {
        const response = await fetch("https://hotelbackend-5tdjgei3o.onrender.com/api/sucursales");
        const data = await response.json();

        select.innerHTML = `<option value="">Seleccione una sucursal</option>`;
        data.forEach(s => {
            select.innerHTML += `<option value="${s.idSucursal}">${s.nombre} - ${s.direccion}</option>`;
        });

    } catch (error) {
        Swal.fire("Error", "No se pudieron cargar las sucursales", "error");
        select.innerHTML = `<option value="">Error al cargar</option>`;
    }
}
document.addEventListener("DOMContentLoaded", cargarSucursales);


/* --------------------------
      Actualizar nice-select
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => $("select").niceSelect("update"), 200);
});


/* --------------------------
      FORMULARIO DE BÚSQUEDA
-------------------------- */
const filterForm = document.querySelector(".filter__form");

function formatearFechaConHora(date, hora) {
    const pad = n => n.toString().padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    return `${y}-${m}-${d} ${hora}`;
}

if (filterForm) {
    
    filterForm.addEventListener("submit", async function (e) {
        
        e.preventDefault();
        
        const idSucursal = document.getElementById("sucursalSelect").value;
        const fechaInicioTexto = document.querySelector(".check__in").value;
        const fechaFinTexto = document.querySelector(".check__out").value;
        const cantidadHuespedes = document.getElementById("huespedesSelect").value;

        if (!idSucursal) return Swal.fire("Seleccione una sucursal");
        if (!fechaInicioTexto || !fechaFinTexto) return Swal.fire("Debe seleccionar ambas fechas");

        const fechaInicioDate = convertirFecha(fechaInicioTexto);
        const fechaFinDate = convertirFecha(fechaFinTexto);

        if (fechaFinDate <= fechaInicioDate) {
            return Swal.fire("La fecha de salida debe ser mayor a la de entrada");
        }

        // === GUARDAR PARA LA RESERVA ===
        localStorage.setItem("fechaInicioReserva", fechaInicioTexto);
        localStorage.setItem("fechaFinReserva", fechaFinTexto);
        localStorage.setItem("cantidadHuespedesReserva", cantidadHuespedes);

        // === FORMATO CORRECTO PARA BACKEND ===
        const fechaInicio = formatearFechaConHora(fechaInicioDate, "14:00:00");
        const fechaFin = formatearFechaConHora(fechaFinDate, "12:00:00");

        console.log("FECHAS QUE SE ENVIAN →", {
            fechaInicio,
            fechaFin,
            tipoInicio: typeof fechaInicio,
            tipoFin: typeof fechaFin
        });

        try {
            const response = await fetch("https://hotelbackend-5tdjgei3o.onrender.com/api/habitaciones/buscar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idSucursal,
                    fechaInicio,
                    fechaFin,
                    cantidadHuespedes
                })
            });

            if (!response.ok) return Swal.fire("Error al buscar");

            const data = await response.json();
            localStorage.setItem("habitacionesBusqueda", JSON.stringify(data.habitaciones));
            window.location.href = "./pages/rooms.html";

        } catch (err) {
            Swal.fire("Error de conexión");
        }
    });
}


/* --------------------------
      HOME: mostrar tipos de habitación
-------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("habitacionesHome");
    if (!container) return;

    try {
        const res = await fetch("https://hotelbackend-5tdjgei3o.onrender.com/api/habitaciones/tipos-habitacion");
        const tipos = await res.json();

        container.innerHTML = ""; // limpiar

        const imagenes = {
            1: "../img/home-room/hr-1.jpg",
            2: "../img/home-room/hr-2.jpg",
            3: "../img/home-room/hr-3.jpg",
            4: "../img/home-room/hr-4.jpg",
        };

        tipos.forEach(tipo => {
            const imagen = imagenes[tipo.idTipoHabitacion] || "../img/home-room/hr-1.jpg";
            container.innerHTML += `
                <div class="col-lg-3 col-md-6 col-sm-6 p-0">
                    <div class="home__room__item set-bg" data-setbg="${imagen}">
                        <div class="home__room__title">
                            <h4>${tipo.nombre}</h4>
                            <h2><sup>$</sup>${tipo.precio}<span>/día</span></h2>
                        </div>

                        <div class="home__room__footer-right">
                            <button class="btn btn-warning ver-detalles-btn"
                                    data-info='${JSON.stringify(tipo)}'>
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Aplicar background dinámico a los nuevos elementos
        document.querySelectorAll(".set-bg").forEach(el => {
            const bg = el.getAttribute("data-setbg");
            el.style.backgroundImage = `url(${bg})`;
        });

        // Eventos para ver detalles
        document.querySelectorAll(".ver-detalles-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const tipo = JSON.parse(btn.dataset.info);
                localStorage.setItem("tipoHabitacionSeleccionada", JSON.stringify(tipo));
                window.location.href = "tipo-habitacion.html";
            });
        });

    } catch (err) {
        console.error("Error cargando tipos:", err);
        container.innerHTML = "<p>Error al cargar las habitaciones.</p>";
    }
});


/* --------------------------
      Mostrar link "Mis Reservas" si corresponde
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const clienteId = localStorage.getItem("clienteId");
    const link = document.getElementById("misReservasLink");

    if (clienteId && link) {
        link.style.display = "block";
    }
});


/* --------------------------
      Avatar de usuario (dropdown)
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    const userMenuLi  = document.querySelector(".user-menu");
    const userAvatar  = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const btnLogout   = document.getElementById("btnLogout");

    // Si no existen en este HTML, no hacemos nada
    if (!userMenuLi || !userAvatar || !userDropdown || !btnLogout) return;

    // Aseguramos que parta oculto
    userDropdown.classList.add("hidden");

    // Abrir / cerrar dropdown al click en el avatar
    userAvatar.addEventListener("click", (e) => {
        e.stopPropagation(); // para que no se cierre inmediatamente
        userDropdown.classList.toggle("hidden");
    });

    // Cerrar si se hace click fuera
    document.addEventListener("click", (e) => {
        if (!userMenuLi.contains(e.target)) {
            userDropdown.classList.add("hidden");
        }
    });

    // Cerrar sesión desde el dropdown
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();

        // Si ya tienes esta función global, la reutilizamos
        if (typeof logoutCliente === "function") {
            logoutCliente();
        } else {
            // fallback por si acaso
            localStorage.removeItem("usuarioCliente");
            localStorage.clear(); 
    sessionStorage.clear(); 
            window.location.reload();
        }
    });
});


})(jQuery);
