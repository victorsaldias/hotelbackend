import express from "express";
import {
    crearClienteWeb,
    crearClienteRecepcionista,
    obtenerCliente,
    modificarCliente,
    obtenerTodosLosClientes,
    obtenerClientePorIdController,
    modificarClientePorId
} from "../controllers/clienteController.js";

const router = express.Router();

// 👉 PRIMERO LAS RUTAS MÁS ESPECÍFICAS
router.get("/id/:idCliente", obtenerClientePorIdController);
router.put("/id/:idCliente", modificarClientePorId);

router.get("/", obtenerTodosLosClientes);

router.post("/web", crearClienteWeb);
router.post("/recepcion", crearClienteRecepcionista);


// 👉 DESPUÉS LAS GENÉRICAS POR RUT
router.get("/:rut", obtenerCliente);
router.put("/:rut", modificarCliente);

export default router;