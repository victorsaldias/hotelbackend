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
    SELECT 
        idComuna, 
        nombre, 
        idProvincia
    FROM comuna
    WHERE idProvincia = @idProvincia
    ORDER BY nombre;
`)
;

    return result.recordset;
}

export async function obtenerTodasLasComunasBD() {
  const pool = await getConnection();
  const result = await pool.request().query("SELECT * FROM comuna");
  return result.recordset;
}

export async function obtenerComunaPorIdDB(idComuna) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idComuna", idComuna)
        .query(`
            SELECT 
    c.idComuna, 
    c.nombre,
    p.idProvincia,
    r.idRegion
            FROM comuna c
            INNER JOIN provincia p ON c.idProvincia = p.idProvincia
            INNER JOIN region r ON p.idRegion = r.idRegion
            WHERE c.idComuna = @idComuna
        `);

    return result.recordset[0];
}
