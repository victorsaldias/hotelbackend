import { getConnection } from "../config/dbConfig.js";


// ======================================================
// BASE QUERY (para evitar duplicación)
// ======================================================
const EMPLEADO_SELECT_BASE = `
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


// ======================================================
// OBTENER TODOS LOS EMPLEADOS
// ======================================================
export async function obtenerTodosLosEmpleados(idSucursal) {
    try {
        const pool = await getConnection();

        let query = EMPLEADO_SELECT_BASE;

        if (idSucursal) {
            query += " WHERE e.idSucursal = @idSucursal";
        }

        query += " ORDER BY e.idEmpleado DESC";

        const request = pool.request();

        if (idSucursal) {
            request.input("idSucursal", parseInt(idSucursal));
        }

        const result = await request.query(query);
        return result.recordset;

    } catch (error) {
        console.error("❌ Error en obtenerTodosLosEmpleados:", error);
        throw error;
    }
}



// ======================================================
// OBTENER EMPLEADO POR ID
// ======================================================
export async function obtenerEmpleadoPorIdModel(idEmpleado) {
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("idEmpleado", idEmpleado)
            .query(`
                ${EMPLEADO_SELECT_BASE}
                WHERE e.idEmpleado = @idEmpleado
            `);

        return result.recordset[0] || null;

    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorIdModel:", error);
        throw error;
    }
}



// ======================================================
// CREAR EMPLEADO
// ======================================================
export async function crearEmpleadoModel(empleado) {
    try {
        const {
            rut,
            nombre,
            apellido,
            correo,
            password,
            idRol,
            idEstadoEmpleado,
            idSucursal
        } = empleado;

        const pool = await getConnection();

        const result = await pool.request()
            .input("rut", rut)
            .input("nombre", nombre)
            .input("apellido", apellido)
            .input("correo", correo)
            .input("password", password)
            .input("idRol", idRol)
            .input("idEstadoEmpleado", idEstadoEmpleado)
            .input("idSucursal", idSucursal)
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



// ======================================================
// ACTUALIZAR EMPLEADO — sin duplicación
// ======================================================
export async function actualizarEmpleadoModel(idEmpleado, empleado) {
    try {
        const {
            rut,
            nombre,
            apellido,
            correo,
            password,         // puede venir o no
            idRol,
            idEstadoEmpleado,
            idSucursal
        } = empleado;

        const pool = await getConnection();

        const request = pool.request()
            .input("idEmpleado", idEmpleado)
            .input("rut", rut)
            .input("nombre", nombre)
            .input("apellido", apellido)
            .input("correo", correo)
            .input("idRol", idRol)
            .input("idEstadoEmpleado", idEstadoEmpleado)
            .input("idSucursal", idSucursal);

        let query = `
            UPDATE empleado
            SET 
                rut = @rut,
                nombre = @nombre,
                apellido = @apellido,
                correo = @correo,
                idRol = @idRol,
                idEstadoEmpleado = @idEstadoEmpleado,
                idSucursal = @idSucursal
        `;

        if (password) {
            query += `, password = @password`;
            request.input("password", password);
        }

        query += ` WHERE idEmpleado = @idEmpleado;`;

        await request.query(query);

        return true;

    } catch (error) {
        console.error("❌ Error en actualizarEmpleadoModel:", error);
        throw error;
    }
}



// ======================================================
// ELIMINAR EMPLEADO (soft delete)
// ======================================================
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



// ======================================================
// BUSCAR EMPLEADOS
// ======================================================
export async function buscarEmpleadosModel(termino, idSucursal) {
    try {
        const pool = await getConnection();

        let query = `
            ${EMPLEADO_SELECT_BASE}
            WHERE (
                e.nombre LIKE @termino
                OR e.apellido LIKE @termino
                OR e.correo LIKE @termino
                OR e.rut LIKE @termino
            )
        `;

        const request = pool.request()
            .input("termino", `%${termino}%`);

        if (idSucursal) {
            query += " AND e.idSucursal = @idSucursal";
            request.input("idSucursal", parseInt(idSucursal));
        }

        query += " ORDER BY e.idEmpleado DESC";

        const result = await request.query(query);
        return result.recordset;

    } catch (error) {
        console.error("❌ Error en buscarEmpleadosModel:", error);
        throw error;
    }
}
