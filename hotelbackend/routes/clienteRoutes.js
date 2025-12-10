import express from "express";

import {
    crearClienteWeb,
    crearClienteRecepcionista,
    obtenerCliente,
    obtenerTodosLosClientes,
    obtenerClientePorIdController,
    modificarCliente,
    modificarClientePorId,
    cambiarPasswordController
} from "../controllers/clienteController.js";

const router = express.Router();

// RUTAS POR ID
router.get("/id/:idCliente", obtenerClientePorIdController);
router.put("/id/:idCliente", modificarClientePorId);
router.put("/cambiar-password/:idCliente", cambiarPasswordController);

// CREAR CLIENTES
router.post("/web", crearClienteWeb);
router.post("/recepcion", crearClienteRecepcionista);

// LISTAR
router.get("/", obtenerTodosLosClientes);

// RUTAS POR RUT
router.get("/rut/:rut", obtenerCliente);
router.put("/rut/:rut", modificarCliente);

export default router;
