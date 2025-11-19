import { Router } from "express";
import { loginEmpleado, obtenerSesion } from "../controller/empleadoAuthController.js";

const router = Router();

router.post("/login", loginEmpleado);
router.get("/sesion", obtenerSesion);

export default router;
