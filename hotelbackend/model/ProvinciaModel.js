import { getConnection } from "../config/dbConfig.js";

export const Provincia = {
    idProvincia: 0,
    nombre: "",
    idRegion: 0
};

export async function obtenerProvinciasPorRegion(idRegion) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idRegion", idRegion)
        .query(`
           SELECT 
    idProvincia, 
    nombre, 
    idRegion
FROM provincia
WHERE idRegion = @idRegion
ORDER BY nombre;
        `);

    return result.recordset;
}

