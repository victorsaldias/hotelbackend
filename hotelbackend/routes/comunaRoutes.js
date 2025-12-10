import express from "express";
import {
    listarComunasPorProvincia,
    obtenerComunaPorId,
    obtenerTodasLasComunas
} from "../controllers/comunaController.js";

const router = express.Router();

// RUTAS ESPECÍFICAS PRIMERO
router.get("/por-provincia/:idProvincia", listarComunasPorProvincia);
router.get("/id/:idComuna", obtenerComunaPorId);

// TODAS LAS COMUNAS
router.get("/", obtenerTodasLasComunas);

export default router;
