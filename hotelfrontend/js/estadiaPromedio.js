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
