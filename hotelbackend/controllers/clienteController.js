import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import {
  insertarCliente,
  obtenerClientePorRut,
  actualizarCliente,
  obtenerTodosClientesDB,
  actualizarClientePorIdDB,
  obtenerClientePorId,
  actualizarPassword
} from "../model/clienteModel.js";

function limpiarRut(rut) {
  return rut.replace(/\./g, "").replace(/-/g, "");
}


export async function cambiarPasswordController(req, res) {
    try {
        const { idCliente } = req.params;
        const { passwordActual, passwordNueva } = req.body;

        const cliente = await obtenerClientePorId(idCliente);
        if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

        const coincide = await bcrypt.compare(passwordActual, cliente.password);
        if (!coincide) {
            return res.status(400).json({ message: "Contraseña actual incorrecta" });
        }

        const hash = await bcrypt.hash(passwordNueva, 10);
        await actualizarPassword(idCliente, hash);

        res.json({ message: "Contraseña actualizada correctamente" });

    } catch (err) {
        console.error("Error al cambiar contraseña:", err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}


export const crearClienteWeb = async (req, res) => {
  try {
      const nuevoCliente = req.body;

      if (!nuevoCliente.rut || !nuevoCliente.correo || !nuevoCliente.password) {
          return res.status(400).json({ 
            message: "RUT, correo y contraseña son obligatorios." 
          });
      }

      const hashedPassword = await bcrypt.hash(nuevoCliente.password, 10);

      const cliente = await insertarCliente({
        ...nuevoCliente,
        password: hashedPassword
      });

      return res.status(201).json({
        message: "Cuenta creada exitosamente",
        cliente
      });

  } catch (error) {
      console.error("ERROR CREAR CLIENTE WEB:", error);
      return res.status(500).json({ 
        message: "Error al crear cuenta",
        error: error.message
      });
  }
};


export const crearClienteRecepcionista = async (req, res) => {
  try {
      const nuevoCliente = req.body;

      if (!nuevoCliente.rut || !nuevoCliente.correo) {
          return res.status(400).json({
            message: "RUT y correo son obligatorios."
          });
      }

      
      const rutLimpio = limpiarRut(nuevoCliente.rut);
      const passwordFinal = rutLimpio + "123";

      const hashedPassword = await bcrypt.hash(passwordFinal, 10);

      
      const cliente = await insertarCliente({
        ...nuevoCliente,
        password: hashedPassword
      });

      const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});


    
      await transporter.sendMail({
        from: `"Hotel Arellano" <${process.env.EMAIL_USER}>`,
        to: nuevoCliente.correo,
        subject: "Bienvenido al Hotel Arellano - Credenciales de acceso",
        html: `
          <h2>Hola ${nuevoCliente.nombre} ${nuevoCliente.apellido},</h2>

          <p>Tu cuenta ha sido creada exitosamente por nuestro equipo de recepción.</p>

          <p>Tu contraseña provisional es:</p>
          
          <p style="font-size:18px;font-weight:bold;">${passwordFinal}</p>

          <p>Por motivos de seguridad, te recomendamos cambiar esta contraseña en tu primer inicio de sesión.</p>

          <br>
          <p>Atentamente,<br>Hotel Arellano</p>
        `
      });

      
      return res.status(201).json({
        message: "Cliente registrado correctamente. Correo enviado.",
        cliente
      });

  } catch (error) {
      console.error("ERROR REGISTRO RECEPCIONISTA:", error);
      return res.status(500).json({
        message: "Error al registrar cliente desde recepción",
        error: error.message
      });
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
      return res.status(500).json({ 
        message: "Error al obtener cliente",
        error: error.message
      });
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
      return res.status(500).json({ 
        message: "Error al actualizar cliente",
        error: error.message
      });
  }
};

export const obtenerTodosLosClientes = async (req, res) => {
  try {
      const clientes = await obtenerTodosClientesDB();
      return res.status(200).json(clientes);

  } catch (error) {
      return res.status(500).json({
        message: "Error al obtener clientes",
        error: error.message
      });
  }
};

export const obtenerClientePorIdController = async (req, res) => {
  try {
      const { idCliente } = req.params;
      const cliente = await obtenerClientePorId(idCliente);

      if (!cliente) {
          return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json(cliente);

  } catch (error) {
      console.error("ERROR obtenerClientePorId:", error);   // 👈 AGREGA ESTO
      return res.status(500).json({
        message: "Error al obtener cliente por ID",
        error: error.message
      });
  }
};


export const modificarClientePorId = async (req, res) => {
  try {
      const { idCliente } = req.params;
      const datosActualizados = req.body;

      // Si llega password nueva, la encriptamos
      if (datosActualizados.password) {
          datosActualizados.password = await bcrypt.hash(datosActualizados.password, 10);
      }

      const clienteActualizado = await actualizarClientePorIdDB(idCliente, datosActualizados);

      if (!clienteActualizado) {
          return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res.status(200).json({
        message: "Cliente actualizado exitosamente",
        cliente: clienteActualizado
      });

  } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar cliente por ID",
        error: error.message
      });
  }
};

