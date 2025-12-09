import express from "express";
import { metricasController } from "../controllers/metricasController.js";

const router = express.Router();

router.get("/", metricasController);

export default router;
