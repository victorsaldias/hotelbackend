document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnGuardarCliente")
        .addEventListener("click", registrarCliente);
});

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
        const res = await fetch("http://localhost:3000/api/clientes/recepcion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const r = await res.json();

        if (res.ok) {

           if (res.ok) {

    Swal.fire({
        icon: "success",
        title: "Cliente Registrado",
        text: "Se envió un correo con la contraseña provisional.",
        timer: 3000,
        showConfirmButton: true,
        confirmButtonColor: "#d8c04c"
    });

    limpiarFormulario();
}


            limpiarFormulario();

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

function limpiarFormulario() {
    document.getElementById("cliNombre").value = "";
    document.getElementById("cliApellido").value = "";
    document.getElementById("cliRut").value = "";
    document.getElementById("cliCorreo").value = "";
    document.getElementById("cliTelefono").value = "";
}
