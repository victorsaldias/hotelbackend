import { getConnection } from "../config/dbConfig.js";

export async function obtenerHabitacionesDisponibles() {
    const pool = await getConnection();
    const r = await pool.request().query(`
        SELECT * FROM habitacion WHERE idEstadoHabitacion = 1
    `);
    return r.recordset;
}

export async function obtenerHabitacionPorNumero(numero) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("numero", numero)
        .query(`SELECT * FROM habitacion WHERE numero = @numero`);
    return r.recordset[0];
}
export async function asignarHabitacion(idReserva, idHabitacion) {
    const pool = await getConnection();
    await pool.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", idHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion)
        `);
}

export async function obtenerHabitacionPorId(id) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("idHabitacion", id)
        .query(`SELECT * FROM habitacion WHERE idHabitacion = @idHabitacion`);
    return r.recordset[0];
}

export async function listarConFiltros(filtros) {
    let query = "SELECT * FROM habitacion WHERE 1=1 ";
    const pool = await getConnection();
    const req = pool.request();

    if (filtros.numero) { query += " AND numero = @numero"; req.input("numero", filtros.numero); }
    if (filtros.idTipoHabitacion) { query += " AND idTipoHabitacion = @idTipoHabitacion"; req.input("idTipoHabitacion", filtros.idTipoHabitacion); }
    if (filtros.idSucursal) { query += " AND idSucursal = @idSucursal"; req.input("idSucursal", filtros.idSucursal); }

    const r = await req.query(query);
    return r.recordset;
}

export async function crearHabitacion(data) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("numero", data.numero)
        .input("precio", data.precio)
        .input("idTipoHabitacion", data.idTipoHabitacion)
        .input("idEstadoHabitacion", data.idEstadoHabitacion)
        .input("idSucursal", data.idSucursal)
        .query(`
            INSERT INTO habitacion (numero, precio, idTipoHabitacion, idEstadoHabitacion, idSucursal)
            OUTPUT INSERTED.*
            VALUES (@numero, @precio, @idTipoHabitacion, @idEstadoHabitacion, @idSucursal)
        `);

    return r.recordset[0];
}

export async function actualizarEstadoHabitacion(numero, estado) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("numero", numero)
        .input("estado", estado)
        .query(`
            UPDATE habitacion SET idEstadoHabitacion = @estado
            WHERE numero = @numero
        `);

    return r.rowsAffected[0] > 0;
}

export async function obtenerTodasLasHabitaciones() {
    const pool = await getConnection();
    const r = await pool.request().query(`SELECT * FROM habitacion`);
    return r.recordset;
}

export async function obtenerTiposHabitacion() {
    const pool = await getConnection();
    const r = await pool.request().query(`SELECT * FROM tipoHabitacion`);
    return r.recordset;
}

export async function obtenerCaracteristicas() {
    const pool = await getConnection();
    const r = await pool.request().query(`SELECT * FROM caracteristica`);
    return r.recordset;
}

export async function obtenerCaracteristicaPorId(id) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("id", id)
        .query(`SELECT * FROM caracteristica WHERE idCaracteristica = @id`);
    return r.recordset[0];
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
            SET tamano = @tamano, capacidad = @capacidad, cama = @cama
            WHERE idCaracteristica = @id
        `);
}

export async function obtenerServicios() {
    const pool = await getConnection();
    const r = await pool.request().query(`SELECT * FROM servicio`);
    return r.recordset;
}

export async function obtenerServiciosHabitacion(id) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("id", id)
        .query(`
            SELECT s.idServicio, s.nombre
            FROM servicioHabitacion sh
            INNER JOIN servicio s ON s.idServicio = sh.idServicio
            WHERE sh.idHabitacion = @id
        `);
    return r.recordset;
}

export async function actualizarServiciosHabitacionModel(idHabitacion, servicios) {
    const pool = await getConnection();

    await pool.request()
        .input("h", idHabitacion)
        .query(`DELETE FROM servicioHabitacion WHERE idHabitacion = @h`);

    for (const s of servicios) {
        await pool.request()
            .input("h", idHabitacion)
            .input("s", s)
            .query(`
                INSERT INTO servicioHabitacion (idHabitacion, idServicio)
                VALUES (@h, @s)
            `);
    }
}
export async function obtenerPrecioHabitacion(idHabitacion) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT precioPersonalizado, idTipoHabitacion
            FROM habitacion
            WHERE idHabitacion = @idHabitacion
        `);

    if (result.recordset.length === 0) return null;

    const habitacion = result.recordset[0];

    if (habitacion.precioPersonalizado) {
        return habitacion.precioPersonalizado;
    }

    const tipo = await pool.request()
        .input("idTipoHabitacion", habitacion.idTipoHabitacion)
        .query(`SELECT precio FROM tipoHabitacion WHERE idTipoHabitacion = @idTipoHabitacion`);

    return tipo.recordset[0].precio;
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







