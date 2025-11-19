import {getConnection} from "../config/dbConfig.js";

export async function obtenerHabitacionesDisponibles() {
  const pool = await getConnection();
    const result = await pool
    .request()
    .query("SELECT * FROM habitacion WHERE idEstadoHabitacion = '1';"
    );
    return result.recordset;
}

export async function obtenerHabitacionPorNumero(numero) {
  const pool = await getConnection();
    const result = await pool
    .request()
    .input("numero", numero)
    .query("SELECT * FROM habitacion WHERE numero = @numero;"
    );
    return result.recordset[0];
}  

export async function obtenerHabitacionPorId(idHabitacion) {
  const pool = await getConnection();
    const result = await pool
    .request()
    .input("idHabitacion", idHabitacion)
    .query("SELECT * FROM habitacion WHERE idHabitacion = @idHabitacion;"
    );
    return result.recordset[0];
}

export  async function actualizarEstadoHabitacion(numero, idEstadoHabitacion) {
  const pool = await getConnection();
    const result = await pool 
    .request()
    .input("numero", numero)
    .input("idEstadoHabitacion", idEstadoHabitacion)
    .query(`
      UPDATE habitacion 
      SET idEstadoHabitacion = @idEstadoHabitacion 
      WHERE numero = @numero;
    `);
    return result.rowsAffected[0] > 0;
}

export async function obtenerTodasLasHabitaciones() {
  const pool = await getConnection();
    const result = await pool
    .request()
    .query("SELECT * FROM habitacion;"
    );
    return result.recordset;
}

export async function crearHabitacion(data) {
  const {
    numero,
    precio,
    idTipoHabitacion,
    idEstadoHabitacion,
    idSucursal
  } = data;
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

export async function obtenerPrecioHabitacion(idHabitacion) {
    const conn = await getConnection();
    const result = await conn.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT precio FROM habitacion
            WHERE idHabitacion = @idHabitacion;
        `);
    return result.recordset[0].precio;
}

export async function verHabitacionesDeReserva(idReserva) {
    const conn = await getConnection();
    const result = await conn.request()
        .input("idReserva", idReserva)
        .query(`
            SELECT h.*
            FROM habitacion h
            JOIN reservaHabitacion rh ON h.idHabitacion = rh.idHabitacion
            WHERE rh.idReserva = @idReserva;
        `);

    return result.recordset;
}

export async function buscarHabitacionesPorCapacidadYFechas(
    idSucursal, fechaInicio, fechaFin, cantidadHuespedes
) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .input("fechaInicio", fechaInicio)
        .input("fechaFin", fechaFin)
        .input("cantidadHuespedes", cantidadHuespedes)
        .query(`
            SELECT *
            FROM habitacion h
            WHERE h.idSucursal = @idSucursal
            AND h.capacidad >= @cantidadHuespedes
            AND h.idHabitacion NOT IN (
                SELECT idHabitacion FROM reserva
                WHERE (fechaInicio <= @fechaFin)
                AND (fechaFin >= @fechaInicio)
                AND idEstadoReserva <> 3
            )
        `);

    return result.recordset;
}






