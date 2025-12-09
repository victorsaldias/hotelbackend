import { getConnection } from "../config/dbConfig.js";

/* ============================================================
   INSERTAR CLIENTE
============================================================ */
export async function insertarCliente(data) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("rut", data.rut)
      .input("password", data.password)
      .input("nombre", data.nombre)
      .input("apellido", data.apellido)
      .input("telefono", data.telefono || null)
      .input("correo", data.correo || null)
      .input("direccion", data.direccion || null)
      .input("idComuna", data.idComuna || null)
      .query(`
        INSERT INTO cliente (rut, password, nombre, apellido, telefono, correo, direccion, idComuna)
        OUTPUT INSERTED.*
        VALUES (@rut, @password, @nombre, @apellido, @telefono, @correo, @direccion, @idComuna)
      `);

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ insertarCliente:", err);
    throw err;
  }
}

/* ============================================================
   CONSULTAS
============================================================ */
export async function obtenerClientePorId(idCliente) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("idCliente", idCliente)
      .query(`
        SELECT 
          c.*,
          com.nombre AS nombreComuna,
          p.nombre AS nombreProvincia,
          r.nombreRegion
        FROM cliente c
        LEFT JOIN comuna com ON c.idComuna = com.idComuna
        LEFT JOIN provincia p ON com.idProvincia = p.idProvincia
        LEFT JOIN region r ON p.idRegion = r.idRegion
        WHERE c.idCliente = @idCliente
      `);

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ obtenerClientePorId:", err);
    throw err;
  }
}

export async function obtenerClientePorRut(rut) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("rut", rut)
      .query(`SELECT * FROM cliente WHERE rut = @rut`);

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ obtenerClientePorRut:", err);
    throw err;
  }
}

export async function obtenerClientePorCorreo(correo) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("correo", correo)
      .query(`SELECT * FROM cliente WHERE correo = @correo`);

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ obtenerClientePorCorreo:", err);
    throw err;
  }
}

export async function obtenerTodosClientesDB() {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM cliente`);
    return result.recordset;

  } catch (err) {
    console.error("❌ obtenerTodosClientesDB:", err);
    throw err;
  }
}

/* ============================================================
   UPDATE
============================================================ */

export async function actualizarClientePorIdDB(idCliente, data) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("idCliente", idCliente)
      .input("password", data.password)
      .input("nombre", data.nombre)
      .input("apellido", data.apellido)
      .input("telefono", data.telefono)
      .input("correo", data.correo)
      .input("direccion", data.direccion)
      .input("idComuna", data.idComuna)
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

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ actualizarClientePorIdDB:", err);
    throw err;
  }
}

export async function actualizarClientePorRutDB(rut, data) {
  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("rut", rut)
      .input("password", data.password)
      .input("nombre", data.nombre)
      .input("apellido", data.apellido)
      .input("telefono", data.telefono)
      .input("correo", data.correo)
      .input("direccion", data.direccion)
      .input("idComuna", data.idComuna)
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

    return result.recordset[0] || null;

  } catch (err) {
    console.error("❌ actualizarClientePorRutDB:", err);
    throw err;
  }
}

export async function actualizarPassword(idCliente, hash) {
  try {
    const pool = await getConnection();

    await pool.request()
      .input("idCliente", idCliente)
      .input("password", hash)
      .query(`
        UPDATE cliente 
        SET password = @password
        WHERE idCliente = @idCliente
      `);

    return true;

  } catch (err) {
    console.error("❌ actualizarPassword:", err);
    throw err;
  }
}
