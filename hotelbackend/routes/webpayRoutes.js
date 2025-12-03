import express from "express";
import { iniciarTransaccion, confirmarPago } from "../controllers/webpayController.js";

const router = express.Router();

router.post("/init", iniciarTransaccion);     // ← ¡ESTA ES LA QUE FALTA!
router.post("/confirmar", confirmarPago);

export default router;