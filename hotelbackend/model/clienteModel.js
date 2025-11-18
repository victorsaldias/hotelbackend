import { getConnection } from "../config/dbConfig.js";

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

export async function obtenerClientePorRut(rut) {
  const pool = await getConnection();
  
  const result = await pool.request()
    .input("rut", rut)
    .query("SELECT * FROM cliente WHERE rut = @rut");

  return result.recordset[0];
}

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
