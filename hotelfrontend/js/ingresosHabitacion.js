let periodoMeses = 1;
let chartIngresosHabitacion = null;

function cambiarPeriodo(meses) {
    periodoMeses = meses;
    cargarReporteIngresosHabitacion();
}

async function cargarReporteIngresosHabitacion() {
    try {
        const resp = await fetch(`https://hotelbackend-5tdjgei3o.onrender.com/api/reportes/ingresos-habitacion?meses=${periodoMeses}`);
        const data = await resp.json();

        const tbody = document.getElementById("tablaIngresosHabitacion");
        tbody.innerHTML = "";

        data.forEach(i => {
            tbody.innerHTML += `
                <tr>
                    <td>${i.idHabitacion}</td>
                    <td>${i.numero}</td>
                    <td>${i.tipoHabitacion}</td>
                    <td>${i.sucursal}</td>
                    <td>$${Number(i.ingresos).toLocaleString("es-CL")}</td>
                </tr>
            `;
        });

        const labels = data.map(x => `${x.numero} (${x.sucursal})`);
        const valores = data.map(x => x.ingresos);

        const ctx = document.getElementById("chartIngresosHabitacion").getContext("2d");

        if (chartIngresosHabitacion) chartIngresosHabitacion.destroy();

        chartIngresosHabitacion = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Ingresos ($)",
                    data: valores,
                    backgroundColor: "rgba(75,192,192,0.6)"
                }]
            }
        });

    } catch (error) {
        console.error("Error cargando ingresos:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarReporteIngresosHabitacion);
document.addEventListener("DOMContentLoaded", () => {
    const btnToggle = document.getElementById("btnToggleVista");
    const chartContainer = document.querySelector(".chart-container");
    const table = document.querySelector("table");

    // Por defecto mostramos gráfico
    table.style.display = "none";

    btnToggle.addEventListener("click", () => {
        const mostrandoGrafico = chartContainer.style.display !== "none";

        if (mostrandoGrafico) {
            // Ocultar gráfico / mostrar tabla
            chartContainer.style.display = "none";
            table.style.display = "table";
            btnToggle.textContent = "Mostrar Gráfico";
        } else {
            // Mostrar gráfico / ocultar tabla
            chartContainer.style.display = "block";
            table.style.display = "none";
            btnToggle.textContent = "Mostrar Tabla";
        }
    });
});