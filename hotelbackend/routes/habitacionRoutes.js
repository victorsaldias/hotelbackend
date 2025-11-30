import { Router } from "express";
import {
    verHabitacionesDisponibles,
    listarHabitaciones,
    obtenerHabitacionIdController,
    obtenerHabitacionNumeroController,
    crearHabitacionController,
    actualizarEstadoHabitacionController,
    obtenerTodasLasHabitacionesController,
    asignarHabitacionController,
    obtenerPrecioHabitacionController,

    obtenerTiposHabitacionController,
    obtenerCaracteristicasController,
    obtenerCaracteristicaPorIdController,
    actualizarCaracteristicaController,

    obtenerServiciosController,
    obtenerServiciosHabitacionController,
    actualizarServiciosHabitacionController,

    editarHabitacionController
} from "../controllers/habitacionController.js";

const router = Router();

router.get("/disponibles", verHabitacionesDisponibles);
router.get("/listar", listarHabitaciones);
router.get("/id/:idHabitacion", obtenerHabitacionIdController);
router.get("/numero/:numero", obtenerHabitacionNumeroController);
router.post("/crear", crearHabitacionController);
router.put("/estado/:numero", actualizarEstadoHabitacionController);
router.get("/todas", obtenerTodasLasHabitacionesController);
router.post("/asignar", asignarHabitacionController);
router.get("/precio/:idHabitacion", obtenerPrecioHabitacionController);
router.get("/tipos-habitacion", obtenerTiposHabitacionController);

router.get("/caracteristicas-habitacion", obtenerCaracteristicasController);
router.get("/caracteristicas/:idCaracteristica", obtenerCaracteristicaPorIdController);
router.put("/caracteristicas/:idCaracteristica", actualizarCaracteristicaController);

router.get("/servicios", obtenerServiciosController);
router.get("/servicios/:idHabitacion", obtenerServiciosHabitacionController);
router.put("/servicios/:idHabitacion", actualizarServiciosHabitacionController);

router.put("/editar/:idHabitacion", editarHabitacionController);

export default router;

