import { 
    ingresarReservaCompleta,
    verReservas,
    confirmarReserva,
    cancelarReserva,
    verHistorialReserva,
    modificarReserva,
    modificarHabitacionDeReserva
} from "../model/reservaModel.js";
import { getConnection } from "../config/dbConfig.js";
// ===============================================
// CREAR RESERVA COMPLETA
// ===============================================
export const crearReservaCompleta = async (req, res) => {
    try {
        const data = req.body;
        
        if (!data.fechaInicio || !data.fechaFin || !data.idCliente || !data.idHabitacion) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Convertir string "YYYY-MM-DD" a fecha local con hora
        function crearFechaLocal(fechaStr, hora) {
            const [y, m, d] = fechaStr.split("-").map(Number);
            return new Date(y, m - 1, d, hora, 0, 0, 0);
        }

        const checkIn = crearFechaLocal(data.fechaInicio, 14);
        const checkOut = crearFechaLocal(data.fechaFin, 12);

        data.fechaInicio = checkIn;
        data.fechaFin = checkOut;

        const pool = await getConnection();

        // =======================
        // DEBUG
        // =======================
        console.log("===== DEBUG RESERVA =====");
        console.log("ID HAB:", data.idHabitacion);
        console.log("CHECK-IN:", data.fechaInicio);
        console.log("CHECK-OUT:", data.fechaFin);

        const debugQuery = await pool.request()
            .input("idHabitacion", data.idHabitacion)
            .query(`
                SELECT r.idReserva, r.fechaInicio, r.fechaFin, r.idEstadoReserva
                FROM reservaHabitacion rh
                INNER JOIN reserva r ON r.idReserva = rh.idReserva
                WHERE rh.idHabitacion = @idHabitacion
            `);

        console.log("RESERVAS QUE EXISTEN EN BD PARA ESTA HAB:", debugQuery.recordset);
        console.log("===========================");

        // =======================
        // VALIDAR SOLAPAMIENTO
        // =======================
        const conflicto = await pool.request()
    .input("idHabitacion", data.idHabitacion)
    .input("fechaInicio", data.fechaInicio)
    .input("fechaFin", data.fechaFin)
    .query(`
        SELECT 1
        FROM reservaHabitacion rh
        INNER JOIN reserva r ON r.idReserva = rh.idReserva
        WHERE rh.idHabitacion = @idHabitacion
        AND r.idEstadoReserva IN (1,2)
        AND NOT (
            r.fechaFin <= @fechaInicio  -- checkout anterior al checkin nuevo
            OR
            r.fechaInicio >= @fechaFin  -- checkin posterior al checkout nuevo
        )
    `);

        if (conflicto.recordset.length > 0) {
            return res.status(400).json({
                error: "La habitación ya está reservada en ese rango de fechas."
            });
        }

        // Crear reserva
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


// ===============================================
// VER TODAS LAS RESERVAS
// ===============================================
export async function traerReservas(req, res) {
    try {
        const reservas = await verReservas();
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// ===============================================
// CONFIRMAR RESERVA
// ===============================================
export async function confirmarReservaController(req, res) {
    try {
        const { idEmpleado } = req.body;
        await confirmarReserva(req.params.idReserva, idEmpleado);
        res.json({ mensaje: "Reserva confirmada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// ===============================================
// CANCELAR RESERVA
// ===============================================
export async function cancelarReservaController(req, res) {
    try {
        await cancelarReserva(req.params.idReserva);
        res.json({ mensaje: "Reserva cancelada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// ===============================================
// HISTORIAL DEL CLIENTE
// ===============================================
export async function traerHistorialReservas(req, res) {
    try {
        const historial = await verHistorialReserva(req.params.idCliente);
        res.json(historial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// ===============================================
// MODIFICAR RESERVA
// ===============================================
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


// ===============================================
// MODIFICAR HABITACIÓN
// ===============================================
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