import { obtenerPrecioHabitacion, asignarHabitacion } from "./habitacionModel.js";
import { getConnection } from "../config/dbConfig.js";

// Conversión correcta para evitar UTC en SQL Server
function toSQLDate(date) {
    // yyyy-mm-dd HH:MM:ss (hora local, no UTC)
    const pad = n => String(n).padStart(2, "0");

    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const h = pad(date.getHours());
    const min = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export async function ingresarReservaCompleta(data) {
    const { fechaInicio, fechaFin, idCliente, idHabitacion } = data;

    const precio = await obtenerPrecioHabitacion(idHabitacion);

    // Calcular noches basado en DATETIME y horas
    const noches = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    const total = noches * precio;

    const conn = await getConnection();

    // Solo para debug (puedes borrarlo después)
    console.log("ANTES DE ENVIAR A SQL →", fechaInicio, fechaFin);

    const result = await conn.request()
        .input("fechaInicio", toSQLDate(fechaInicio))
        .input("fechaFin", toSQLDate(fechaFin))
        .input("total", total)
        .input("idCliente", idCliente)
        .input("idEstadoReserva", 1)
        .query(`
            INSERT INTO reserva (fechaInicio, fechaFin, total, idCliente, idEstadoReserva)
            VALUES (@fechaInicio, @fechaFin, @total, @idCliente, @idEstadoReserva);

            SELECT SCOPE_IDENTITY() AS idReserva;
        `);

    const idReserva = result.recordset[0].idReserva;

    // Registrar la habitación asignada
    await asignarHabitacion(idReserva, idHabitacion);

    return { idReserva, total };
}
export async function verReservas() {
    const conn = await getConnection();
    const result = await conn.request().query(`
        SELECT 
            r.idReserva,
            r.fechaInicio,
            r.fechaFin,
            r.total,
            r.idEstadoReserva,
            c.nombre,
            c.apellido,
            c.rut,
            h.numero AS numeroHabitacion
        FROM reserva r
        JOIN cliente c ON r.idCliente = c.idCliente
        LEFT JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
        LEFT JOIN habitacion h ON rh.idHabitacion = h.idHabitacion
        ORDER BY r.idReserva DESC;
    `);

    return result.recordset;
}


export async function verReservaPorId(idReserva) {
    const conn = await getConnection();
    const result = await conn.request()
        .input("idReserva", idReserva)
        .query(`
            SELECT * FROM reserva WHERE idReserva = @idReserva;
        `);

    return result.recordset[0];
}


export async function confirmarReserva(idReserva, idEmpleado) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .input("idEmpleado", idEmpleado)
        .query(`
            UPDATE reserva
            SET idEstadoReserva = 2, idEmpleado = @idEmpleado
            WHERE idReserva = @idReserva;
        `);

    return true;
}

export async function cancelarReserva(idReserva) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .query(`
            UPDATE reserva
            SET idEstadoReserva = 3
            WHERE idReserva = @idReserva;
        `);
}

export async function verHistorialReserva(idCliente) {
    const conn = await getConnection();
    const result = await conn.request()
        .input("idCliente", idCliente)
        .query(`
            SELECT *
            FROM reserva
            WHERE idCliente = @idCliente
            ORDER BY fechaInicio DESC;
        `);

    return result.recordset;
}

export async function modificarReserva(idReserva, fechaInicio, fechaFin) {
    const conn = await getConnection();

    const habitacion = await conn.request()
        .input("idReserva", idReserva)
        .query(`
            SELECT TOP 1 idHabitacion 
            FROM reservaHabitacion
            WHERE idReserva = @idReserva;
        `);

    const idHabitacion = habitacion.recordset[0].idHabitacion;
    const precio = await obtenerPrecioHabitacion(idHabitacion);

    const dias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
    const total = dias * precio;

    await conn.request()
        .input("idReserva", idReserva)
        .input("fechaInicio", fechaInicio)
        .input("fechaFin", fechaFin)
        .input("total", total)
        .query(`
            UPDATE reserva
            SET fechaInicio = @fechaInicio,
                fechaFin = @fechaFin,
                total = @total
            WHERE idReserva = @idReserva;
        `);

    return true;
}

export async function modificarHabitacionDeReserva(idReserva, nuevaHabitacion) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .query(`
            DELETE FROM reservaHabitacion WHERE idReserva = @idReserva;
        `);

    await asignarHabitacion(idReserva, nuevaHabitacion);
}
