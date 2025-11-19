import { obtenerRegiones } from "../model/Region.js";

export async function listarRegiones(req, res) {
    try {
        const regiones = await obtenerRegiones();
        res.json(regiones);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
