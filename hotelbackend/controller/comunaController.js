import { getConnection } from "../config/dbConfig.js";

export async function listarComunas(req, res) {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT idComuna, nombre FROM Comuna");

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
