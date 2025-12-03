let periodoMeses = 1;

function cambiarPeriodo(meses) {
    periodoMeses = meses;
    cargarReporteEstadiaPromedio();
}

async function cargarReporteEstadiaPromedio() {
    try {
        const resp = await fetch(`http://localhost:3000/api/reportes/estadia-promedio?meses=${periodoMeses}`);
        const data = await resp.json();

        document.getElementById("lblEstadiaPromedio").textContent =
            data.estadiaPromedioDias ? data.estadiaPromedioDias.toFixed(2) : "0";

        document.getElementById("lblTotalReservasEstadia").textContent =
            data.totalReservas || "0";

    } catch (error) {
        console.error("Error cargando estadía promedio:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarReporteEstadiaPromedio);
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
