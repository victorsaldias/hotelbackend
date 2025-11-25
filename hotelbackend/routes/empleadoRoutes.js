import express from "express";
import {
    obtenerEmpleados,
    obtenerEmpleadoPorId,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    buscarEmpleados
} from "../controllers/empleadoController.js";

const router = express.Router();


router.get("/", obtenerEmpleados);


router.get("/buscar", buscarEmpleados);


router.get("/:id", obtenerEmpleadoPorId);


router.post("/", crearEmpleado);

router.put("/:id", actualizarEmpleado);


router.delete("/:id", eliminarEmpleado);

export default router;