import { getConnection } from "../config/dbConfig.js";

export async function obtenerHabitacionesDisponibles(idSucursal) {
    const pool = await getConnection();
    const r = await pool.request()
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
    return r.recordset;
}
export async function obtenerHabitacionPorNumero(numero) {
    const pool = await getConnection();
    const r = await pool.request()
        .input("numero", numero)
        .query(`SELECT * FROM habitacion WHERE numero = @numero`);
    return r.recordset[0];
}
export async function asignarHabitacion(idReserva, idHabitacion, fechaInicio, fechaFin) {
    const conn = await getConnection();

    // 1) Validar conflicto con otras reservas
    const conflicto = await conn.request()
        .input("idHabitacion", idHabitacion)
        .input("inicio", fechaInicio)
        .input("fin", fechaFin)
        .query(`
            SELECT 1
            FROM reserva r
            INNER JOIN reservaHabitacion rh ON rh.idReserva = r.idReserva
            WHERE rh.idHabitacion = @idHabitacion
            AND r.fechaInicio <= @fin
            AND r.fechaFin >= @inicio;
        `);

    if (conflicto.recordset.length > 0) {
        throw new Error("La habitación ya está asignada en ese rango de fechas.");
    }

    // 2) Validar que esta reserva NO tenga otra habitación
    const yaAsignada = await conn.request()
        .input("idReserva", idReserva)
        .query(`
            SELECT idHabitacion
            FROM reservaHabitacion
            WHERE idReserva = @idReserva
        `);

    if (yaAsignada.recordset.length > 0) {
        throw new Error("Esta reserva ya tiene una habitación asignada.");
    }

    // 3) Insertar asignación correcta
    await conn.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", idHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion)
        `);

    return true;
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
        .input("idHabitacion", id) 
        .query(`
            SELECT T3.idServicio, T3.nombre
            FROM habitacion T1
            INNER JOIN TipoHabitacionServicio T2 ON T1.idTipoHabitacion = T2.idTipoHabitacion
            INNER JOIN servicio T3 ON T2.idServicio = T3.idServicio
            WHERE T1.idHabitacion = @idHabitacion
        `);
    return r.recordset;
}

export async function actualizarServiciosHabitacionModel(idHabitacion, servicios) {
    const pool = await getConnection();
    
    
    const habitacionResult = await pool.request()
        .input("h", idHabitacion)
        .query(`SELECT idTipoHabitacion FROM habitacion WHERE idHabitacion = @h`);

    if (habitacionResult.recordset.length === 0) {
        throw new Error("Habitación no encontrada para actualizar servicios.");
    }
    const idTipoHabitacion = habitacionResult.recordset[0].idTipoHabitacion;
    
    
    await pool.request()
        .input("idTipo", idTipoHabitacion)
        .query(`DELETE FROM TipoHabitacionServicio WHERE idTipoHabitacion = @idTipo`);

    for (const s of servicios) {
        await pool.request()
            .input("idTipo", idTipoHabitacion)
            .input("s", s)
            .query(`
                INSERT INTO TipoHabitacionServicio (idTipoHabitacion, idServicio)
                VALUES (@idTipo, @s)
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
function toSQL(date) {
    const pad = n => n.toString().padStart(2,"0");
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
}
export async function buscarHabitacionesPorCapacidadYFechas(
    
    idSucursal,
    fechaInicio,   
    fechaFin,      
    cantidadHuespedes
) {
    const pool = await getConnection();

    
    const inicioSQL = fechaInicio
    const finSQL    = fechaFin

    console.log("BUSQUEDA →", idSucursal, cantidadHuespedes, inicioSQL, finSQL);

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
                    INNER JOIN habitacion h2 ON h2.idHabitacion = rh.idHabitacion
                    INNER JOIN reserva r ON r.idReserva = rh.idReserva
                    WHERE h2.idSucursal = @idSucursal
                      AND r.idEstadoReserva IN (1, 2)    -- mismos estados
                      AND r.fechaInicio < @fechaFin     -- MISMO solape
                      AND r.fechaFin > @fechaInicio
               );
        `);
console.log("=== MODEL BUSQUEDA ===");
console.log("inicioSQL:", inicioSQL);
console.log("finSQL:", finSQL);
console.log("======================");
    return result.recordset;
}




export const obtenerCaracteristicasPorTipo = async (idTipo) => {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idTipo", idTipo)
        .query(`
            SELECT c.*
            FROM tipoHabitacionCaracteristica thc
            INNER JOIN Caracteristica c ON c.idCaracteristica = thc.idCaracteristica
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
            INNER JOIN Servicio s ON s.idServicio = ths.idServicio
            WHERE ths.idTipoHabitacion = @idTipo
        `);

    return result.recordset;
};

export const actualizarEstadoHabitacion = async (idHabitacion, idEstado) => {
    const conn = await getConnection();

    await conn.request()
        .input("idHabitacion", idHabitacion)
        .input("idEstado", idEstado)
        .query(`
            UPDATE habitacion
            SET idEstadoHabitacion = @idEstado
            WHERE idHabitacion = @idHabitacion
        `);

    return true;
};






