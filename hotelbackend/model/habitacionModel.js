import { getConnection } from "../config/dbConfig.js";

/* ============================================================
   HABITACIONES BÁSICAS
============================================================ */

export async function obtenerHabitacionesDisponibles() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT 
            h.*, 
            s.nombre AS nombreSucursal,
            s.direccion AS direccionSucursal
        FROM habitacion h
        INNER JOIN sucursal s ON s.idSucursal = h.idSucursal
        WHERE h.idEstadoHabitacion = 1;
    `);

    return result.recordset;
}

export async function obtenerHabitacionPorNumero(numero) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("numero", numero)
        .query(`SELECT * FROM habitacion WHERE numero = @numero;`);
    return result.recordset[0];
}

export async function obtenerHabitacionPorId(idHabitacion) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                th.nombre AS tipo,
                th.precio AS precio,
                c.capacidad,
                c.cama,
                c.tamano,
                h.idSucursal,
                h.idTipoHabitacion,
                h.idEstadoHabitacion
            FROM habitacion h
            INNER JOIN tipoHabitacion th
                ON th.idTipoHabitacion = h.idTipoHabitacion
            INNER JOIN tipoHabitacionCaracteristica thc
                ON thc.idTipoHabitacion = th.idTipoHabitacion
            INNER JOIN caracteristica c
                ON c.idCaracteristica = thc.idCaracteristica
            WHERE h.idHabitacion = @idHabitacion
        `);

    return result.recordset[0];
}

export async function obtenerTodasLasHabitaciones() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM habitacion;`);
    return result.recordset;
}


/* ============================================================
   CREAR / ACTUALIZAR / ESTADO
============================================================ */

export async function crearHabitacion(data) {
    const { numero, precio, idTipoHabitacion, idEstadoHabitacion, idSucursal } = data;

    const pool = await getConnection();
    const result = await pool.request()
        .input("numero", numero)
        .input("precio", precio)
        .input("idTipoHabitacion", idTipoHabitacion)
        .input("idEstadoHabitacion", idEstadoHabitacion)
        .input("idSucursal", idSucursal)
        .query(`
            INSERT INTO habitacion (numero, precio, idTipoHabitacion, idEstadoHabitacion, idSucursal)
            OUTPUT INSERTED.*
            VALUES (@numero, @precio, @idTipoHabitacion, @idEstadoHabitacion, @idSucursal);
        `);

    return result.recordset[0];
}

export async function actualizarEstadoHabitacion(numero, idEstadoHabitacion) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("numero", numero)
        .input("idEstadoHabitacion", idEstadoHabitacion)
        .query(`
            UPDATE habitacion
            SET idEstadoHabitacion = @idEstadoHabitacion
            WHERE numero = @numero;
        `);

    return result.rowsAffected[0] > 0;
}


/* ============================================================
   RESERVAS: ASIGNAR HABITACIÓN
============================================================ */

export async function asignarHabitacion(idReserva, idHabitacion) {
    const conn = await getConnection();
    await conn.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", idHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion);
        `);
}


/* ============================================================
   PRECIOS / BÚSQUEDA AVANZADA
============================================================ */

export async function obtenerPrecioHabitacion(idHabitacion) {
    const conn = await getConnection();
    const result = await conn.request()
        .input("idHabitacion", idHabitacion)
        .query(`SELECT precio FROM habitacion WHERE idHabitacion = @idHabitacion;`);

    return result.recordset[0].precio;
}

export async function buscarHabitacionesPorCapacidadYFechas(
    idSucursal,
    fechaInicio,
    fechaFin,
    cantidadHuespedes
) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .input("fechaInicio", fechaInicio)
        .input("fechaFin", fechaFin)
        .input("cantidadHuespedes", cantidadHuespedes)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                ISNULL(h.precioPersonalizado, t.precio) AS precio,
                h.idTipoHabitacion,
                h.idSucursal,
                s.nombre AS nombreSucursal,
                s.direccion AS direccionSucursal,
                c.capacidad,
                c.cama,
                c.tamano
            FROM habitacion h
            INNER JOIN tipoHabitacion t ON t.idTipoHabitacion = h.idTipoHabitacion
            INNER JOIN caracteristica c ON c.idCaracteristica = h.idCaracteristica
            INNER JOIN sucursal s ON s.idSucursal = h.idSucursal
            WHERE h.idSucursal = @idSucursal
            AND c.capacidad = @cantidadHuespedes
            AND h.idHabitacion NOT IN (
                SELECT rh.idHabitacion
                FROM reservaHabitacion rh
                INNER JOIN reserva r ON r.idReserva = rh.idReserva
                WHERE r.fechaInicio <= @fechaFin
                AND r.fechaFin >= @fechaInicio
                AND r.idEstadoReserva IN (1, 2)
            );
        `);

    return result.recordset;
}







