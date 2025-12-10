import express from "express";
import {
    listarComunasPorProvincia,
    obtenerComunaPorId,
    obtenerTodasLasComunas,
    getComunasPorProvincia
} from "../controllers/comunaController.js";

const router = express.Router();

// RUTAS ESPECÍFICAS PRIMERO
router.get("/por-provincia/:idProvincia", listarComunasPorProvincia);
router.get("/id/:idComuna", obtenerComunaPorId);
router.get("/provincia/:idProvincia", getComunasPorProvincia);
// TODAS LAS COMUNAS
router.get("/", obtenerTodasLasComunas);

export default router;
