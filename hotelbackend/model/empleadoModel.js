import { getConnection } from "../config/dbConfig.js";
import sql from "mssql";

export async function buscarEmpleadoPorCorreo(correo) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("correo", sql.VarChar, correo)
        .query(`
            SELECT idEmpleado, rut, password, nombre, apellido, rol, idSucursal, correo
            FROM empleado
            WHERE correo = @correo
        `);

    return result.recordset[0];
}
