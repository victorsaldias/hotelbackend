// public/js/login.js

document.addEventListener("DOMContentLoaded", () => {
    // Login por CORREO (empleado / panel, o lo que estés usando)
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", loginPorCorreo);
    }

    // Login por RUT (cliente web)
    const loginClienteForm = document.getElementById("loginClienteForm");
    if (loginClienteForm) {
        loginClienteForm.addEventListener("submit", loginCliente);
    }

    // Toggle de mostrar/ocultar password
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("fa-eye");
            btn.classList.toggle("fa-eye-slash");
            const input = document.querySelector(btn.getAttribute("toggle"));
            if (!input) return;
            input.type = input.type === "password" ? "text" : "password";
        });
    });
});

// ===============================
//   VALIDACIÓN CORREO
// ===============================
function validarFormatoCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

// ===============================
//   LOGIN POR CORREO (ORIGINAL)
// ===============================
async function loginPorCorreo(e) {
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
        const res = await fetch("https://hotelbackend-hzc4.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ correo, password })
        });

        const response = await res.json();

        if (!res.ok) {
            return Swal.fire({
                title: "Error al iniciar sesión",
                text: response.message ?? "Error desconocido.",
                icon: "error",
                confirmButtonColor: "#d8c04c"
            });
        }

        // Aquí mantengo la misma lógica que tenías en el $.ajax success:
        Swal.fire({
            title: "¡Bienvenido!",
            text: "Inicio de sesión exitoso.",
            icon: "success",
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true
        });

        setTimeout(() => {
            console.log("LOGIN CLIENTE → REDIRECT EJECUTADO");
            // TOKEN
            localStorage.setItem("token", response.token);

            // Guardar info del usuario (como lo tenías antes)
            localStorage.setItem("clienteNombre", response.nombre ?? "");
            localStorage.setItem("clienteApellido", response.apellido ?? "");
            localStorage.setItem("clienteId", response.idCliente ?? "");
            localStorage.setItem("userLogged", "true");

            // Evitar volver atrás
            window.location.replace("/hotelfrontend/index.html");
        }, 1200);

    } catch (err) {
        console.error("Error login correo:", err);
        Swal.fire({
            title: "Error interno",
            text: "No se pudo conectar al servidor.",
            icon: "error",
            confirmButtonColor: "#d8c04c"
        });
    }
}

// ===============================
//   LOGIN CLIENTE POR RUT
//   (Para Mi Perfil, Mis Reservas, etc.)
// ===============================
async function loginCliente(e) {
    e.preventDefault();

    const rut = document.getElementById("rutLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    if (!rut || !password) {
        return Swal.fire("Campos vacíos", "Debe ingresar RUT y contraseña", "warning");
    }

    try {
        const resp = await fetch("https://hotelbackend-hzc4.onrender.com/api/auth/login-cliente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rut, password })
        });

        if (!resp.ok) {
            const error = await resp.json().catch(() => ({}));
            return Swal.fire("Error", error.message || "Credenciales incorrectas", "error");
        }

        const data = await resp.json();
        const c = data.cliente;

        // ==============================
        //    GUARDAR SESIÓN COMPLETA
        // ==============================
        const sesion = {
            idCliente: c.idCliente,
            rut: c.rut,
            nombre: c.nombre,
            apellido: c.apellido,
            correo: c.correo,
            telefono: c.telefono,
            direccion: c.direccion,
            idComuna: c.idComuna,
            fechaRegistro: c.fechaRegistro
        };

        localStorage.setItem("usuarioCliente", JSON.stringify(sesion));
        localStorage.setItem("token", data.token);

        // Compatibilidad con otras partes del frontend
        localStorage.setItem("clienteId", c.idCliente);
        localStorage.setItem("clienteNombre", c.nombre);
        localStorage.setItem("clienteApellido", c.apellido);
        localStorage.setItem("userLogged", "true");

        Swal.fire({
            icon: "success",
            title: "Bienvenido",
            text: `Hola ${c.nombre}`,
            timer: 1500,
            showConfirmButton: false
        });

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (err) {
        console.error("Error login cliente:", err);
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
}
