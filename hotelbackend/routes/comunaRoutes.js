import express from "express";
import { listarComunasPorProvincia } from "../controllers/comunaController.js";

const router = express.Router();

router.get("/:idProvincia", listarComunasPorProvincia);

export default router;