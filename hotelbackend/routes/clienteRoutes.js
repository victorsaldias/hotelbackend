import express from "express";
import {
    crearClienteWeb,
    crearClienteRecepcionista,
    obtenerCliente,
    modificarCliente,
    obtenerTodosLosClientes
} from "../controllers/clienteController.js";

const router = express.Router();



router.get("/", obtenerTodosLosClientes);


router.post("/web", crearClienteWeb);


router.post("/recepcion", crearClienteRecepcionista);


router.get("/:rut", obtenerCliente);


router.put("/:rut", modificarCliente);

export default router;
