import { 
    ingresarReservaCompleta,
    verReservas,
    confirmarReserva,
    cancelarReserva,
    verHistorialReserva,
    modificarReserva,
    modificarHabitacionDeReserva
} from "../model/reservaModel.js";

/* ============================================================
   CREAR RESERVA COMPLETA (USADO POR reserva.js)
============================================================ */
export const crearReservaCompleta = async (req, res) => {
    try {
        const data = req.body;

        // Validar que vengan datos mínimos
        if (!data.fechaInicio || !data.fechaFin || !data.idCliente || !data.idHabitacion) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Llamar al modelo
        const resultado = await ingresarReservaCompleta(data);

        return res.status(201).json({
            msg: "Reserva creada correctamente",
            reserva: resultado
        });

    } catch (error) {
        console.error("Error en crearReservaCompleta:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

/* ============================================================
   VER TODAS LAS RESERVAS
============================================================ */
export async function traerReservas(req, res) {
    try {
        const { idReserva } = req.params;
        const reservas = await verReservas(idReserva);
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   CONFIRMAR RESERVA
============================================================ */
export async function confirmarReservaController(req, res) {
    try {
        const { idEmpleado } = req.body;
        await confirmarReserva(req.params.idReserva, idEmpleado);
        res.json({ mensaje: "Reserva confirmada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   CANCELAR RESERVA
============================================================ */
export async function cancelarReservaController(req, res) {
    try {
        await cancelarReserva(req.params.idReserva);
        res.json({ mensaje: "Reserva cancelada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   HISTORIAL DEL CLIENTE
============================================================ */
export async function traerHistorialReservas(req, res) {
    try {
        const historial = await verHistorialReserva(req.params.idCliente);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   MODIFICAR RESERVA COMPLETA
============================================================ */
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

/* ============================================================
   MODIFICAR HABITACIÓN DE LA RESERVA
============================================================ */
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