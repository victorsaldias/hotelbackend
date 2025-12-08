document.addEventListener("DOMContentLoaded", () => {
    cargarMisReservas();
});

async function cargarMisReservas() {

    const usuario = JSON.parse(localStorage.getItem("usuarioCliente"));

    if (!usuario || !usuario.idCliente) {
        window.location.href = "login.html";
        return;
    }

    const idCliente = usuario.idCliente;

    try {
        const resp = await fetch(`http://localhost:3000/api/reservas/cliente/${idCliente}`);

        if (!resp.ok) throw new Error("No se pudieron cargar las reservas");

        const reservas = await resp.json();
        renderizarReservas(reservas);

    } catch (error) {
        console.error("Error:", error);
    }
}

function estadoBadge(estado) {
    switch (estado) {
        case "Pendiente": return `<span class="badge badge-warning">Pendiente</span>`;
        case "Confirmada": return `<span class="badge badge-success">Confirmada</span>`;
        case "Cancelada": return `<span class="badge badge-danger">Cancelada</span>`;
        default: return estado;
    }
}

function renderizarReservas(lista) {
    const tbody = document.getElementById("tablaMisReservas");
    tbody.innerHTML = "";

    if (!lista.length) {
        tbody.innerHTML = `
            <tr><td colspan="8">No tienes reservas registradas.</td></tr>
        `;
        return;
    }

    lista.forEach(r => {

        const entrada = new Date(r.fechaInicio).toLocaleDateString("es-CL");
        const salida  = new Date(r.fechaFin).toLocaleDateString("es-CL");

        tbody.innerHTML += `
            <tr>
                <td>${r.idReserva}</td>
                <td>${entrada}</td>
                <td>${salida}</td>
                <td>${r.numeroHabitacion || "—"}</td>
                <td>${r.tipoHabitacion || "—"}</td>
                <td>${estadoBadge(r.estadoReserva)}</td>
                <td>$${r.total}</td>
                
                <td>
                    ${r.estadoReserva === "Cancelada"
                        ? `<span class="text-muted">—</span>`
                        : `<button class="btn btn-sm btn-danger" onclick="cancelarReserva(${r.idReserva})">Cancelar</button>`
                    }
                </td>
            </tr>
        `;
    });
}

async function cancelarReserva(idReserva) {
    const confirmacion = confirm("¿Seguro que deseas cancelar esta reserva?");
    if (!confirmacion) return;

    await fetch(`http://localhost:3000/api/reservas/cancelar/${idReserva}`, {
        method: "POST"
    });

    cargarMisReservas();
}

// Logout
function logout() {
    localStorage.removeItem("usuarioCliente");
    window.location.href = "../pages/login.html";
}
