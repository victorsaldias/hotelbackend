import {
    obtenerHabitacionesDisponibles,
    obtenerHabitacionPorId,
    obtenerHabitacionPorNumero,
    crearHabitacion,
    obtenerTodasLasHabitaciones,
    obtenerPrecioHabitacion,
    asignarHabitacion,
    listarConFiltros,
    obtenerCaracteristicasPorTipo,
    obtenerServiciosPorTipo,
    obtenerTiposHabitacion,
    obtenerCaracteristicas,
    obtenerCaracteristicaPorId,
    actualizarCaracteristica,
    obtenerServicios,
    obtenerServiciosHabitacion,
    actualizarEstadoHabitacion,
    actualizarServiciosHabitacionModel,
    buscarHabitacionesPorCapacidadYFechas,
    editarHabitacionModel
} from "../model/habitacionModel.js";

export async function verHabitacionesDisponibles(req, res) {
    try {
        const { idSucursal } = req.query;

        
        if (!idSucursal) {
            return res.status(400).json({ 
                error: 'Se requiere el ID de sucursal' 
            });
        }

        const habitaciones = await obtenerHabitacionesDisponibles(idSucursal);
        res.json(habitaciones);
        
    } catch (err) {
        console.error('Error en verHabitacionesDisponibles:', err);
        res.status(500).json({ error: err.message });
    }
}


export async function obtenerHabitacionesAdecuadas(req, res) {
    try {
        let { idSucursal, fechaInicio, fechaFin, cantidadHuespedes } = req.body;

        idSucursal = Number(idSucursal);
        cantidadHuespedes = Number(cantidadHuespedes);

        
        console.log("FINAL →", idSucursal, fechaInicio, fechaFin);

        const habitaciones = await buscarHabitacionesPorCapacidadYFechas(
            idSucursal,
            fechaInicio,   
            fechaFin,      
            cantidadHuespedes
        );
console.log("======== DEBUG BUSQUEDA HABITACIONES ========");
console.log("Sucursal:", idSucursal);
console.log("Fecha Inicio (recibida):", fechaInicio);
console.log("Fecha Fin (recibida):", fechaFin);
console.log("Tipo:", typeof fechaInicio, typeof fechaFin);
console.log("=============================================");
        return res.status(200).json({
            success: true,
            habitaciones
        });

    } catch (error) {
        console.error("❌ Error en obtenerHabitacionesAdecuadas:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al buscar habitaciones"
        });
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


export async function obtenerPrecioHabitacion(idHabitacion) {
    const conn = await getConnection();

    const result = await conn.request()
        .input("idHabitacion", idHabitacion)
        .query(`
            SELECT precio 
            FROM habitacion 
            WHERE idHabitacion = @idHabitacion
        `);

    if (result.recordset.length === 0) return 0;

    return result.recordset[0].precio;
}


export async function obtenerTiposHabitacionController(req, res) {
    try {
        res.json(await obtenerTiposHabitacion());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


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


export const obtenerCaracteristicasTipoController = async (req, res) => {
    const { idTipo } = req.params;

    try {
        const data = await obtenerCaracteristicasPorTipo(idTipo);
        res.json(data);

    } catch (error) {
        console.error("Error obteniendo características por tipo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const obtenerServiciosTipoController = async (req, res) => {
    const { idTipo } = req.params;

    try {
        const data = await obtenerServiciosPorTipo(idTipo);
        res.json(data);

    } catch (error) {
        console.error("Error obteniendo servicios por tipo:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export async function editarHabitacionController(req, res) {
    try {
        await editarHabitacionModel(req.params.idHabitacion, req.body);
        res.json({ message: "Habitación editada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
