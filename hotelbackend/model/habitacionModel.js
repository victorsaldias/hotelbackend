// model/habitacionModel.js
import { getConnection } from "../config/dbConfig.js";

/* ============================================================
   HELPERS PRIVADOS
============================================================ */

/**
 * Convierte una fecha JS a formato SQL DATETIME
 */
function toSQL(date) {
    const d = new Date(date);
    const pad = n => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

/**
 * Calcula el precio de una habitación según:
 * - precio personalizado
 * - precio del tipo de habitación
 */
export async function obtenerPrecioHabitacion(idHabitacion) {
    const pool = await getConnection();

    const habitacion = await pool.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT precioPersonalizado, idTipoHabitacion
            FROM habitacion
            WHERE idHabitacion = @idHabitacion
        `);

    if (habitacion.recordset.length === 0) return null;

    const h = habitacion.recordset[0];

    if (h.precioPersonalizado) return h.precioPersonalizado;

    const tipo = await pool.request()
        .input("idTipoHabitacion", h.idTipoHabitacion)
        .query(`
            SELECT precio 
            FROM tipoHabitacion 
            WHERE idTipoHabitacion = @idTipoHabitacion
        `);

    return tipo.recordset[0].precio;
}

/* ============================================================
   1) OBTENER HABITACIONES
============================================================ */

export async function obtenerHabitacionesDisponibles(idSucursal) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                h.idSucursal,
                t.nombre AS tipoHabitacion,
                ISNULL(h.precioPersonalizado, t.precio) AS precio,
                h.idEstadoHabitacion,
                c.capacidad,
                c.cama,
                c.tamano
            FROM habitacion h
            INNER JOIN tipoHabitacion t ON h.idTipoHabitacion = t.idTipoHabitacion
            LEFT JOIN caracteristica c ON c.idCaracteristica = h.idCaracteristica
            WHERE h.idSucursal = @idSucursal
              AND h.idEstadoHabitacion = 1
            ORDER BY h.numero
        `);

    return result.recordset;
}


export async function obtenerHabitacionPorId(idHabitacion) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT *
            FROM habitacion
            WHERE idHabitacion = @idHabitacion
        `);

    return result.recordset[0] || null;
}


export async function obtenerHabitacionPorNumero(numero) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("numero", numero)
        .query(`
            SELECT *
            FROM habitacion
            WHERE numero = @numero
        `);

    return result.recordset[0] || null;
}


/* ============================================================
   2) FILTROS Y LISTADOS
============================================================ */

export async function listarConFiltros(filtros) {
    let query = "SELECT * FROM habitacion WHERE 1 = 1";
    const pool = await getConnection();
    const req = pool.request();

    if (filtros.numero) {
        query += " AND numero = @numero";
        req.input("numero", filtros.numero);
    }
    if (filtros.idTipoHabitacion) {
        query += " AND idTipoHabitacion = @idTipoHabitacion";
        req.input("idTipoHabitacion", filtros.idTipoHabitacion);
    }
    if (filtros.idSucursal) {
        query += " AND idSucursal = @idSucursal";
        req.input("idSucursal", filtros.idSucursal);
    }

    const result = await req.query(query);
    return result.recordset;
}

export async function obtenerTodasLasHabitaciones() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM habitacion`);
    return result.recordset;
}


/* ============================================================
   3) CRUD HABITACIÓN
============================================================ */

export async function crearHabitacion(data) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("numero", data.numero)
        .input("precio", data.precio)
        .input("idTipoHabitacion", data.idTipoHabitacion)
        .input("idEstadoHabitacion", data.idEstadoHabitacion)
        .input("idSucursal", data.idSucursal)
        .query(`
            INSERT INTO habitacion (numero, precioPersonalizado, idTipoHabitacion, idEstadoHabitacion, idSucursal)
            OUTPUT INSERTED.*
            VALUES (@numero, @precio, @idTipoHabitacion, @idEstadoHabitacion, @idSucursal)
        `);

    return result.recordset[0];
}

export async function editarHabitacionModel(idHabitacion, body) {
    const pool = await getConnection();

    await pool.request()
        .input("id", idHabitacion)
        .input("idTipo", body.idTipoHabitacion)
        .input("idSuc", body.idSucursal)
        .input("idCar", body.idCaracteristica)
        .input("desc", body.descripcion)
        .input("precio", body.precioPersonalizado)
        .query(`
            UPDATE habitacion
            SET 
                idTipoHabitacion = @idTipo,
                idSucursal = @idSuc,
                idCaracteristica = @idCar,
                descripcion = @desc,
                precioPersonalizado = @precio
            WHERE idHabitacion = @id
        `);
}

export async function actualizarEstadoHabitacion(idHabitacion, idEstado) {
    const pool = await getConnection();

    await pool.request()
        .input("idHabitacion", idHabitacion)
        .input("idEstado", idEstado)
        .query(`
            UPDATE habitacion
            SET idEstadoHabitacion = @idEstado
            WHERE idHabitacion = @idHabitacion
        `);

    return true;
}


/* ============================================================
   4) TIPOS / CARACTERÍSTICAS / SERVICIOS
============================================================ */

export async function obtenerTiposHabitacion() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM tipoHabitacion`);
    return result.recordset;
}

export async function obtenerCaracteristicas() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM caracteristica`);
    return result.recordset;
}

export async function obtenerCaracteristicaPorId(id) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("id", id)
        .query(`SELECT * FROM caracteristica WHERE idCaracteristica = @id`);

    return result.recordset[0] || null;
}

export async function actualizarCaracteristica(id, data) {
    const pool = await getConnection();

    await pool.request()
        .input("id", id)
        .input("tamano", data.tamano)
        .input("capacidad", data.capacidad)
        .input("cama", data.cama)
        .query(`
            UPDATE caracteristica
            SET tamano = @tamano,
                capacidad = @capacidad,
                cama = @cama
            WHERE idCaracteristica = @id
        `);
}

export async function obtenerServicios() {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM servicio`);
    return result.recordset;
}

export async function obtenerServiciosHabitacion(idHabitacion) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT s.idServicio, s.nombre
            FROM tipoHabitacionServicio ths
            INNER JOIN servicio s ON s.idServicio = ths.idServicio
            INNER JOIN habitacion h ON h.idTipoHabitacion = ths.idTipoHabitacion
            WHERE h.idHabitacion = @idHabitacion
        `);

    return result.recordset;
}

/**
 * Reemplaza todos los servicios de un tipo de habitación
 */
export async function actualizarServiciosHabitacionModel(idHabitacion, servicios) {
    const pool = await getConnection();

    const habitacion = await pool.request()
        .input("h", idHabitacion)
        .query(`SELECT idTipoHabitacion FROM habitacion WHERE idHabitacion = @h`);

    if (habitacion.recordset.length === 0) {
        throw new Error("Habitación no encontrada.");
    }

    const idTipoHabitacion = habitacion.recordset[0].idTipoHabitacion;

    await pool.request()
        .input("idTipo", idTipoHabitacion)
        .query(`DELETE FROM tipoHabitacionServicio WHERE idTipoHabitacion = @idTipo`);

    for (const s of servicios) {
        await pool.request()
            .input("idTipo", idTipoHabitacion)
            .input("servicio", s)
            .query(`
                INSERT INTO tipoHabitacionServicio (idTipoHabitacion, idServicio)
                VALUES (@idTipo, @servicio)
            `);
    }
}

export const obtenerCaracteristicasPorTipo = async (idTipo) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idTipo", idTipo)
        .query(`
            SELECT c.*
            FROM tipoHabitacionCaracteristica thc
            INNER JOIN caracteristica c ON c.idCaracteristica = thc.idCaracteristica
            WHERE thc.idTipoHabitacion = @idTipo
        `);

    return result.recordset;
};

export const obtenerServiciosPorTipo = async (idTipo) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idTipo", idTipo)
        .query(`
            SELECT s.idServicio, s.nombre
            FROM tipoHabitacionServicio ths
            INNER JOIN servicio s ON s.idServicio = ths.idServicio
            WHERE ths.idTipoHabitacion = @idTipo
        `);

    return result.recordset;
};


/* ============================================================
   5) BÚSQUEDA POR FECHAS / CAPACIDAD
============================================================ */

export async function buscarHabitacionesPorCapacidadYFechas(
    idSucursal,
    fechaInicio,
    fechaFin,
    cantidadHuespedes
) {
    const pool = await getConnection();

    const inicioSQL = toSQL(fechaInicio);
    const finSQL = toSQL(fechaFin);

    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .input("cantidadHuespedes", cantidadHuespedes)
        .input("fechaInicio", inicioSQL)
        .input("fechaFin", finSQL)
        .query(`
            SELECT 
                h.idHabitacion,
                h.numero,
                ISNULL(h.precioPersonalizado, t.precio) AS precio,
                h.idTipoHabitacion,
                h.descripcion,
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
                    WHERE r.idEstadoReserva IN (1, 2)
                    AND r.fechaInicio < @fechaFin
                    AND r.fechaFin > @fechaInicio
              );
        `);

    return result.recordset;
}
