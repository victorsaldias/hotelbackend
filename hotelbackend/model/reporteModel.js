// model/reportesModel.js
import { getConnection } from "../config/dbConfig.js";

/**
 * Habitaciones más reservadas en los últimos X meses
 */
export async function obtenerHabitacionesFrecuentes(meses) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("meses", meses)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                th.nombre AS tipoHabitacion,
                s.nombre AS sucursal,
                COUNT(r.idReserva) AS totalReservas
            FROM reserva r
            INNER JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
            INNER JOIN habitacion h ON rh.idHabitacion = h.idHabitacion
            INNER JOIN tipoHabitacion th ON h.idTipoHabitacion = th.idTipoHabitacion
            INNER JOIN sucursal s ON h.idSucursal = s.idSucursal
            WHERE r.fechaInicio >= DATEADD(MONTH, -@meses, GETDATE())
            GROUP BY h.idHabitacion, h.numero, th.nombre, s.nombre
            ORDER BY totalReservas DESC;
        `);

    return result.recordset;
}

/**
 * Ocupación por sucursal
 */
export async function obtenerOcupacionPorSucursal(meses) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("meses", meses)
        .query(`
            DECLARE @fechaInicio DATE = DATEADD(MONTH, -@meses, GETDATE());
            DECLARE @fechaFin DATE = GETDATE();
            DECLARE @totalDias INT = DATEDIFF(DAY, @fechaInicio, @fechaFin) + 1;

            ;WITH DiasOcupados AS (
                SELECT 
                    h.idHabitacion,
                    s.nombre AS sucursal,
                    SUM(DATEDIFF(DAY, r.fechaInicio, r.fechaFin)) AS diasOcupados
                FROM reserva r
                INNER JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
                INNER JOIN habitacion h ON rh.idHabitacion = h.idHabitacion
                INNER JOIN sucursal s ON h.idSucursal = s.idSucursal
                WHERE r.fechaInicio >= @fechaInicio
                GROUP BY h.idHabitacion, s.nombre
            )
            SELECT 
                sucursal,
                SUM(diasOcupados) AS diasOcupados,
                COUNT(*) * @totalDias AS diasDisponibles,
                (CAST(SUM(diasOcupados) AS FLOAT) / (COUNT(*) * @totalDias)) * 100 AS porcentajeOcupacion
            FROM DiasOcupados
            GROUP BY sucursal;
        `);

    return result.recordset;
}

/**
 * Ingresos por habitación
 */
export async function obtenerIngresosPorHabitacion(meses) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("meses", meses)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                th.nombre AS tipoHabitacion,
                s.nombre AS sucursal,
                SUM(r.total) AS ingresos
            FROM reserva r
            INNER JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
            INNER JOIN habitacion h ON rh.idHabitacion = h.idHabitacion
            INNER JOIN tipoHabitacion th ON h.idTipoHabitacion = th.idTipoHabitacion
            INNER JOIN sucursal s ON h.idSucursal = s.idSucursal
            WHERE r.fechaInicio >= DATEADD(MONTH, -@meses, GETDATE())
            GROUP BY h.idHabitacion, h.numero, th.nombre, s.nombre
            ORDER BY ingresos DESC;
        `);

    return result.recordset;
}

/**
 * Estado de habitaciones (Housekeeping)
 */
export async function obtenerEstadoHabitaciones() {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT 
                el.nombre AS estadoLimpieza,
                COUNT(*) AS totalHabitaciones
            FROM habitacion h
            INNER JOIN estadoLimpieza el ON h.idEstadoHabitacion = el.idEstadoLimpieza
            GROUP BY el.nombre
            ORDER BY totalHabitaciones DESC;
        `);

    return result.recordset;
}

/**
 * Estadía promedio
 */
export async function obtenerEstadiaPromedio(meses) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("meses", meses)
        .query(`
            SELECT 
                AVG(CAST(DATEDIFF(DAY, r.fechaInicio, r.fechaFin) AS FLOAT)) AS estadiaPromedioDias,
                COUNT(*) AS totalReservas
            FROM reserva r
            WHERE r.fechaInicio >= DATEADD(MONTH, -@meses, GETDATE());
        `);

    return result.recordset[0] || { estadiaPromedioDias: 0, totalReservas: 0 };
}
