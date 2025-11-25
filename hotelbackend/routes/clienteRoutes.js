import express from "express";
import {
    crearCliente,
    obtenerCliente,
    modificarCliente               
} from "../controllers/clienteController.js";

const router = express.Router();


import { obtenerTodosLosClientes } from "../controllers/clienteController.js";
router.get("/", obtenerTodosLosClientes);

router.post("/", crearCliente);


router.get("/:rut", obtenerCliente);


router.put("/:rut", modificarCliente);

export default router;