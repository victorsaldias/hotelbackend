import { getConnection } from "../config/dbConfig.js";
import bcrypt from "bcrypt";

export async function obtenerPerfilEmpleado(idEmpleado) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("idEmpleado", idEmpleado)
        .query(`
            SELECT 
                idEmpleado,
                rut,
                nombre,
                apellido,
                correo
            FROM empleado
            WHERE idEmpleado = @idEmpleado
        `);

    return result.recordset[0];
}

export async function actualizarPerfilEmpleado(idEmpleado, data) {
    const pool = await getConnection();

    let updateQuery = "correo = @correo";
    const request = pool.request()
        .input("idEmpleado", idEmpleado)
        .input("correo", data.correo);

    if (data.password && data.password.trim() !== "") {
        const hashed = await bcrypt.hash(data.password, 10);
        updateQuery += ", password = @password";
        request.input("password", hashed);
    }

    const result = await request.query(`
        UPDATE empleado
        SET ${updateQuery}
        WHERE idEmpleado = @idEmpleado
    `);

    return result.rowsAffected[0] > 0;
}
