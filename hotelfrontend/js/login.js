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

        const $errorMessage = $("#errorMessage");
        $errorMessage.hide().text("");

        if (!correo || !password) {
            $errorMessage.text("El correo y la contraseña son obligatorios.").show();
            return;
        }

        if (!validarFormatoCorreo(correo)) {
            $errorMessage.text("Formato de correo inválido.").show();
            return;
        }

        $.ajax({
            url: "http://localhost:3000/api/clientes/login",
            type: "POST",
            contentType: "application/json",

            xhrFields: {
                withCredentials: true   
            },

            data: JSON.stringify({ correo, password }),

            success: function(response) {
                $errorMessage.text("Login exitoso. Redirigiendo...")
                    .css("color", "green").show();

                setTimeout(() => {
                   window.location.href = "./index.html";

                }, 1000);
            },

            error: function(xhr) {
                let msg = "Error desconocido.";
                if (xhr.responseJSON?.message) {
                    msg = xhr.responseJSON.message;
                }
                $errorMessage.text(msg).css("color", "red").show();
            }
        });
    });

    $(".toggle-password").click(function() {
        $(this).toggleClass("fa-eye fa-eye-slash");
        const input = $($(this).attr("toggle"));
        input.attr("type", input.attr("type") === "password" ? "text" : "password");
    });

})(jQuery);
