import { obtenerComunasPorProvincia } from "../model/ComunaModel.js";

export async function listarComunasPorProvincia(req, res) {
    try {
        const { idProvincia } = req.params;
        const comunas = await obtenerComunasPorProvincia(idProvincia);
        res.json(comunas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
