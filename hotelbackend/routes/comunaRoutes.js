import express from "express";
import { listarComunasPorProvincia,
    obtenerComunaPorId,
    obtenerTodasLasComunas
 } from "../controllers/comunaController.js";

const router = express.Router();

router.get("/:idProvincia", listarComunasPorProvincia);

router.get("/:idComuna", obtenerComunaPorId);
router.get("/", obtenerTodasLasComunas);
export default router;