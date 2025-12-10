import express from "express";
import { listarProvinciasPorRegion } from "../controllers/provinciaController.js";

const router = express.Router();

router.get("/por-region/:idRegion", listarProvinciasPorRegion);

export default router;