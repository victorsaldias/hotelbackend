
import { getConnection } from "../config/dbConfig.js";

export async function obtenerRoles() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT idRol, nombre 
        FROM rol
        ORDER BY idRol
    `);
    return result.recordset;
}

export async function crearRol(nombre) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("nombre", nombre)
        .query(`
            INSERT INTO rol (nombre)
            VALUES (@nombre);

            SELECT SCOPE_IDENTITY() AS idRol;
        `);

    return result.recordset[0];
}

export async function eliminarRol(idRol) {
    const pool = await getConnection();
    await pool.request()
        .input("idRol", idRol)
        .query(`
            DELETE FROM rol
            WHERE idRol = @idRol
        `);
}
