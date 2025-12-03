import { getConnection } from "../config/dbConfig.js";

export async function obtenerEstadoHabitaciones(idSucursal) { // 👈 RECIBIR idSucursal
    const pool = await getConnection();
    
    // 👇 CONSTRUCCIÓN DINÁMICA DEL QUERY
    let query = `
        SELECT 
            h.idHabitacion,
            h.numero,
            h.descripcion,
            h.idSucursal,
            estadoActual.nombre AS estadoLimpieza
        FROM Habitacion h
        OUTER APPLY (
            SELECT TOP 1 
                el.nombre
            FROM Limpieza l
            INNER JOIN EstadoLimpieza el
                ON l.idEstadoLimpieza = el.idEstadoLimpieza
            WHERE l.idHabitacion = h.idHabitacion
            ORDER BY l.idLimpieza DESC
        ) AS estadoActual
    `;
    
    // 👇 AGREGAR FILTRO SI SE RECIBE idSucursal
    if (idSucursal) {
        query += ` WHERE h.idSucursal = @idSucursal`;
    }
    
    query += ` ORDER BY h.numero`; // 👈 ORDENAR POR NÚMERO
    
    const request = pool.request();
    
    // 👇 AGREGAR PARÁMETRO SI EXISTE
    if (idSucursal) {
        request.input('idSucursal', parseInt(idSucursal));
    }
    
    const result = await request.query(query);
    return result.recordset;
}

export async function iniciarLimpiezaHabitacion(idHabitacion, idEmpleado, descripcion) {
    const pool = await getConnection();
    const horaActual = new Date().toTimeString().slice(0, 5); 
    
    const result = await pool.request()
        .input('idHabitacion', idHabitacion)
        .input('idEstadoLimpieza', 3) 
        .input('horaInicio', horaActual)
        .input('horaFin', horaActual)
        .input('descripcion', descripcion)
        .input('idEmpleado', idEmpleado)
        .query(`
            INSERT INTO Limpieza (idHabitacion, idEstadoLimpieza, horaInicio, horaFin, descripcion, idEmpleado)
            VALUES (@idHabitacion, @idEstadoLimpieza, @horaInicio, @horaFin, @descripcion, @idEmpleado)
        `);
    
    return result;
}

export async function terminarLimpiezaHabitacion(idHabitacion, idEmpleado, descripcion) {
    const pool = await getConnection();
    const horaActual = new Date().toTimeString().slice(0, 5);
    
    const result = await pool.request()
        .input('idHabitacion', idHabitacion)
        .input('idEstadoLimpieza', 1) // 1 = Limpia
        .input('horaInicio', horaActual)
        .input('horaFin', horaActual)
        .input('descripcion', descripcion)
        .input('idEmpleado', idEmpleado)
        .query(`
            INSERT INTO Limpieza (idHabitacion, idEstadoLimpieza, horaInicio, horaFin, descripcion, idEmpleado)
            VALUES (@idHabitacion, @idEstadoLimpieza, @horaInicio, @horaFin, @descripcion, @idEmpleado)
        `);
    
    return result;
}