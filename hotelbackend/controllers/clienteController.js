import bcrypt from "bcrypt";
import {
  insertarCliente,
  obtenerClientePorRut,
  actualizarCliente
} from "../model/clienteModel.js";

import { obtenerTodosClientesDB } from "../model/clienteModel.js"; 


export const crearCliente = async (req, res) => {
  try {
      const nuevoCliente = req.body;

      if (!nuevoCliente.rut || !nuevoCliente.correo) {
          return res.status(400).json({ message: "RUT y correo son obligatorios." });
      }

      let passwordFinal = nuevoCliente.password;

      if (!passwordFinal) {
          passwordFinal = nuevoCliente.rut.replace(/\./g, "").replace("-", "") + "123";
      }

      const hashedPassword = await bcrypt.hash(passwordFinal, 10);

      const cliente = await insertarCliente({
        ...nuevoCliente,
        password: hashedPassword
      });

      return res.status(201).json({
        message: "Cliente creado exitosamente",
        cliente,
        passwordGenerada: !nuevoCliente.password ? passwordFinal : undefined
      });

  } catch (error) {
      return res.status(500).json({ message: "Error al crear cliente", error: error.message });
  }
};

export const obtenerCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      const cliente = await obtenerClientePorRut(rut);

      if (!cliente) {
          return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json(cliente);

  } catch (error) {
      return res.status(500).json({ message: "Error al obtener cliente", error: error.message });
  }
};


export const modificarCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      const datosActualizados = req.body;

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
      return res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
  }
};


export const obtenerTodosLosClientes = async (req, res) => {
  try {
      const clientes = await obtenerTodosClientesDB();
      return res.status(200).json(clientes);

  } catch (error) {
      return res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};
