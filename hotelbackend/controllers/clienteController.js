import bcrypt from "bcrypt";
import {
  insertarCliente,
  obtenerClientePorRut,
  actualizarCliente
} from "../model/clienteModel.js";


// CREAR CLIENTE
export const crearCliente = async (req, res) => {
  try {
      const nuevoCliente = req.body;

      // Validar datos obligatorios
      if (!nuevoCliente.rut || !nuevoCliente.correo || !nuevoCliente.password) {
          return res.status(400).json({
            message: "RUT, correo y contraseña son obligatorios."
          });

      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(nuevoCliente.password, 10);

      const cliente = await insertarCliente({
        ...nuevoCliente,
        password: hashedPassword
      });

      return res.status(201).json({
        message: "Cliente creado exitosamente",
        cliente
      });

  } catch (error) {
      return res.status(500).json({
        message: "Error al crear cliente",
        error: error.message
      });
  }
};


// OBTENER CLIENTE POR RUT
export const obtenerCliente = async (req, res) => {
  try {
      const rut = req.params.rut;

      const cliente = await obtenerClientePorRut(rut);

      if (!cliente) {
          return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json(cliente);

  } catch (error) {
      return res.status(500).json({
        message: "Error al obtener cliente",
        error: error.message
      });
  }
};


// MODIFICAR CLIENTE
export const modificarCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      const datosActualizados = req.body;

      // Si viene una nueva contraseña, la hasheamos
      if (datosActualizados.password) {
          datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
      }

      const clienteActualizado = await actualizarCliente(rut, datosActualizados);

      if (!clienteActualizado) {
          return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json({
        message: "Cliente actualizado exitosamente",
        cliente: clienteActualizado
      });

  } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar cliente",
        error: error.message
      });
  }
};
