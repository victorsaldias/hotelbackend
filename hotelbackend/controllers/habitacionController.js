import {
    obtenerHabitacionesDisponibles,
    obtenerHabitacionPorId,
    obtenerHabitacionPorNumero,
    crearHabitacion,
    actualizarEstadoHabitacion,
    obtenerTodasLasHabitaciones,
    obtenerPrecioHabitacion,
    asignarHabitacion,
    listarConFiltros,

    obtenerTiposHabitacion,
    obtenerCaracteristicas,
    obtenerCaracteristicaPorId,
    actualizarCaracteristica,
    obtenerServicios,
    obtenerServiciosHabitacion,
    actualizarServiciosHabitacionModel,

    editarHabitacionModel
} from "../model/habitacionModel.js";

export async function verHabitacionesDisponibles(req, res) {
    try {
        res.json(await obtenerHabitacionesDisponibles());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function listarHabitaciones(req, res) {
    try {
        res.json(await listarConFiltros(req.query));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerHabitacionIdController(req, res) {
    try {
        const hab = await obtenerHabitacionPorId(req.params.idHabitacion);
        if (!hab) return res.status(404).json({ message: "Habitación no encontrada" });
        res.json(hab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerHabitacionNumeroController(req, res) {
    try {
        const hab = await obtenerHabitacionPorNumero(req.params.numero);
        if (!hab) return res.status(404).json({ message: "Habitación no encontrada" });
        res.json(hab);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function crearHabitacionController(req, res) {
    try {
        res.json(await crearHabitacion(req.body));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function actualizarEstadoHabitacionController(req, res) {
    try {
        const ok = await actualizarEstadoHabitacion(req.params.numero, req.body.idEstadoHabitacion);
        ok ? res.json({ message: "Estado actualizado" }) : res.status(404).json({ message: "No encontrada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerTodasLasHabitacionesController(req, res) {
    try {
        res.json(await obtenerTodasLasHabitaciones());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function asignarHabitacionController(req, res) {
    try {
        await asignarHabitacion(req.body.idReserva, req.body.idHabitacion);
        res.json({ message: "Habitación asignada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerPrecioHabitacionController(req, res) {
    try {
        res.json(await obtenerPrecioHabitacion(req.params.idHabitacion));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// TIPOS HABITACIÓN
export async function obtenerTiposHabitacionController(req, res) {
    try {
        res.json(await obtenerTiposHabitacion());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// CARACTERISTICAS
export async function obtenerCaracteristicasController(req, res) {
    try {
        res.json(await obtenerCaracteristicas());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerCaracteristicaPorIdController(req, res) {
    try {
        res.json(await obtenerCaracteristicaPorId(req.params.idCaracteristica));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function actualizarCaracteristicaController(req, res) {
    try {
        await actualizarCaracteristica(req.params.idCaracteristica, req.body);
        res.json({ message: "Característica actualizada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// SERVICIOS
export async function obtenerServiciosController(req, res) {
    try {
        res.json(await obtenerServicios());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function obtenerServiciosHabitacionController(req, res) {
    try {
        res.json(await obtenerServiciosHabitacion(req.params.idHabitacion));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function actualizarServiciosHabitacionController(req, res) {
    try {
        await actualizarServiciosHabitacionModel(req.params.idHabitacion, req.body.servicios);
        res.json({ message: "Servicios actualizados" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// EDITAR HABITACIÓN GENERAL
export async function editarHabitacionController(req, res) {
    try {
        await editarHabitacionModel(req.params.idHabitacion, req.body);
        res.json({ message: "Habitación editada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
