// controllers/habitacionController.js
import habitacionService from "../services/habitacionService.js";

/* ============================================================
   1) DISPONIBILIDAD / BÚSQUEDAS
============================================================ */
export async function verHabitacionesDisponibles(req, res) {
    try {
        const { idSucursal } = req.query;
        if (!idSucursal) {
            return res.status(400).json({ error: "Se requiere idSucursal" });
        }

        const habitaciones = await habitacionService.obtenerDisponibles(idSucursal);
        return res.status(200).json({ success: true, habitaciones });

    } catch (error) {
        console.error("Error verHabitacionesDisponibles:", error);
        res.status(500).json({ error: error.message });
    }
}
export async function obtenerTodasLasHabitacionesController(req, res) {
    try {
        const habitaciones = await habitacionService.listarConFiltros({});
        return res.status(200).json(habitaciones);

    } catch (error) {
        console.error("Error obtenerTodasLasHabitaciones:", error);
        return res.status(500).json({ error: error.message });
    }
}

export async function obtenerHabitacionesAdecuadas(req, res) {
    try {
        const { idSucursal, fechaInicio, fechaFin, cantidadHuespedes } = req.body;

        const habitaciones = await habitacionService.buscarAdecuadas({
            idSucursal,
            fechaInicio,
            fechaFin,
            cantidadHuespedes
        });

        return res.status(200).json({ success: true, habitaciones });

    } catch (error) {
        console.error("Error obtenerHabitacionesAdecuadas:", error);
        res.status(500).json({ error: error.message });
    }
}

export async function listarHabitaciones(req, res) {
    try {
        const result = await habitacionService.listarConFiltros(req.query);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   2) CRUD HABITACIONES
============================================================ */
export async function obtenerHabitacionIdController(req, res) {
    try {
        const habitacion = await habitacionService.obtenerPorId(req.params.idHabitacion);

        if (!habitacion) {
            return res.status(404).json({ message: "Habitación no encontrada" });
        }

        res.status(200).json(habitacion);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerHabitacionNumeroController(req, res) {
    try {
        const habitacion = await habitacionService.obtenerPorNumero(req.params.numero);

        if (!habitacion) {
            return res.status(404).json({ message: "Habitación no encontrada" });
        }

        res.status(200).json(habitacion);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function crearHabitacionController(req, res) {
    try {
        const nueva = await habitacionService.crear(req.body);
        res.status(201).json({ success: true, habitacion: nueva });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function editarHabitacionController(req, res) {
    try {
        await habitacionService.editar(req.params.idHabitacion, req.body);
        res.status(200).json({ success: true, message: "Habitación actualizada" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function actualizarEstadoHabitacionController(req, res) {
    try {
        const idHabitacion = req.params.idHabitacion;
        const { idEstadoHabitacion } = req.body;

        await habitacionService.actualizarEstado(idHabitacion, idEstadoHabitacion);

        res.status(200).json({ message: "Estado actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* ============================================================
   3) TIPOS, SERVICIOS, CARACTERÍSTICAS
============================================================ */
export async function obtenerTiposHabitacionController(req, res) {
    try {
        res.json(await habitacionService.obtenerTipos());

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerCaracteristicasController(req, res) {
    try {
        res.json(await habitacionService.obtenerCaracteristicas());

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerCaracteristicaPorIdController(req, res) {
    try {
        res.json(await habitacionService.obtenerCaracteristicaPorId(req.params.idCaracteristica));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function actualizarCaracteristicaController(req, res) {
    try {
        await habitacionService.actualizarCaracteristica(req.params.idCaracteristica, req.body);
        res.json({ message: "Característica actualizada" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerServiciosController(req, res) {
    try {
        res.json(await habitacionService.obtenerServicios());

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerServiciosHabitacionController(req, res) {
    try {
        res.json(await habitacionService.obtenerServiciosHabitacion(req.params.idHabitacion));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function actualizarServiciosHabitacionController(req, res) {
    try {
        await habitacionService.actualizarServicios(req.params.idHabitacion, req.body.servicios);
        res.json({ message: "Servicios actualizados" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerCaracteristicasTipoController(req, res) {
    try {
        const data = await habitacionService.obtenerCaracteristicasPorTipo(req.params.idTipo);
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function obtenerServiciosTipoController(req, res) {
    try {
        const data = await habitacionService.obtenerServiciosPorTipo(req.params.idTipo);
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
