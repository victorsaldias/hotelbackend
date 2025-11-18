import express from 'express';
import {
  verHabitacionesDisponibles,
  listarHabitaciones,
  obtenerHabitacionIdController,
  obtenerHabitacionNumeroController,
  obtenerTodasLasHabitacionesController,
  crearHabitacionController,
  actualizarEstadoHabitacionController,
  asignarHabitacionController

} from '../controller/habitacionController.js';

const router = express.Router();

// Listar habitaciones con filtros
router.get('/', listarHabitaciones);

// Habitaciones disponibles
router.get('/disponibles', verHabitacionesDisponibles);

// Obtener habitación por ID
router.get('/id/:idHabitacion', obtenerHabitacionIdController);

// Obtener habitación por número
router.get('/numero/:numero', obtenerHabitacionNumeroController);

// Obtener todas las habitaciones
router.get('/todas', obtenerTodasLasHabitacionesController);

// Crear habitación
router.post('/', crearHabitacionController);

// Actualizar estado de habitación
router.put('/estado/:numero', actualizarEstadoHabitacionController);

// Asignar habitación (ejemplo adicional)
router.put('/asignar/:numero', asignarHabitacionController);

export default router;


