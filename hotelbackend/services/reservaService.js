// services/reservaService.js
import {
    ingresarReservaCompleta,
    verReservas,
    verHistorialReserva,
    modificarReserva,
    confirmarReserva,
    cancelarReserva,
    cambiarEstadoReserva,
    guardarAcompaniante,
    validarSolapamientoHabitacion,
    modificarHabitacionDeReserva,
    agregarHabitacionAReserva
} from "../model/reservaModel.js";

import { obtenerPrecioHabitacion } from "../model/habitacionModel.js";
import { enviarCorreo } from "./emailServices.js";
import { obtenerClientePorId } from "../model/clienteModel.js";

/* ============================================================
   CALCULAR TOTAL PARA N HABITACIONES
============================================================ */
async function calcularTotalReserva(habitacionesIds, fechaInicio, fechaFin) {
    const dias = Math.ceil(
        (new Date(fechaFin) - new Date(fechaInicio)) / (1000 * 60 * 60 * 24)
    );

    let total = 0;

    for (const idHab of habitacionesIds) {
        const precio = await obtenerPrecioHabitacion(idHab);
        total += precio * dias;
    }

    return total;
}

/* ============================================================
   CREAR RESERVA COMPLETA (carrito + acompañantes + correo)
   - Compatible con formato viejo: idHabitacion
   - Formato nuevo: habitaciones: [1,2,3]
============================================================ */
export async function crearReservaService(data) {
    const {
        fechaInicio,
        fechaFin,
        idCliente,
        cantidadHuespedes = 1,
        acompanantes
    } = data;

    // Soportar ambos formatos: idHabitacion (viejo) o habitaciones[] (nuevo)
    let habitacionesIds = [];

    if (Array.isArray(data.habitaciones) && data.habitaciones.length > 0) {
        habitacionesIds = data.habitaciones.map(h => parseInt(h));
    } else if (data.idHabitacion) {
        habitacionesIds = [parseInt(data.idHabitacion)];
    }

    if (!fechaInicio || !fechaFin || !idCliente || habitacionesIds.length === 0) {
        throw new Error("Faltan datos obligatorios (fechas, cliente o habitaciones).");
    }

    // Validar solapamiento por cada habitación
    for (const idHab of habitacionesIds) {
        const hayConflicto = await validarSolapamientoHabitacion(
            idHab,
            fechaInicio,
            fechaFin
        );

        if (hayConflicto) {
            throw new Error(`La habitación ${idHab} no está disponible en ese rango.`);
        }
    }

    // Calcular total
    let total = data.total; // ← el total que enviaste desde el front

if (!total) {
    // fallback por seguridad en caso de que un dia lo necesites
    total = await calcularTotalReserva(habitacionesIds, fechaInicio, fechaFin);
}

    // Insertar cabecera de reserva
    const reserva = await ingresarReservaCompleta({
        fechaInicio,
        fechaFin,
        idCliente,
        total,
        cantidadHuespedes
    });

    const connData = { idReserva: reserva.idReserva, total };

    for (const idHab of habitacionesIds) {
    await agregarHabitacionAReserva(reserva.idReserva, idHab);
}
    // Insertar acompañantes (si vienen)
    // 🔥 SOPORTE A FORMATO ACTUAL: {0: [{tipoPersona}], 1: [{tipoPersona}]}
if (acompanantes && typeof acompanantes === "object") {
    for (const habIndex in acompanantes) {
        const lista = acompanantes[habIndex];
        if (!Array.isArray(lista)) continue;

        for (const acomp of lista) {
            if (!acomp.tipoPersona) continue;
            await guardarAcompaniante(reserva.idReserva, acomp);
        }
    }
}

    // Enviar correo de confirmación (si el cliente tiene correo)
   setTimeout(async () => {
    try {
        const cliente = await obtenerClientePorId(idCliente);

        if (cliente?.correo) {
            await enviarCorreo({
                to: cliente.correo,
                subject: "Reserva Pendiente - Hotel Arellano",
                html: `
                    <h2>Tu reserva está pendiente de confirmación</h2>
                    <p><b>Inicio:</b> ${fechaInicio}</p>
                    <p><b>Fin:</b> ${fechaFin}</p>
                    <p><b>Total:</b> $${total}</p>
                    <p>Un recepcionista la confirmará pronto.</p>
                `
            });
        }
    } catch (err) {
        console.error("❌ Error enviando correo (no afecta reserva):", err);
    }
}, 5000);
return connData;

}

/* ============================================================
   DEMÁS SERVICIOS (wrappers)
============================================================ */

export async function obtenerReservasService(idSucursal) {
    return await verReservas(idSucursal);
}

export async function historialReservaService(idCliente) {
    return await verHistorialReserva(idCliente);
}

export async function modificarReservaService(idReserva, data) {
    const { fechaInicio, fechaFin } = data;

    if (!fechaInicio || !fechaFin) {
        throw new Error("Se requieren fechaInicio y fechaFin.");
    }

    await modificarReserva(idReserva, fechaInicio, fechaFin);
}

export async function confirmarReservaService(idReserva, idEmpleado) {
    await confirmarReserva(idReserva, idEmpleado);
}

export async function cancelarReservaService(idReserva) {
    await cancelarReserva(idReserva);
}

export async function cambiarEstadoReservaService(idReserva, idEstadoReserva) {
    await cambiarEstadoReserva(idReserva, idEstadoReserva);
}

export async function modificarHabitacionService(idReserva, idHabitacion) {
    await modificarHabitacionDeReserva(idReserva, idHabitacion);
}
