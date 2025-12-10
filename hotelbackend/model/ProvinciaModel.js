import { getConnection } from "../config/dbConfig.js";

export const Provincia = {
    idProvincia: 0,
    nombre: "",
    idRegion: 0
};


export const obtenerProvinciasPorRegion = async (req, res) => {
    try {
        const { idRegion } = req.params;

        const pool = await getConnection();
        const result = await pool.request()
            .input("idRegion", idRegion)
            .query(`
                SELECT idProvincia, nombre, idRegion
                FROM provincia
                WHERE idRegion = @idRegion
            `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error obteniendo provincias" });
    }
};