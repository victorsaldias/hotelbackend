import express from "express";
import { loginEmpleado } from "../controllers/empleadoAuthController.js";

const router = express.Router();

// Login
router.post("/login", loginEmpleado);

// Logout (sin importar función del controlador)
router.post("/logout", (req, res) => {
    console.log("🚪 Logout solicitado");
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Error al destruir sesión:", err);
            return res.status(500).json({ message: "Error al cerrar sesión" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logout exitoso" });
    });
});

// Verificar sesión
router.get("/verificar-sesion", (req, res) => {
    console.log("🔍 Verificando sesión:", {
        sessionID: req.sessionID,
        userId: req.session.userId,
        rol: req.session.rol
    });
    
    if (req.session.userId) {
        return res.json({
            autenticado: true,
            userId: req.session.userId,
            rol: req.session.rol
        });
    }
    
    return res.status(401).json({
        autenticado: false,
        message: "No hay sesión activa"
    });
});

export default router;