import {getConnection} from "./dbConfig.js";

export async function obtenerHabitacionesDisponibles() {
  const pool = await getConnection();
    const result = await pool
    .request()
    .query("SELECT * FROM habitacion WHERE estadoHabitacion = 'Disponible';"
    );
    return result.recordset;
}


