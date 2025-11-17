import express from 'express';
import {verHabitacionesDisponibles} from '../controller/habitacionController.js';

const router = express.Router();

// Ruta para obtener habitaciones disponibles
router.get('/disponibles', verHabitacionesDisponibles);
export default router;
