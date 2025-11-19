document.addEventListener("DOMContentLoaded", () => {
    cargarRegiones();

    document.getElementById("regRegion").addEventListener("change", function () {
        cargarProvincias(this.value);
    });

    document.getElementById("regProvincia").addEventListener("change", function () {
        cargarComunas(this.value);
    });

    document.getElementById("formRegistro").addEventListener("submit", registrarCliente);
});


async function cargarRegiones() {
    const res = await fetch("http://localhost:3000/api/regiones");
    const regiones = await res.json();

    const region = document.getElementById("regRegion");
    region.innerHTML = `<option value="">Seleccionar región...</option>`;

    regiones.forEach(r => {
        region.innerHTML += `<option value="${r.idRegion}">${r.nombreRegion}</option>`;
    });
}


async function cargarProvincias(idRegion) {
    if (!idRegion) return;

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
}


async function cargarComunas(idProvincia) {
    if (!idProvincia) return;

    const res = await fetch(`http://localhost:3000/api/comunas/${idProvincia}`);
    const comunas = await res.json();

    const comuna = document.getElementById("regComuna");
    comuna.disabled = false;
    comuna.innerHTML = `<option value="">Seleccionar comuna...</option>`;

    comunas.forEach(c => {
        comuna.innerHTML += `<option value="${c.idComuna}">${c.nombre}</option>`;
    });
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

    const res = await fetch("http://localhost:3000/api/clientes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const resp = await res.json();
    alert(resp.message);

    if (res.ok) window.location.href = "login.html";
}
