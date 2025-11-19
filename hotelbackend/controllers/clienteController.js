import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { 
    buscarEmpleadoPorCorreo, 
    crearEmpleadoBD,
    listarEmpleadosBD,
    actualizarEmpleadoSinPassword,
    actualizarEmpleadoConPassword,
    buscarEmpleadoPorId,
    actualizarPasswordEmpleado
} from "../model/empleadoModel.js";

// Generar contraseña automática corta para nuevos empleados
function generarPasswordAutomatico() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pass = "";
    for (let i = 0; i < 6; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
}


// CREAR CLIENTE
export const crearCliente = async (req, res) => {
  try {
      const nuevoCliente = req.body;

      // Validar campos obligatorios
      if (!nuevoCliente.correo || !nuevoCliente.password || !nuevoCliente.rut) {
          return res.status(400).json({ message: "Rut, correo y contraseña son obligatorios." });
      }

      // Hashear la contraseña antes de enviarla al modelo
      const hashedPassword = await bcrypt.hash(nuevoCliente.password, 10);

      const cliente = await insertarCliente({
        ...nuevoCliente,
        password: hashedPassword   // <-- AQUI SE GUARDA EL HASH CORRECTO
      });

      res.status(201).json({ 
        message: "Cliente creado exitosamente", 
        cliente 
      });
  }
  catch (error) {
      res.status(500).json({ 
        message: "Error al crear el cliente", 
        error: error.message 
      });
  }
};

// OBTENER CLIENTE POR RUT
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

// MODIFICAR CLIENTE POR RUT
export const modificarCliente = async (req, res) => {
  try {
      const rut = req.params.rut;
      const datosActualizados = req.body;

      let passwordHasheada = datosActualizados.password;

      // Si está intentando cambiar la contraseña, se hashea
      if (datosActualizados.password) {
        passwordHasheada = await bcrypt.hash(datosActualizados.password, 10);
      }

      const clienteActualizado = await actualizarCliente(rut, {
        ...datosActualizados,
        password: passwordHasheada
      });

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


