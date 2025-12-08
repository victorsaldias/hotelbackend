let periodoMeses = 1;
let chartOcupacion = null;

function cambiarPeriodo(meses) {
    periodoMeses = meses;
    cargarReporteOcupacion();
}

async function cargarReporteOcupacion() {
    try {
        const resp = await fetch(`https://hotelbackend-5tdjgei3o.onrender.com/api/reportes/ocupacion?meses=${periodoMeses}`);
        const data = await resp.json();

        const tbody = document.getElementById("tablaOcupacion");
        tbody.innerHTML = "";

        data.forEach(o => {
            tbody.innerHTML += `
                <tr>
                    <td>${o.sucursal}</td>
                    <td>${o.diasOcupados}</td>
                    <td>${o.diasDisponibles}</td>
                    <td>${o.porcentajeOcupacion.toFixed(2)}%</td>
                </tr>
            `;
        });

        const labels = data.map(x => x.sucursal);
        const valores = data.map(x => x.porcentajeOcupacion);

        const ctx = document.getElementById("chartOcupacion").getContext("2d");

        if (chartOcupacion) chartOcupacion.destroy();

        chartOcupacion = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "% Ocupación",
                    data: valores,
                    backgroundColor: "rgba(255,159,64,0.6)"
                }]
            }
        });

    } catch (error) {
        console.error("Error cargando ocupación:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarReporteOcupacion);
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
