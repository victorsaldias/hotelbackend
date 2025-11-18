$(document).ready(function () {
    $('#regComuna').select2();
});

async function cargarComunas() {
    const res = await fetch("http://localhost:3000/api/comunas");
    const comunas = await res.json();
    const select = document.getElementById("regComuna");
    comunas.forEach(c => {
        select.innerHTML += `<option value="${c.idComuna}">${c.nombre}</option>`;
    });
}

cargarComunas();

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
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

    const res = await fetch("http://localhost:3000/api/clientes/registro", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const resp = await res.json();
    alert(resp.message);

    if (res.ok) window.location.href = "login.html";
});
