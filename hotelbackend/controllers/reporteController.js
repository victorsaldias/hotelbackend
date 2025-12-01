// controllers/reportesController.js
import {
    obtenerHabitacionesFrecuentes,
    obtenerOcupacionPorSucursal,
    obtenerIngresosPorHabitacion,
    obtenerEstadoHabitaciones,
    obtenerEstadiaPromedio
} from "../model/reporteModel.js";

export async function reporteHabitacionesFrecuentes(req, res) {
    const meses = parseInt(req.query.meses || "1", 10);

    try {
        const data = await obtenerHabitacionesFrecuentes(meses);
        res.json(data);
    } catch (error) {
        console.error("Error en reporteHabitacionesFrecuentes:", error);
        res.status(500).json({ error: "Error al obtener reporte de habitaciones frecuentes" });
    }
}

export async function reporteOcupacion(req, res) {
    const meses = parseInt(req.query.meses || "1", 10);

    try {
        const data = await obtenerOcupacionPorSucursal(meses);
        res.json(data);
    } catch (error) {
        console.error("Error en reporteOcupacion:", error);
        res.status(500).json({ error: "Error al obtener reporte de ocupación" });
    }
}

export async function reporteIngresosPorHabitacion(req, res) {
    const meses = parseInt(req.query.meses || "1", 10);

    try {
        const data = await obtenerIngresosPorHabitacion(meses);
        res.json(data);
    } catch (error) {
        console.error("Error en reporteIngresosPorHabitacion:", error);
        res.status(500).json({ error: "Error al obtener reporte de ingresos por habitación" });
        }
}

export async function reporteEstadoHabitaciones(req, res) {
    try {
        const data = await obtenerEstadoHabitaciones();
        res.json(data);
    } catch (error) {
        console.error("Error en reporteEstadoHabitaciones:", error);
        res.status(500).json({ error: "Error al obtener estado de habitaciones" });
    }
}

export async function reporteEstadiaPromedio(req, res) {
    const meses = parseInt(req.query.meses || "1", 10);

    try {
        const data = await obtenerEstadiaPromedio(meses);
        res.json(data);
    } catch (error) {
        console.error("Error en reporteEstadiaPromedio:", error);
        res.status(500).json({ error: "Error al obtener estadía promedio" });
    }
}
