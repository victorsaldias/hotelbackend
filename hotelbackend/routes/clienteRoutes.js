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


// =======================
// RUTAS POR ID (seguras)
// =======================
router.get("/id/:idCliente", obtenerClientePorIdController);
router.put("/id/:idCliente", modificarClientePorId);
router.put("/cambiar-password/:idCliente", cambiarPasswordController);


// =======================
// ACCIONES ESPECÍFICAS
// =======================
router.post("/web", crearClienteWeb);
router.post("/recepcion", crearClienteRecepcionista);


// =======================
// LISTAR
// =======================
router.get("/", obtenerTodosLosClientes);


// =======================
// RUTAS POR RUT (van al final)
// =======================
router.get("/rut/:rut", obtenerCliente);
router.put("/rut/:rut", modificarCliente);

export default router;
