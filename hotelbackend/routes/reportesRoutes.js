// routes/reportesRoutes.js
import express from "express";
import {
    reporteHabitacionesFrecuentes,
    reporteOcupacion,
    reporteIngresosPorHabitacion,
    reporteEstadoHabitaciones,
    reporteEstadiaPromedio
} from "../controllers/reporteController.js";

const router = express.Router();

// Habitaciones más reservadas
router.get("/habitaciones-frecuentes", reporteHabitacionesFrecuentes);

// Ocupación por sucursal
router.get("/ocupacion", reporteOcupacion);

// Ingresos por habitación
router.get("/ingresos-habitacion", reporteIngresosPorHabitacion);

// Estado de limpieza de habitaciones
router.get("/estado-habitaciones", reporteEstadoHabitaciones);

// Estadía promedio
router.get("/estadia-promedio", reporteEstadiaPromedio);

export default router;
