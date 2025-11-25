import { getConnection } from "../config/dbConfig.js";

export const Region = {
    idRegion: 0,
    nombreRegion: ""
};

export async function obtenerRegiones() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT idRegion, nombreRegion 
        FROM Region
        ORDER BY nombreRegion
    `);
    return result.recordset;
}
