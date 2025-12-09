// controllers/reservaController.js
import {
    crearReservaService,
    obtenerReservasService,
    confirmarReservaService,
    cancelarReservaService,
    historialReservaService,
    modificarReservaService,
    modificarHabitacionService,
    cambiarEstadoReservaService
} from "../services/reservaService.js";

/* ============================================================
   CREAR RESERVA COMPLETA (carrito)
============================================================ */
export const crearReservaCompleta = async (req, res) => {
    console.log("======== RESERVA RECIBIDA ========");
    console.log(req.body);
    console.log("==================================");

    try {
        const reserva = await crearReservaService(req.body);

        return res.status(201).json({
            msg: "Reserva creada correctamente",
            reserva
        });

    } catch (error) {
        console.error("Error en crearReservaCompleta:", error);
        return res.status(400).json({ error: error.message });
    }
};

/* ============================================================
   OBTENER RESERVAS (sucursal opcional)
============================================================ */
export async function traerReservas(req, res) {
    try {
        const { idSucursal } = req.query;
        const reservas = await obtenerReservasService(idSucursal);
        return res.json(reservas);
    } catch (error) {
        console.error("Error en traerReservas:", error);
        return res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   CONFIRMAR / CANCELAR
============================================================ */
export async function confirmarReservaController(req, res) {
    try {
        const { idEmpleado } = req.body;
        await confirmarReservaService(req.params.idReserva, idEmpleado);
        return res.json({ mensaje: "Reserva confirmada" });
    } catch (error) {
        console.error("Error confirmarReserva:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function cancelarReservaController(req, res) {
    try {
        await cancelarReservaService(req.params.idReserva);
        return res.json({ mensaje: "Reserva cancelada" });
    } catch (error) {
        console.error("Error cancelarReserva:", error);
        return res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   HISTORIAL DEL CLIENTE
============================================================ */
export async function traerHistorialReservas(req, res) {
    try {
        const historial = await historialReservaService(req.params.idCliente);
        return res.json(historial);
    } catch (error) {
        console.error("Error traerHistorialReservas:", error);
        return res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   MODIFICAR RESERVA (fechas)
============================================================ */
export async function modificarReservaController(req, res) {
    try {
        const { idReserva } = req.params;
        await modificarReservaService(idReserva, req.body);
        return res.json({ mensaje: "Reserva modificada correctamente" });
    } catch (error) {
        console.error("Error modificarReserva:", error);
        return res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   MODIFICAR HABITACIÓN DE LA RESERVA
============================================================ */
export async function modificarHabitacionReservaController(req, res) {
    try {
        const { idReserva } = req.params;
        const { idHabitacion } = req.body;
        await modificarHabitacionService(idReserva, idHabitacion);
        return res.json({ mensaje: "Habitación de la reserva modificada correctamente" });
    } catch (error) {
        console.error("Error modificarHabitacionReserva:", error);
        return res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   CAMBIAR ESTADO RESERVA
============================================================ */
export const cambiarEstadoReservaController = async (req, res) => {
    try {
        const { idReserva } = req.params;
        const { idEstadoReserva } = req.body;

        await cambiarEstadoReservaService(idReserva, idEstadoReserva);

        return res.json({ msg: "Estado actualizado correctamente" });

    } catch (error) {
        console.error("Error cambiando estado:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
