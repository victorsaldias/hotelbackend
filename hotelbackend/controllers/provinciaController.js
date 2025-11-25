import { obtenerProvinciasPorRegion } from "../model/ProvinciaModel.js";

export async function listarProvincias(req, res) {
    try {
        const { idRegion } = req.params;
        const provincias = await obtenerProvinciasPorRegion(idRegion);
        res.json(provincias);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
