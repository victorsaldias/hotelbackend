// controllers/authController.js
import {
  loginEmpleadoService,
  loginClienteService
} from "../services/authService.js";


// =========================
// LOGIN EMPLEADO
// =========================
export async function loginEmpleado(req, res) {
  try {
    const { empleado, token } = await loginEmpleadoService(req.body);

    return res.status(200).json({
      message: "Login exitoso",
      empleado,
      token
    });

  } catch (error) {
    console.error("❌ Error en loginEmpleado:", error);
    // 404 vs 401 da igual para el front, mando 401 cuando son credenciales
    return res.status(401).json({
      message: error.message || "Error en login de empleado"
    });
  }
}


// =========================
// LOGIN CLIENTE
// =========================
export async function loginCliente(req, res) {
  try {
    const { cliente, token } = await loginClienteService(req.body);

    // Mantengo tu lógica de sesión por compatibilidad
    req.session.userId = cliente.idCliente;

    return res.status(200).json({
      message: "Login exitoso",
      idCliente: cliente.idCliente,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      token,             // 👈 lo puedes ignorar en el front si no lo necesitas todavía
      cliente            // extra si después quieres más datos
    });

  } catch (error) {
    console.error("❌ Error en loginCliente:", error);
    return res.status(401).json({
      message: error.message || "Error en login de cliente"
    });
  }
}
