import { getConnection } from "../config/dbConfig.js";

// INSERTAR CLIENTE
export async function insertarCliente(data) {

  const {
    rut,
    password,
    nombre,
    apellido,
    telefono = null,
    correo = null,
    direccion = null,
    idComuna = null
  } = data;

  const pool = await getConnection();

  const result = await pool.request()
    .input("rut", rut)
    .input("password", password)
    .input("nombre", nombre)
    .input("apellido", apellido)
    .input("telefono", telefono)
    .input("correo", correo)
    .input("direccion", direccion)
    .input("idComuna", idComuna)
    .query(`
      INSERT INTO cliente (rut, password, nombre, apellido, telefono, correo, direccion, idComuna)
      OUTPUT INSERTED.*
      VALUES (@rut, @password, @nombre, @apellido, @telefono, @correo, @direccion, @idComuna)
    `);

  return result.recordset[0];
}
// OBtener cliente por bd
export async function obtenerClientePorId(idCliente) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("idCliente", idCliente)
        .query(`
            SELECT 
                c.idCliente,
                c.rut,
                c.password,            -- 👈 NECESARIO para validar cambios de contraseña
                c.nombre,
                c.apellido,
                c.telefono,
                c.correo,
                c.direccion,
                c.idComuna,
                com.nombre AS nombreComuna,
                p.idProvincia,
                p.nombre AS nombreProvincia,
                r.idRegion,
                r.nombreRegion
            FROM cliente c
            LEFT JOIN comuna com ON c.idComuna = com.idComuna
            LEFT JOIN provincia p ON com.idProvincia = p.idProvincia
            LEFT JOIN region r ON p.idRegion = r.idRegion
            WHERE c.idCliente = @idCliente
        `);

    return result.recordset[0];
}


// ACTUALIZAR CLIENTE POR ID
export async function actualizarClientePorIdDB(idCliente, data) {
  const pool = await getConnection();

  // Traemos los datos actuales para no pisar con NULL
  const actual = await obtenerClientePorId(idCliente);
  if (!actual) return null;

  const {
    password = actual.password,
    nombre = actual.nombre,
    apellido = actual.apellido,
    telefono = actual.telefono,
    correo = actual.correo,
    direccion = actual.direccion,
    idComuna = actual.idComuna
  } = data;

  const result = await pool.request()
    .input("idCliente", idCliente)
    .input("password", password)
    .input("nombre", nombre)
    .input("apellido", apellido)
    .input("telefono", telefono)
    .input("correo", correo)
    .input("direccion", direccion)
    .input("idComuna", idComuna)
    .query(`
      UPDATE cliente
      SET 
        password  = @password,
        nombre    = @nombre,
        apellido  = @apellido,
        telefono  = @telefono,
        correo    = @correo,
        direccion = @direccion,
        idComuna  = @idComuna
      WHERE idCliente = @idCliente;

      SELECT * FROM cliente WHERE idCliente = @idCliente;
    `);

  return result.recordset[0];
}

// ACTUALIZAR CLIENTE POR RUT
export async function actualizarCliente(rut, data) {
  const {
    password,
    nombre,
    apellido,
    telefono = null,
    correo = null,
    direccion = null,
    idComuna = null
  } = data;

  const pool = await getConnection();

  const result = await pool.request()
    .input("rut", rut)
    .input("password", password)
    .input("nombre", nombre)
    .input("apellido", apellido)
    .input("telefono", telefono)
    .input("correo", correo)
    .input("direccion", direccion)
    .input("idComuna", idComuna)
    .query(`
      UPDATE cliente
      SET 
        password = @password,
        nombre = @nombre,
        apellido = @apellido,
        telefono = @telefono,
        correo = @correo,
        direccion = @direccion,
        idComuna = @idComuna
      WHERE rut = @rut;

      SELECT * FROM cliente WHERE rut = @rut;
    `);

  return result.recordset[0];
}
export async function obtenerTodosClientesDB() {
  const pool = await getConnection();

  const result = await pool.request()
    .query("SELECT * FROM cliente");

  return result.recordset;
}

export async function actualizarPassword(idCliente, passwordHash) {
    const pool = await getConnection();
    await pool.request()
        .input("idCliente", idCliente)
        .input("password", passwordHash)
        .query(`
            UPDATE cliente 
            SET password = @password
            WHERE idCliente = @idCliente
        `);
}
// OBTENER CLIENTE POR RUT
export async function obtenerClientePorRut(rut) {
    const pool = await getConnection();

    const result = await pool.request()
        .input("rut", rut)
        .query(`
            SELECT *
            FROM cliente
            WHERE rut = @rut
        `);

    return result.recordset[0] || null;
}