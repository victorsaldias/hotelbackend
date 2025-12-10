import { obtenerComunasPorProvincia,
    obtenerTodasLasComunasBD,
    obtenerComunaPorIdDB,
 } from "../model/ComunaModel.js";

export async function listarComunasPorProvincia(req, res) {
    try {
        const { idProvincia } = req.params;
        const comunas = await obtenerComunasPorProvincia(idProvincia);
        res.json(comunas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Obtener TODAS las comunas
export const obtenerTodasLasComunas = async (req, res) => {
  try {
    const comunas = await obtenerTodasLasComunasBD() // método abajo
    res.status(200).json(comunas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comunas" });
  }
};

export const obtenerComunaPorId = async (req, res) => {
    try {
        const { idComuna } = req.params;

        const comuna = await obtenerComunaPorIdDB(idComuna);

        if (!comuna)
            return res.status(404).json({ message: "Comuna no encontrada" });

        res.json(comuna);

    } catch (error) {
        console.error("ERROR obtener comuna:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

export async function getComunasPorProvincia(req, res) {
    try {
        const { idProvincia } = req.params;
        const comunas = await obtenerComunasPorProvincia(idProvincia);
        return res.status(200).json(comunas);

    } catch (err) {
        console.error("❌ getComunasPorProvincia:", err);
        return res.status(500).json({ message: err.message });
    }
}