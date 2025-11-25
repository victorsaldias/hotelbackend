import { obtenerRegiones } from "../model/RegionModel.js";

export async function listarRegiones(req, res) {
    try {
        const regiones = await obtenerRegiones();
        res.json(regiones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
