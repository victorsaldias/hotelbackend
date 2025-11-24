import { getConnection } from "../config/dbConfig.js";

export async function buscarEmpleadoPorCorreo(correo) {
    try {
        console.log("🔍 Buscando empleado:", correo);
        
        const pool = await getConnection();
        const result = await pool.request()
            .input("correo", correo)
            .query(`
                SELECT 
                    idEmpleado, 
                    nombre, 
                    apellido, 
                    correo, 
                    password, 
                    rol, 
                    idEstadoEmpleado, 
                    idSucursal
                FROM Empleado
                WHERE correo = @correo AND idEstadoEmpleado = 1
            `);

        const empleado = result.recordset[0] || null;
        console.log("📊 Resultado:", empleado ? "Encontrado" : "No encontrado");
        
        return empleado;
    } catch (error) {
        console.error("❌ Error en buscarEmpleadoPorCorreo:", error);
        throw error;
    }
}