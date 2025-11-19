import { obtenerComunasPorProvincia } from "../model/Comuna.js";

export async function listarComunasPorProvincia(req, res) {
    try {
        const { idProvincia } = req.params;
        const comunas = await obtenerComunasPorProvincia(idProvincia);
        res.json(comunas);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}
