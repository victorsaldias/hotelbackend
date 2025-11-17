import {obtenerHabitacionesDisponibles} from '../model/habitacionModel.js';

export async function verHabitacionesDisponibles (req, res) {
    try {
        const habitaciones = await obtenerHabitacionesDisponibles();
        res.status(200).json(habitaciones);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener habitaciones disponibles', error: error.message});
    };
}

