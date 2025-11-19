import { getConnection } from "../config/dbConfig.js";

export async function buscarClientePorCorreo(correo) {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("correo", correo)
            .query(`
                SELECT *
                FROM cliente
                WHERE correo = @correo
            `);

        console.log("Resultado cliente:", result.recordset); // <-- DEBUG

        return result.recordset[0] || null;
    } catch (error) {
        console.error("Error en buscarClientePorCorreo:", error);
        return null;
    }
}