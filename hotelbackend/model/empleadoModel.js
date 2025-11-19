import { getConnection } from "../config/dbConfig.js";

export async function buscarEmpleadoPorCorreo(correo) {
    const pool = await getConnection();
    
    const result = await pool.request()
        .input("correo", correo)
        .query(`
            SELECT * 
            FROM empleado
            WHERE correo = @correo
        `);

    return result.recordset[0];
}

export async function crearEmpleadoBD(data) {
    const { rut, correo, password, nombre, apellido, rol, idEstadoEmpleado, idSucursal } = data;

    const pool = await getConnection();

    await pool.request()
        .input("rut", rut)
        .input("correo", correo)
        .input("password", password)
        .input("nombre", nombre)
        .input("apellido", apellido)
        .input("rol", rol)
        .input("idEstadoEmpleado", idEstadoEmpleado)
        .input("idSucursal", idSucursal)
        .query(`
            INSERT INTO empleado (rut, correo, password, nombre, apellido, rol, idEstadoEmpleado, idSucursal)
            VAgiLUES (@rut, @correo, @password, @nombre, @apellido, @rol, @idEstadoEmpleado, @idSucursal)
        `);
}

export async function listarEmpleadosBD() {
    const pool = await getConnection();
    const result = await pool.request()
        .query(`
            SELECT * FROM empleado
        `);
    return result.recordset;
}

