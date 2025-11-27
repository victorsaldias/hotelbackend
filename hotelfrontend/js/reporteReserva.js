const API = "http://localhost:3000/api/reservas";

async function cargarReservas() {
    try {
        const res = await fetch(API);
        const data = await res.json();

        const tabla = document.getElementById("tablaReservas");

        if (!Array.isArray(data) || data.length === 0) {
            tabla.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay reservas registradas</td></tr>`;
            return;
        }

        tabla.innerHTML = data.map(r => `
            <tr>
                <td>${r.idReserva}</td>
                <td>${r.nombreCliente || "N/A"}</td>
                <td>${r.numeroHabitacion || "?"}</td>
                <td>${r.fechaInicio.slice(0,10)}</td>
                <td>${r.fechaFin.slice(0,10)}</td>
                <td>${r.estado}</td>
            </tr>
        `).join("");

    } catch (error) {
        Swal.fire("Error", "No se pudo cargar el reporte de reservas", "error");
    }
}

document.addEventListener("DOMContentLoaded", cargarReservas);
