let listaGlobalClientes = []; 

document.addEventListener("DOMContentLoaded", () => {
    cargarClientes();

    document.getElementById("btnGuardarCliente")
        .addEventListener("click", registrarCliente);

    document.getElementById("buscarCliente")
        .addEventListener("input", filtrarClientes);
});


async function cargarClientes() {
    try {
        const res = await fetch("http://localhost:3000/api/clientes");
        const clientes = await res.json();

        listaGlobalClientes = clientes; 
        renderTablaClientes(clientes);

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error al cargar",
            text: "No se pudieron cargar los clientes.",
            timer: 1800,
            showConfirmButton: false
        });
    }
}


function renderTablaClientes(clientes) {
    const tbody = document.getElementById("listaClientes");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.rut}</td>
            <td>${c.correo}</td>
            <td>${c.telefono ?? "-"}</td>
        `;

        tbody.appendChild(tr);
    });
}


function filtrarClientes() {
    const texto = document.getElementById("buscarCliente").value.toLowerCase().trim();

    const filtrados = listaGlobalClientes.filter(c => 
        c.nombre.toLowerCase().includes(texto) ||
        c.apellido.toLowerCase().includes(texto) ||
        c.rut.toLowerCase().includes(texto) ||
        c.correo.toLowerCase().includes(texto) ||
        (c.telefono + "").includes(texto)
    );

    renderTablaClientes(filtrados);
}


async function registrarCliente() {

    const data = {
        nombre: document.getElementById("cliNombre").value.trim(),
        apellido: document.getElementById("cliApellido").value.trim(),
        rut: document.getElementById("cliRut").value.trim(),
        correo: document.getElementById("cliCorreo").value.trim(),
        telefono: document.getElementById("cliTelefono").value.trim()
    };

    if (!data.nombre || !data.apellido || !data.rut || !data.correo || !data.telefono) {
        return Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Debes llenar todos los campos.",
            timer: 1500,
            showConfirmButton: false
        });
    }

    try {
        const res = await fetch("http://localhost:3000/api/clientes/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const r = await res.json();

        if (res.ok) {

            Swal.fire({
                icon: "success",
                title: "Cliente Registrado",
                html: `Contraseña generada:<br><b>${r.passwordGenerada}</b>`,
                timer: 3000,
                showConfirmButton: true,
                confirmButtonColor: "#d8c04c"
            });

            cerrarModalCliente();
            cargarClientes();

       } else {
    Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: r.mensaje || r.error || r.message || "Ocurrió un error inesperado.",
        timer: 1500,
        showConfirmButton: false
    });
}


    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error interno",
            text: "No se pudo registrar el cliente.",
            timer: 1800,
            showConfirmButton: false
        });
    }
}



function cerrarModalCliente() {
    document.getElementById("modalCliente").style.display = "none";

    document.getElementById("cliNombre").value = "";
    document.getElementById("cliApellido").value = "";
    document.getElementById("cliRut").value = "";
    document.getElementById("cliCorreo").value = "";
    document.getElementById("cliTelefono").value = "";
}

function abrirModalCliente() {
    document.getElementById("modalCliente").style.display = "flex";
}
