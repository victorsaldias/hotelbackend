
import { getConnection } from "../config/dbConfig.js";
import { obtenerPrecioHabitacion } from "./habitacionModel.js";

/* ============================================================
   INSERTAR RESERVA (cabecera)
============================================================ */
export async function ingresarReservaCompleta(data) {
    const { fechaInicio, fechaFin, idCliente, total, cantidadHuespedes } = data;

    const conn = await getConnection();

    const result = await conn.request()
        .input("fechaInicio", fechaInicio)
        .input("fechaFin", fechaFin)
        .input("total", total)
        .input("idCliente", idCliente)
        .input("idEstadoReserva", 1)  // 1 = Pendiente
        .input("cantidadHuespedes", cantidadHuespedes || 1)
        .query(`
            INSERT INTO reserva (fechaInicio, fechaFin, total, idCliente, idEstadoReserva, cantidadHuespedes)
            VALUES (@fechaInicio, @fechaFin, @total, @idCliente, @idEstadoReserva, @cantidadHuespedes);

            SELECT SCOPE_IDENTITY() AS idReserva;
        `);

    return result.recordset[0];
}

/* ============================================================
   VALIDAR SOLAPAMIENTO HABITACIÓN
============================================================ */
export async function validarSolapamientoHabitacion(idHabitacion, fechaInicio, fechaFin) {
    const conn = await getConnection();

    const result = await conn.request()
        .input("idHabitacion", idHabitacion)
        .input("inicio", fechaInicio)
        .input("fin", fechaFin)
        .query(`
            SELECT 1
            FROM reserva r
            JOIN reservaHabitacion rh ON r.idReserva = rh.idReserva
            WHERE rh.idHabitacion = @idHabitacion
              AND r.idEstadoReserva <> 3 
              AND r.fechaInicio < @fin
              AND r.fechaFin > @inicio;
        `);

    return result.recordset.length > 0;
}

/* ============================================================
   GUARDAR ACOMPAÑANTE (NUEVO FORMATO)
   SOLO TIPO PERSONA + ID RESERVA
============================================================ */
export async function guardarAcompaniante(idReserva, acomp) {
    const conn = await getConnection();

    const tipo = (acomp.tipoPersona || "adulto").toLowerCase();

    return await conn.request()
        .input("tipoPersona", tipo)
        .input("idReserva", idReserva)
        .query(`
            INSERT INTO acompaniante (tipoPersona, idReserva)
            VALUES (@tipoPersona, @idReserva);
        `);
}

/* ============================================================
   LISTAR RESERVAS (con sucursal opcional)
============================================================ */
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
        request.input("idSucursal", parseInt(idSucursal));
    }

    query += ` ORDER BY r.idReserva DESC`;

    const result = await request.query(query);
    return result.recordset;
}

/* ============================================================
   VER UNA RESERVA
============================================================ */
export async function verReservaPorId(idReserva) {
    const conn = await getConnection();

    const result = await conn.request()
        .input("idReserva", idReserva)
        .query(`SELECT * FROM reserva WHERE idReserva = @idReserva;`);

    return result.recordset[0];
}

/* ============================================================
   CAMBIAR ESTADO RESERVA
============================================================ */
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

export async function cambiarEstadoReserva(idReserva, estado) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .input("estado", estado)
        .query(`
            UPDATE reserva
            SET idEstadoReserva = @estado
            WHERE idReserva = @idReserva;
        `);
}

/* ============================================================
   HISTORIAL CLIENTE
============================================================ */
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

/* ============================================================
   MODIFICAR FECHAS Y TOTAL
============================================================ */
export async function modificarReserva(idReserva, fechaInicio, fechaFin) {
    const conn = await getConnection();

    const habs = await conn.request()
        .input("idReserva", idReserva)
        .query(`SELECT idHabitacion FROM reservaHabitacion WHERE idReserva = @idReserva;`);

    if (habs.recordset.length === 0) {
        throw new Error("La reserva no tiene habitaciones.");
    }

    const dias = Math.ceil((new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24));
    let total = 0;

    for (const row of habs.recordset) {
        const precio = await obtenerPrecioHabitacion(row.idHabitacion);
        total += precio * dias;
    }

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

/* ============================================================
   AGREGAR HABITACIÓN A RESERVA
============================================================ */
export async function agregarHabitacionAReserva(idReserva, idHabitacion) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", idHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion);
        `);
}

// Modificar habitación de una reserva existente
export async function modificarHabitacionDeReserva(idReserva, nuevaHabitacion) {
    const conn = await getConnection();

    await conn.request()
        .input("idReserva", idReserva)
        .query(`
            DELETE FROM reservaHabitacion WHERE idReserva = @idReserva;
        `);

    await conn.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", nuevaHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion);
        `);
}