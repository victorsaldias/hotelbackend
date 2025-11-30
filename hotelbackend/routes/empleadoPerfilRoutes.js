import express from "express";
import { getPerfilEmpleado, updatePerfilEmpleado } from "../controllers/empleadoPerfilController.js";

const router = express.Router();

router.get("/perfil/:idEmpleado", getPerfilEmpleado);
router.put("/perfil/:idEmpleado", updatePerfilEmpleado);

export default router;
