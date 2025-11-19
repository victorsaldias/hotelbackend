import { getConnection } from "../config/dbConfig.js";

export const Comuna = {
    idComuna: 0,
    nombre: "",
    idProvincia: 0
};

export async function obtenerComunasPorProvincia(idProvincia) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idProvincia", idProvincia)
        .query(`
            SELECT idComuna, nombre, idProvincia
            FROM Comuna
            WHERE idProvincia = @idProvincia
            ORDER BY nombre
        `);

    return result.recordset;
}
