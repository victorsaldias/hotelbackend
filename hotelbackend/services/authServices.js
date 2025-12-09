// services/authService.js
import jwt from "jsonwebtoken";
import { comparePassword } from "./passwordServices.js";
import { buscarClientePorCorreo } from "../model/authModel.js";
import { buscarEmpleadoPorCorreo } from "../model/empleadoAuthModel.js";

function validarFormatoCorreo(correo) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(correo);
}

// ===============================
// LOGIN EMPLEADO
// ===============================
export async function loginEmpleadoService({ correo, password }) {
  if (!correo || !password) {
    throw new Error("Correo y contraseña son obligatorios.");
  }

  const empleado = await buscarEmpleadoPorCorreo(correo);

  if (!empleado) {
    throw new Error("Empleado no encontrado.");
  }

  const passwordValida = await comparePassword(password, empleado.password);

  if (!passwordValida) {
    throw new Error("Contraseña incorrecta.");
  }

  // OJO: aquí mantengo lo que tú ya usas + agrego 'rol' para compatibilidad
  const payload = {
    idEmpleado: empleado.idEmpleado,
    idRol: empleado.idRol,
    rolNombre: empleado.rolNombre,
    rol: empleado.rolNombre,      // 👈 alias para que cualquier middleware que use `rol` siga funcionando
    idSucursal: empleado.idSucursal
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h"
  });

  // No enviamos password al front
  const empleadoSafe = {
    idEmpleado: empleado.idEmpleado,
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    correo: empleado.correo,
    idRol: empleado.idRol,
    rolNombre: empleado.rolNombre,
    idSucursal: empleado.idSucursal
  };

  return { empleado: empleadoSafe, token };
}



// ===============================
// LOGIN CLIENTE
// ===============================
export async function loginClienteService({ correo, password }) {
  if (!correo || !password) {
    throw new Error("Correo y contraseña son obligatorios.");
  }

  if (!validarFormatoCorreo(correo)) {
    throw new Error("El correo tiene un formato inválido.");
  }

  const cliente = await buscarClientePorCorreo(correo);

  if (!cliente) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  const coincide = await comparePassword(password, cliente.password);

  if (!coincide) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  // Opcional: además de la sesión, generamos token por si después lo quieres usar
  const payload = {
    idCliente: cliente.idCliente,
    nombre: cliente.nombre,
    apellido: cliente.apellido
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "8h"
  });

  const clienteSafe = {
    idCliente: cliente.idCliente,
    nombre: cliente.nombre,
    apellido: cliente.apellido,
    correo: cliente.correo
  };

  return { cliente: clienteSafe, token };
}
