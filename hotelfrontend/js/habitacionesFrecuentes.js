let periodoMeses = 1;
let chartHabitacionesFrecuentes = null;

function cambiarPeriodo(meses) {
    periodoMeses = meses;
    cargarReporteHabitacionesFrecuentes();
}

async function cargarReporteHabitacionesFrecuentes() {
    try {
        const resp = await fetch(`http://localhost:3000/api/reportes/habitaciones-frecuentes?meses=${periodoMeses}`);
        const data = await resp.json();

        const tbody = document.getElementById("tablaHabitacionesFrecuentes");
        tbody.innerHTML = "";

        data.forEach(h => {
            tbody.innerHTML += `
                <tr>
                    <td>${h.idHabitacion}</td>
                    <td>${h.numero}</td>
                    <td>${h.tipoHabitacion}</td>
                    <td>${h.sucursal}</td>
                    <td>${h.totalReservas}</td>
                </tr>
            `;
        });

        const labels = data.map(x => `${x.numero} (${x.sucursal})`);
        const valores = data.map(x => x.totalReservas);

        const ctx = document.getElementById("chartHabitacionesFrecuentes").getContext("2d");

        if (chartHabitacionesFrecuentes) chartHabitacionesFrecuentes.destroy();

        chartHabitacionesFrecuentes = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Reservas",
                    data: valores,
                    backgroundColor: "rgba(54,162,235,0.6)"
                }]
            }
        });

    } catch (error) {
        console.error("Error cargando habitaciones frecuentes:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarReporteHabitacionesFrecuentes);
