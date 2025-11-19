import express from "express";
import {
    crearCliente,
    obtenerCliente,
    modificarCliente               
} from "../controllers/clienteController.js";

const router = express.Router();

// Crear cliente
router.post("/", crearCliente);

// Obtener cliente por RUT
router.get("/:rut", obtenerCliente);

// Modificar cliente por RUT
router.put("/:rut", modificarCliente);

export default router;
