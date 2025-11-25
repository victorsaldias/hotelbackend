document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loginForm").addEventListener("submit", loginCliente);

    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("fa-eye");
            btn.classList.toggle("fa-eye-slash");
            const input = document.querySelector(btn.getAttribute("toggle"));
            input.type = input.type === "password" ? "text" : "password";
        });
    });
});

function validarFormatoCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

async function loginCliente(e) {
    e.preventDefault();

    const correo = document.getElementById("emailField").value.trim();
    const password = document.getElementById("passwordField").value.trim();

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

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            credentials: "include",
            body: JSON.stringify({ correo, password })
        });

        const data = await res.json();

        if (!res.ok) {
            return Swal.fire({
                title: "Error al iniciar sesión",
                text: data.message ?? "Error desconocido.",
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
    showConfirmButton: false,    
    timer: 1200,                 
    timerProgressBar: true
});

setTimeout(() => {
    // TOKEN
    localStorage.setItem("token", response.token);

    // Guardar info del usuario
    localStorage.setItem("clienteNombre", response.nombre ?? "");
    localStorage.setItem("clienteApellido", response.apellido ?? "");
    localStorage.setItem("clienteId", response.idCliente ?? "");
    localStorage.setItem("userLogged", "true");

    // EVITA VOLVER ATRÁS
    window.location.replace("./index.html");
}, 1200);
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

        setTimeout(() => {
            window.location.href = "./index.html";
        }, 1500);

    } catch {
        Swal.fire({
            title: "Error interno",
            text: "No se pudo conectar al servidor.",
            icon: "error",
            confirmButtonColor: "#d8c04c"
        });
    }
}
