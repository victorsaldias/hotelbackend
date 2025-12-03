import express from 'express';
import {
  crearReservaCompleta,
    traerReservas,
    confirmarReservaController,
    cancelarReservaController,
    traerHistorialReservas,
    modificarReservaController,
    modificarHabitacionReservaController,
    cambiarEstadoReservaController

} from '../controllers/reservaController.js';

const router = express.Router();    

// Crear reserva completa
router.post('/completa', crearReservaCompleta);

// Obtener todas las reservas
router.get('/', traerReservas);

// Confirmar reserva
router.post('/confirmar/:idReserva', confirmarReservaController);

// Cancelar reserva
router.post('/cancelar/:idReserva', cancelarReservaController);

// Ver historial de reservas de un cliente
router.get('/cliente/:idCliente', traerHistorialReservas);

// Modificar reserva
router.put('/:idReserva', modificarReservaController);

//Modificar habitacion de una reserva
router.put('/habitacion/:idReserva', modificarHabitacionReservaController);

router.put("/cambiar-estado/:idReserva", cambiarEstadoReservaController);


export default router;