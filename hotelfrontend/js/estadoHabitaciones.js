let chartEstadoHabitaciones = null;

async function cargarReporteEstadoHabitaciones() {
    try {
        const resp = await fetch(`http://localhost:3000/api/reportes/estado-habitaciones`);
        const data = await resp.json();

        const tbody = document.getElementById("tablaEstadoHabitaciones");
        tbody.innerHTML = "";

        data.forEach(e => {
            tbody.innerHTML += `
                <tr>
                    <td>${e.estadoLimpieza}</td>
                    <td>${e.totalHabitaciones}</td>
                </tr>
            `;
        });

        const labels = data.map(x => x.estadoLimpieza);
        const valores = data.map(x => x.totalHabitaciones);

        const ctx = document.getElementById("chartEstadoHabitaciones").getContext("2d");

        if (chartEstadoHabitaciones) chartEstadoHabitaciones.destroy();

        chartEstadoHabitaciones = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    data: valores,
                    backgroundColor: [
                        "rgba(54,162,235,0.6)",
                        "rgba(255,99,132,0.6)",
                        "rgba(255,206,86,0.6)"
                    ]
                }]
            }
        });

    } catch (error) {
        console.error("Error cargando estado habitaciones:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarReporteEstadoHabitaciones);
