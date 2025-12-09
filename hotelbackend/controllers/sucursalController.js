// controllers/sucursalController.js
import { obtenerSucursalesModel } from "../model/sucursalModel.js";

/**
 * Controller: lista las sucursales
 */
export async function obtenerSucursales(req, res) {
    try {
        const sucursales = await obtenerSucursalesModel();
        return res.status(200).json({
            success: true,
            sucursales
        });
        
    } catch (error) {
        console.error("❌ Error en obtenerSucursales:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener sucursales",
            error: error.message
        });
    }
}

export const listarSucursales = obtenerSucursales;