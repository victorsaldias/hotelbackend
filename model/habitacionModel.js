import {getConnection} from "../config/dbConfig.js";

export async function obtenerHabitacionesDisponibles() {
  const pool = await getConnection();
    const result = await pool
    .request()
    .query("SELECT * FROM habitacion WHERE idEstadoHabitacion = '1';"
    );
    return result.recordset;
}


