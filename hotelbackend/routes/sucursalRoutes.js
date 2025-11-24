import express from "express";
import { obtenerSucursales } from "../controllers/sucursalController.js";

const router = express.Router();

router.get("/", obtenerSucursales);

router

export default router;