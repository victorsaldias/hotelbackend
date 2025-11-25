import { getConnection } from "../config/dbConfig.js";

export async function obtenerTodosLosEmpleados() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                e.idEmpleado,
                e.rut,
                e.nombre,
                e.apellido,
                e.correo,
                e.rol,
                e.idEstadoEmpleado,
                e.idSucursal,
                s.nombre AS nombreSucursal
            FROM Empleado e
            LEFT JOIN Sucursal s ON e.idSucursal = s.idSucursal
            ORDER BY e.idEmpleado DESC
        `);
        return result.recordset;
    } catch (error) {
        console.error("❌ Error en obtenerTodosLosEmpleados:", error);
        throw error;
    }
}

export async function obtenerEmpleadoPorIdModel(idEmpleado) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("idEmpleado", idEmpleado)
            .query(`
                SELECT 
                    idEmpleado,
                    rut,
                    nombre,
                    apellido,
                    correo,
                    rol,
                    idEstadoEmpleado,
                    idSucursal
                FROM Empleado
                WHERE idEmpleado = @idEmpleado
            `);
        return result.recordset[0] || null;
    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorIdModel:", error);
        throw error;
    }
}

export async function crearEmpleadoModel(empleado) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("rut", empleado.rut)
            .input("nombre", empleado.nombre)
            .input("apellido", empleado.apellido)
            .input("correo", empleado.correo)
            .input("password", empleado.password)
            .input("rol", empleado.rol)
            .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
            .input("idSucursal", empleado.idSucursal)
            .query(`
                INSERT INTO Empleado (rut, nombre, apellido, correo, password, rol, idEstadoEmpleado, idSucursal)
                OUTPUT INSERTED.idEmpleado
                VALUES (@rut, @nombre, @apellido, @correo, @password, @rol, @idEstadoEmpleado, @idSucursal)
            `);
        return result.recordset[0];
    } catch (error) {
        console.error("❌ Error en crearEmpleadoModel:", error);
        throw error;
    }
}

export async function actualizarEmpleadoModel(idEmpleado, empleado) {
    try {
        const pool = await getConnection();
        
        if (empleado.password) {
            await pool.request()
                .input("idEmpleado", idEmpleado)
                .input("rut", empleado.rut)
                .input("nombre", empleado.nombre)
                .input("apellido", empleado.apellido)
                .input("correo", empleado.correo)
                .input("password", empleado.password)
                .input("rol", empleado.rol)
                .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
                .input("idSucursal", empleado.idSucursal)
                .query(`
                    UPDATE Empleado
                    SET rut = @rut,
                        nombre = @nombre,
                        apellido = @apellido,
                        correo = @correo,
                        password = @password,
                        rol = @rol,
                        idEstadoEmpleado = @idEstadoEmpleado,
                        idSucursal = @idSucursal
                    WHERE idEmpleado = @idEmpleado
                `);
        } else {
            await pool.request()
                .input("idEmpleado", idEmpleado)
                .input("rut", empleado.rut)
                .input("nombre", empleado.nombre)
                .input("apellido", empleado.apellido)
                .input("correo", empleado.correo)
                .input("rol", empleado.rol)
                .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
                .input("idSucursal", empleado.idSucursal)
                .query(`
                    UPDATE Empleado
                    SET rut = @rut,
                        nombre = @nombre,
                        apellido = @apellido,
                        correo = @correo,
                        rol = @rol,
                        idEstadoEmpleado = @idEstadoEmpleado,
                        idSucursal = @idSucursal
                    WHERE idEmpleado = @idEmpleado
                `);
        }
        return true;
    } catch (error) {
        console.error("❌ Error en actualizarEmpleadoModel:", error);
        throw error;
    }
}

export async function eliminarEmpleadoModel(idEmpleado) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input("idEmpleado", idEmpleado)
            .query(`
                UPDATE Empleado
                SET idEstadoEmpleado = 2
                WHERE idEmpleado = @idEmpleado
            `);
        return true;
    } catch (error) {
        console.error("❌ Error en eliminarEmpleadoModel:", error);
        throw error;
    }
}

export async function buscarEmpleadosModel(termino) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("termino", `%${termino}%`)
            .query(`
                SELECT 
                    e.idEmpleado,
                    e.rut,
                    e.nombre,
                    e.apellido,
                    e.correo,
                    e.rol,
                    e.idEstadoEmpleado,
                    e.idSucursal,
                    s.nombre AS nombreSucursal
                FROM Empleado e
                LEFT JOIN Sucursal s ON e.idSucursal = s.idSucursal
                WHERE e.nombre LIKE @termino 
                   OR e.apellido LIKE @termino 
                   OR e.correo LIKE @termino
                   OR e.rut LIKE @termino
                ORDER BY e.idEmpleado DESC
            `);
        return result.recordset;
    } catch (error) {
        console.error("❌ Error en buscarEmpleadosModel:", error);
        throw error;
    }
}
