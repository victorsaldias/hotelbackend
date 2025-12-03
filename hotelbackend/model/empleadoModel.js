import { getConnection } from "../config/dbConfig.js";


export async function obtenerTodosLosEmpleados(idSucursal) { 
    try {
        const pool = await getConnection();
        
        let query = `
            SELECT 
                e.idEmpleado,
                e.rut,
                e.nombre,
                e.apellido,
                e.correo,
                e.idRol,
                r.nombre AS rolNombre,
                e.idEstadoEmpleado,
                e.idSucursal,
                s.nombre AS nombreSucursal
            FROM empleado e
            LEFT JOIN sucursal s ON e.idSucursal = s.idSucursal
            LEFT JOIN rol r ON e.idRol = r.idRol
        `;
        
        
        if (idSucursal) {
            query += ` WHERE e.idSucursal = @idSucursal`;
        }
        
        query += ` ORDER BY e.idEmpleado DESC`;
        
        const request = pool.request();
        
        if (idSucursal) {
            request.input('idSucursal', parseInt(idSucursal));
        }
        
        const result = await request.query(query);
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
                INSERT INTO empleado 
                (rut, nombre, apellido, correo, password, idRol, idEstadoEmpleado, idSucursal)
                OUTPUT INSERTED.idEmpleado
                VALUES 
                (@rut, @nombre, @apellido, @correo, @password, @idRol, @idEstadoEmpleado, @idSucursal)
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
                .input("idRol", empleado.idRol)
                .input("idEstadoEmpleado", empleado.idEstadoEmpleado)
                .input("idSucursal", empleado.idSucursal)
                .query(`
                    UPDATE empleado
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
                    UPDATE empleado
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


export async function eliminarEmpleadoModel(idEmpleado) {
    try {
        const pool = await getConnection();
        await pool.request()
            .input("idEmpleado", idEmpleado)
            .query(`
                UPDATE empleado
                SET idEstadoEmpleado = 4
                WHERE idEmpleado = @idEmpleado
            `);
        return true;
    } catch (error) {
        console.error("❌ Error en eliminarEmpleadoModel:", error);
        throw error;
    }
}


export async function buscarEmpleadosModel(termino, idSucursal) { 
    try {
        const pool = await getConnection();
        
        let query = `
            SELECT 
                e.idEmpleado,
                e.rut,
                e.nombre,
                e.apellido,
                e.correo,
                e.idRol,
                r.nombre AS rolNombre,
                e.idEstadoEmpleado,
                e.idSucursal,
                s.nombre AS nombreSucursal
            FROM empleado e
            LEFT JOIN sucursal s ON e.idSucursal = s.idSucursal
            LEFT JOIN rol r ON e.idRol = r.idRol
            WHERE 
                (e.nombre LIKE @termino
                OR e.apellido LIKE @termino
                OR e.correo LIKE @termino
                OR e.rut LIKE @termino)
        `;
        
        
        if (idSucursal) {
            query += ` AND e.idSucursal = @idSucursal`;
        }
        
        query += ` ORDER BY e.idEmpleado DESC`;
        
        const request = pool.request()
            .input("termino", `%${termino}%`);
        
        if (idSucursal) {
            request.input('idSucursal', parseInt(idSucursal));
        }
        
        const result = await request.query(query);
        return result.recordset;

    } catch (error) {
        console.error("❌ Error en buscarEmpleadosModel:", error);
        throw error;
    }
}
