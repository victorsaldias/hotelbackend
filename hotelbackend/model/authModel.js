import { getConnection } from "../config/dbConfig.js";
import sql from "mssql";

export async function buscarClientePorCorreo(correo) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("correo", sql.VarChar, correo)
        .query("SELECT * FROM cliente WHERE correo = @correo");

    return result.recordset[0];
}
