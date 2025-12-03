import { obtenerPrecioHabitacion, asignarHabitacion } from "./habitacionModel.js";
import { getConnection } from "../config/dbConfig.js";

export async function ingresarReservaCompleta(data) {
    const { fechaInicio, fechaFin, idCliente, idHabitacion } = data;

    const precio = await obtenerPrecioHabitacion(idHabitacion);
    const dias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
    const total = dias * precio;

    const conn = await getConnection();

    const result = await conn.request()
        .input("fechaInicio", fechaInicio)
        .input("fechaFin", fechaFin)
        .input("total", total)
        .input("idCliente", idCliente)
        .input("idEstadoReserva", 1)
        .query(`
            INSERT INTO reserva (fechaInicio, fechaFin, total, idCliente, idEstadoReserva)
            VALUES (@fechaInicio, @fechaFin, @total, @idCliente, @idEstadoReserva);

            SELECT SCOPE_IDENTITY() AS idReserva;
        `);

    const idReserva = result.recordset[0].idReserva;

    await asignarHabitacion(idReserva, idHabitacion);

    return { idReserva, total };
}
export async function guardarAcompaniante(idReserva, a) {
    const conn = await getConnection();

    const tipoNormalizado =
        a.tipoPersona.toLowerCase() === "adulto"
            ? "adulto"
            : "niño"; // OBLIGATORIO con tilde y minúscula

    return await conn.request()
        .input("nombre", a.nombre)
        .input("apellido", a.apellido)
        .input("rut", a.rut || "")
        .input("telefono", a.telefono || "")
        .input("tipoPersona", tipoNormalizado)
        .input("idReserva", idReserva)
        .query(`
            INSERT INTO acompaniante (nombre, apellido, rut, telefono, tipoPersona, idReserva)
            VALUES (@nombre, @apellido, @rut, @telefono, @tipoPersona, @idReserva)
        `);
}

export async function verReservas(idSucursal) {
    const conn = await getConnection();
    
    let query = `
        SELECT 
            r.idReserva,
            r.fechaInicio,
            r.fechaFin,
            r.total,
            r.idEstadoReserva,
            c.nombre,
            c.apellido,
            c.rut,
            h.numero AS numeroHabitacion,
            h.idSucursal,
            s.nombre AS nombreSucursal
        FROM reserva r
        JOIN cliente c ON r.idCliente = c.idCliente
        LEFT JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
        LEFT JOIN habitacion h ON rh.idHabitacion = h.idHabitacion
        LEFT JOIN sucursal s ON h.idSucursal = s.idSucursal
    `;

    const request = conn.request();

    if (idSucursal) {
        query += ` WHERE h.idSucursal = @idSucursal`;
        request.input('idSucursal', parseInt(idSucursal));
    }

    query += ` ORDER BY r.idReserva DESC`;

    const result = await request.query(query);
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
            SELECT 
                r.idReserva,
                r.fechaInicio,
                r.fechaFin,
                r.total,
                r.cantidadHuespedes,
                er.nombre AS estadoReserva,
                
                h.numero AS numeroHabitacion,
                th.nombre AS tipoHabitacion

            FROM reserva r
            LEFT JOIN reservaHabitacion rh ON rh.idReserva = r.idReserva
            LEFT JOIN habitacion h ON h.idHabitacion = rh.idHabitacion
            LEFT JOIN tipoHabitacion th ON th.idTipoHabitacion = h.idTipoHabitacion
            LEFT JOIN estadoReserva er ON er.idEstadoReserva = r.idEstadoReserva

            WHERE r.idCliente = @idCliente
            ORDER BY r.fechaInicio DESC;
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

export async function cambiarEstadoReserva(idReserva, idEstadoReserva) {
    const pool = await getConnection();
    await pool.request()
        .input("idReserva", idReserva)
        .input("estado", idEstadoReserva)
        .query(`
            UPDATE reserva
            SET idEstadoReserva = @estado
            WHERE idReserva = @idReserva
        `);
}
