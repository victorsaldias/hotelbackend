import bcrypt from "bcryptjs";
import {
  insertarCliente,
  obtenerClientePorRut,
  actualizarCliente
} from "../model/clienteModel.js";


export const crearCliente = async (req, res) => {
  try {
      let nuevoCliente = req.body;

     
      if (!nuevoCliente.password || !nuevoCliente.rut) {
          return res.status(400).json({ message: "RUT y contraseña son obligatorios." });
      }

      
      const passwordHash = await bcrypt.hash(nuevoCliente.password, 10);
      nuevoCliente.password = passwordHash;

      const cliente = await insertarCliente(nuevoCliente);

      res.status(201).json({
        message: "Cliente creado exitosamente",
        cliente
      });

  } catch (error) {
      res.status(500).json({
        message: "Error al crear el cliente",
        error: error.message
      });
  }
};


export const obtenerCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      const cliente = await obtenerClientePorRut(rut);

      if (cliente) {
          res.status(200).json(cliente);
      } else {
          res.status(404).json({ message: "Cliente no encontrado" });
      }

  } catch (error) {
      res.status(500).json({
        message: "Error al obtener el cliente",
        error: error.message
      });
  }
};


export const modificarCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      let datosActualizados = req.body;

      
      if (datosActualizados.password) {
          const passwordHash = await bcrypt.hash(datosActualizados.password, 10);
          datosActualizados.password = passwordHash;
      }

      const clienteActualizado = await actualizarCliente(rut, datosActualizados);

      if (clienteActualizado) {
          res.status(200).json({
            message: "Cliente actualizado exitosamente",
            cliente: clienteActualizado
          });
      } else {
          res.status(404).json({ message: "Cliente no encontrado" });
      }

  } catch (error) {
      res.status(500).json({
        message: "Error al actualizar el cliente",
        error: error.message
      });
  }
};
