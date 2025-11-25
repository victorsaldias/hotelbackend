import express from "express";
import { listarRoles, agregarRol, borrarRol } from "../controllers/rolController.js";
import { verificarToken, permitirRol } from "../middlewares/auth.js";

const router = express.Router();

// LISTAR ROLES (Solo Admin)
router.get("/",
    verificarToken,
    permitirRol("Administrador"),
    listarRoles
);

// CREAR ROL (Solo Admin)
router.post("/crear",
    verificarToken,
    permitirRol("Administrador"),
    agregarRol
);

// ELIMINAR ROL (Solo Admin)
router.delete("/eliminar/:idRol",
    verificarToken,
    permitirRol("Administrador"),
    borrarRol
);

export default router;
