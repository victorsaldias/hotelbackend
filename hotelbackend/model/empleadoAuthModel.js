import { getConnection } from "../config/dbConfig.js";

export async function buscarEmpleadoPorCorreo(correo) {
    try {
        console.log(" Buscando empleado:", correo);

        const pool = await getConnection();
        
        const result = await pool.request()
            .input("correo", correo)
            .query(`
                SELECT 
                    e.idEmpleado, 
                    e.nombre, 
                    e.apellido, 
                    e.correo, 
                    e.password, 
                    e.idRol,
                    r.nombre AS rolNombre,
                    e.idEstadoEmpleado, 
                    e.idSucursal
                FROM empleado e
                INNER JOIN rol r ON r.idRol = e.idRol
                WHERE e.correo = @correo 
                  AND e.idEstadoEmpleado = 1
            `);

        const empleado = result.recordset[0] || null;
        console.log("Resultado:", empleado ? "Encontrado" : "No encontrado");

        return empleado;

    } catch (error) {
        console.error("❌ Error en buscarEmpleadoPorCorreo:", error);
        throw error;
    }
}
