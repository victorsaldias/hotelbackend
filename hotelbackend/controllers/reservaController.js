import { ingresarReservaCompleta,
            verReservas,
            confirmarReserva,
            cancelarReserva,
            verHistorialReserva,
            modificarReserva,
            modificarHabitacionDeReserva
} from "../model/reservaModel.js";

export async function crearReservaCompleta(req, res) {
    try {
        const reserva = await ingresarReservaCompleta(req.body);
        res.json({
            mensaje: "Reserva creada correctamente",
            reserva
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function traerReservas(req, res) {
    try {
        const {idReserva} = req.params;
        const reservas = await verReservas(idReserva);
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function confirmarReservaController(req, res) {
    try {
        const { idEmpleado } = req.body;
        await confirmarReserva(req.params.idReserva, idEmpleado);
        res.json({ mensaje: "Reserva confirmada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function cancelarReservaController(req, res) {
    try {
        await cancelarReserva(req.params.idReserva);
        res.json({ mensaje: "Reserva cancelada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function traerHistorialReservas(req, res) {
    try {
        const historial = await verHistorialReserva(req.params.idCliente);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function modificarReservaController(req, res) {
    try {
        const { idReserva } = req.params;
        const datosActualizados = req.body;
        await modificarReserva(idReserva, datosActualizados);
        res.json({ mensaje: "Reserva modificada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function modificarHabitacionReservaController(req, res) {
    try {
        const { idReserva } = req.params;
        const { idHabitacion } = req.body;
        await modificarHabitacionDeReserva(idReserva, idHabitacion);
        res.json({ mensaje: "Habitación de la reserva modificada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
