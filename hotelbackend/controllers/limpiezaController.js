import { obtenerEstadoHabitaciones, iniciarLimpiezaHabitacion, terminarLimpiezaHabitacion } from "../model/limpiezaModel.js";

export async function listarEstadosHabitaciones(req, res) {
    try {
        const data = await obtenerEstadoHabitaciones();
        return res.status(200).json({
            success: true,
            habitaciones: data
        });
    } catch (error) {
        console.error("❌ Error en listarEstadosHabitaciones:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener estados de limpieza"
        });
    }
}

export async function iniciarLimpieza(req, res) {
    try {
        console.log("📥 Body recibido:", req.body);
        const { idHabitacion, idEmpleado, descripcion } = req.body;
        
        if (!idHabitacion || !idEmpleado) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos requeridos" 
            });
        }
        
        await iniciarLimpiezaHabitacion(idHabitacion, idEmpleado, descripcion);
        return res.status(200).json({ 
            success: true, 
            message: "Limpieza iniciada correctamente" 
        });
    } catch (error) {
        console.error("❌ Error en iniciarLimpieza:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error al iniciar limpieza",
            error: error.message 
        });
    }
}

export async function terminarLimpieza(req, res) {
    try {
        console.log("📥 Body recibido:", req.body);
        const { idHabitacion, idEmpleado, descripcion } = req.body;
        
        if (!idHabitacion || !idEmpleado) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos requeridos" 
            });
        }
        
        await terminarLimpiezaHabitacion(idHabitacion, idEmpleado, descripcion);
        return res.status(200).json({ 
            success: true, 
            message: "Limpieza terminada correctamente" 
        });
    } catch (error) {
        console.error("❌ Error en terminarLimpieza:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error al terminar limpieza",
            error: error.message 
        });
    }
}