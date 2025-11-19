import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const header = req.headers["authorization"];

  if (!header) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Guardar datos del usuario en la solicitud
    next();
  } catch (error) {
    res.status(403).json({ message: "Token inválido" });
  }
}

// Middleware de rol
export function permitirRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: "No tienes permiso para acceder" });
    }
    next();
  };
}