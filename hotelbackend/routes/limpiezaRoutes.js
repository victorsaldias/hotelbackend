import express from "express";
import { listarEstadosHabitaciones, iniciarLimpieza, terminarLimpieza } from "../controllers/limpiezaController.js";

const router = express.Router();

router.get("/habitaciones", listarEstadosHabitaciones);
router.post("/iniciar", iniciarLimpieza);
router.post("/terminar", terminarLimpieza);

export default router;