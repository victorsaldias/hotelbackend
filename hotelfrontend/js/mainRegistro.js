document.addEventListener("DOMContentLoaded", () => {
    cargarRegiones();

    document.getElementById("regRegion").addEventListener("change", e => {
        cargarProvincias(e.target.value);
    });

    document.getElementById("regProvincia").addEventListener("change", e => {
        cargarComunas(e.target.value);
    });

    document.getElementById("formRegistro").addEventListener("submit", registrarCliente);
});

async function cargarRegiones() {
    try {
        const res = await fetch("http://localhost:3000/api/regiones");
        const regiones = await res.json();

        const region = document.getElementById("regRegion");
        region.innerHTML = `<option value="">Seleccionar región...</option>`;

        regiones.forEach(r => {
            region.innerHTML += `<option value="${r.idRegion}">${r.nombre}</option>`;
        });
    } catch (e) {
        alert("Error al cargar regiones.");
    }
}

async function cargarProvincias(idRegion) {
    if (!idRegion) return;

    try {
        const res = await fetch(`http://localhost:3000/api/provincias/${idRegion}`);
        const provincias = await res.json();

        const provincia = document.getElementById("regProvincia");
        provincia.disabled = false;
        provincia.innerHTML = `<option value="">Seleccionar provincia...</option>`;

        provincias.forEach(p => {
            provincia.innerHTML += `<option value="${p.idProvincia}">${p.nombre}</option>`;
        });

        const comuna = document.getElementById("regComuna");
        comuna.disabled = true;
        comuna.innerHTML = `<option value="">Seleccionar comuna...</option>`;
    } catch (e) {
        alert("Error al cargar provincias.");
    }
}

async function cargarComunas(idProvincia) {
    if (!idProvincia) return;

    try {
        const res = await fetch(`http://localhost:3000/api/comunas/${idProvincia}`);
        const comunas = await res.json();

        const comuna = document.getElementById("regComuna");
        comuna.disabled = false;
        comuna.innerHTML = `<option value="">Seleccionar comuna...</option>`;

        comunas.forEach(c => {
            comuna.innerHTML += `<option value="${c.idComuna}">${c.nombre}</option>`;
        });
    } catch (e) {
        alert("Error al cargar comunas.");
    }
}

async function registrarCliente(e) {
    e.preventDefault();

    const pass = document.getElementById("regPass").value;
    const pass2 = document.getElementById("regPass2").value;

    if (pass !== pass2) {
        alert("Las contraseñas no coinciden");
        return;
    }

    const data = {
        rut: document.getElementById("regRut").value,
        password: pass,
        nombre: document.getElementById("regNombre").value,
        apellido: document.getElementById("regApellido").value,
        telefono: document.getElementById("regTelefono").value,
        correo: document.getElementById("regCorreo").value,
        direccion: document.getElementById("regDireccion").value,
        idComuna: document.getElementById("regComuna").value
    };

     try {
        const res = await fetch("http://localhost:3000/api/clientes/web", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const resp = await res.json();

        if (!res.ok) {
            Swal.fire({
                icon: "error",
                title: "Error al registrar",
                text: resp.message || "No se pudo registrar el cliente."
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Cliente registrado",
            text: "El cliente fue registrado correctamente.",
            confirmButtonText: "Ir al login"
        }).then(() => {
            window.location.href = "login.html";
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor."
        });
    }
}
