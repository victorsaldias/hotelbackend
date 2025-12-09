// middleware/auth.js
import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { idEmpleado, idRol, rolNombre, rol, ... }
    next();
  } catch (error) {
    console.error("❌ Error al verificar token:", error);
    return res.status(403).json({ message: "Token inválido" });
  }
}


// Middleware de rol
export function permitirRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Soportamos varias formas: rol, rolNombre, idRol
    const rolUsuario = req.user.rol || req.user.rolNombre || req.user.idRol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ message: "No tienes permiso para acceder" });
    }

    next();
  };
}