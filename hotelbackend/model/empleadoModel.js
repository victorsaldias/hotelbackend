import { getConnection } from "../config/dbConfig.js";

/* =====================================================
   OBTENER TODOS LOS EMPLEADOS
===================================================== */
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
                r.nombre AS rol,
                e.idRol,
                e.idEstadoEmpleado,
                e.idSucursal,
                s.nombre AS nombreSucursal
            FROM Empleado e
            INNER JOIN Rol r ON e.idRol = r.idRol
            LEFT JOIN Sucursal s ON e.idSucursal = s.idSucursal
            ORDER BY e.idEmpleado DESC
        `);
        return result.recordset;
    } catch (error) {
        console.error("❌ Error en obtenerTodosLosEmpleados:", error);
        throw error;
    }
}


/* =====================================================
   OBTENER EMPLEADO POR ID
===================================================== */
export async function obtenerEmpleadoPorIdModel(idEmpleado) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("idEmpleado", idEmpleado)
            .query(`
                SELECT 
                    e.idEmpleado,
                    e.rut,
                    e.nombre,
                    e.apellido,
                    e.correo,
                    r.nombre AS rol,
                    e.idRol,
                    e.idEstadoEmpleado,
                    e.idSucursal
                FROM Empleado e
                INNER JOIN Rol r ON e.idRol = r.idRol
                WHERE e.idEmpleado = @idEmpleado
            `);
        return result.recordset[0] || null;
    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorIdModel:", error);
        throw error;
    }
}


/* =====================================================
   CREAR EMPLEADO
===================================================== */
export async function crearEmpleadoModel(empleado) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("rut", empleado.rut)
            .input("nombre", empleado.nombre)
            .input("apellido", empleado.apellido)
            .input("correo", empleado.correo)
            .input("password", empleado.password)
            .input("idRol", empleado.idRol)
            .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
            .input("idSucursal", empleado.idSucursal)
            .query(`
                INSERT INTO Empleado 
                (rut, nombre, apellido, correo, password, idRol, idEstadoEmpleado, idSucursal)
                OUTPUT INSERTED.idEmpleado
                VALUES (@rut, @nombre, @apellido, @correo, @password, @idRol, @idEstadoEmpleado, @idSucursal)
            `);
        return result.recordset[0];
    } catch (error) {
        console.error("❌ Error en crearEmpleadoModel:", error);
        throw error;
    }
}


/* =====================================================
   ACTUALIZAR EMPLEADO
===================================================== */
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
                .input("idRol", empleado.idRol)
                .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
                .input("idSucursal", empleado.idSucursal)
                .query(`
                    UPDATE Empleado
                    SET rut = @rut,
                        nombre = @nombre,
                        apellido = @apellido,
                        correo = @correo,
                        password = @password,
                        idRol = @idRol,
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
                .input("idRol", empleado.idRol)
                .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
                .input("idSucursal", empleado.idSucursal)
                .query(`
                    UPDATE Empleado
                    SET rut = @rut,
                        nombre = @nombre,
                        apellido = @apellido,
                        correo = @correo,
                        idRol = @idRol,
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


/* =====================================================
   ELIMINAR EMPLEADO (DESACTIVAR)
===================================================== */
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


/* =====================================================
   BUSCAR EMPLEADOS
===================================================== */
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
                    r.nombre AS rol,
                    e.idRol,
                    e.idEstadoEmpleado,
                    e.idSucursal,
                    s.nombre AS nombreSucursal
                FROM Empleado e
                INNER JOIN Rol r ON e.idRol = r.idRol
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
