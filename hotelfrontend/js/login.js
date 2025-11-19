(function($) {
    "use strict";

    function validarFormatoCorreo(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    $("#loginForm").on("submit", function(event) {
        event.preventDefault();

        const correo = $("#emailField").val().trim();
        const password = $("#passwordField").val().trim();

        if (!correo || !password) {
            return Swal.fire({
                title: "Campos requeridos",
                text: "El correo y la contraseña son obligatorios.",
                icon: "warning",
                confirmButtonColor: "#d8c04c"
            });
        }

        if (!validarFormatoCorreo(correo)) {
            return Swal.fire({
                title: "Correo inválido",
                text: "Ingresa un correo válido.",
                icon: "error",
                confirmButtonColor: "#d8c04c"
            });
        }

        $.ajax({
            url: "http://localhost:3000/api/auth/login",
            type: "POST",
            contentType: "application/json",
            xhrFields: { withCredentials: true },
            data: JSON.stringify({ correo, password }),

            success: function(response) {
                Swal.fire({
                    title: "¡Bienvenido!",
                    text: "Inicio de sesión exitoso.",
                    icon: "success",
                    confirmButtonColor: "#d8c04c"
                }).then(() => {

                    // Guardar info del usuario
                    localStorage.setItem("clienteNombre", response.nombre ?? "");
                    localStorage.setItem("clienteApellido", response.apellido ?? "");
                    localStorage.setItem("clienteId", response.idCliente ?? "");
                    localStorage.setItem("userLogged", "true");

                    window.location.href = "./index.html";
                });
            },

            error: function(xhr) {
                let msg = "Error desconocido.";
                if (xhr.responseJSON?.message) {
                    msg = xhr.responseJSON.message;
                }

                Swal.fire({
                    title: "Error al iniciar sesión",
                    text: msg,
                    icon: "error",
                    confirmButtonColor: "#d8c04c"
                });
            }
        });
    });

    $(".toggle-password").click(function() {
        $(this).toggleClass("fa-eye fa-eye-slash");
        const input = $($(this).attr("toggle"));
        input.attr("type", input.attr("type") === "password" ? "text" : "password");
    });

})(jQuery);
