import express from "express";
import {
    registrarCliente,
    loginCliente,
    obtenerCliente
} from "../controller/clienteController.js";

const router = express.Router();

router.post("/registro", registrarCliente);
router.post("/login", loginCliente);
router.get("/info/:id", obtenerCliente);

export default router;
