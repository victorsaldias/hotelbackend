// model/ProvinciaModel.js
import { getConnection } from "../config/dbConfig.js";

export async function obtenerProvinciasPorRegion(idRegion) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idRegion", idRegion)
        .query(`
            SELECT idProvincia, nombre, idRegion
            FROM provincia
            WHERE idRegion = @idRegion
            ORDER BY nombre
        `);

    return result.recordset; // SIEMPRE devuelve ARRAY
}
