import { getConnection } from "../config/dbConfig.js";

export async function obtenerSucursales() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT idSucursal, nombre, direccion 
            FROM sucursal
        `);
        return result.recordset;

    } catch (error) {
        throw new Error("Error al obtener sucursales: " + error.message);
    }
}
