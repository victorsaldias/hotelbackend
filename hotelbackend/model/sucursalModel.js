import { getConnection } from "../config/dbConfig.js";

// Obtener todas las sucursales
export async function obtenerSucursalesModel() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT idSucursal, nombre, direccion 
        FROM sucursal
    `);
    return result.recordset;
}

// Obtener una sucursal por ID
export async function obtenerSucursalPorId(idSucursal) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .query(`
            SELECT idSucursal, nombre, direccion
            FROM sucursal
            WHERE idSucursal = @idSucursal
        `);

    return result.recordset[0] || null;
}

// Validar si una sucursal existe
export async function existeSucursal(idSucursal) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idSucursal", idSucursal)
        .query(`
            SELECT idSucursal
            FROM sucursal
            WHERE idSucursal = @idSucursal
        `);

    return result.recordset.length > 0;
}

// Versión simple (si alguna vez necesitas menos columnas)
export async function listarSucursalesBasico() {
    const pool = await getConnection();
    const result = await pool.request().query(`
        SELECT idSucursal, nombre 
        FROM sucursal
        ORDER BY nombre
    `);
    return result.recordset;
}