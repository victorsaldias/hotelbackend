import { obtenerSucursales as obtenerSucursalesModel } from "../model/sucursalModel.js";

export async function obtenerSucursales(req, res) {
    try {
        const sucursales = await obtenerSucursalesModel();
        res.status(200).json(sucursales);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener sucursales",
            error: error.message
        });
    }
}

export async function listarSucursales(req, res) {
    try {
        const sucursales = await obtenerSucursales();
        res.status(200).json(sucursales);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener sucursales",
            error: error.message
        });
    }
}
