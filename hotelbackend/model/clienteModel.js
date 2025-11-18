import { getConnection } from "../config/dbConfig.js";
import sql from "mssql";


// CREAR CLIENTE
export async function crearCliente(data) {
    const pool = await getConnection();

    const query = `
        INSERT INTO cliente (rut, password, nombre, apellido, telefono, correo, direccion, idComuna)
        VALUES (@rut, @password, @nombre, @apellido, @telefono, @correo, @direccion, @idComuna);
        SELECT SCOPE_IDENTITY() AS idCliente;
    `;

    const result = await pool.request()
        .input("rut", sql.VarChar, data.rut)
        .input("password", sql.VarChar, data.password)
        .input("nombre", sql.VarChar, data.nombre)
        .input("apellido", sql.VarChar, data.apellido)
        .input("telefono", sql.VarChar, data.telefono)
        .input("correo", sql.VarChar, data.correo)
        .input("direccion", sql.VarChar, data.direccion)
        .input("idComuna", sql.Int, data.idComuna)
        .query(query);

    return result.recordset[0];
}
export async function buscarClientePorCorreo(correo) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("correo", sql.VarChar, correo)
        .query(`SELECT * FROM cliente WHERE correo = @correo`);
    return result.recordset[0];
}

// BUSCAR CLIENTE POR RUT
export async function buscarClientePorRut(rut) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("rut", sql.VarChar, rut)
        .query(`SELECT * FROM cliente WHERE rut = @rut`);
    return result.recordset[0];
}


// BUSCAR CLIENTE POR ID
export async function buscarClientePorId(idCliente) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idCliente", sql.Int, idCliente)
        .query(`SELECT * FROM cliente WHERE idCliente = @idCliente`);
    return result.recordset[0];
}