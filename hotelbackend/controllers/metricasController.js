import { getConnection } from "../config/dbConfig.js";

export async function metricasController(req, res) {
    try {
        const conn = await getConnection();

        const suc = await conn.request().query(`
            SELECT COUNT(*) AS total FROM sucursal
        `);

        const cli = await conn.request().query(`
            SELECT COUNT(*) AS total FROM cliente
        `);

        return res.json({
            yearFundacion: 2015,
            sucursales: suc.recordset[0].total,
            clientes: cli.recordset[0].total
        });

    } catch (err) {
        console.error("Error metricas:", err);
        res.status(500).json({ error: "Error obteniendo métricas" });
    }
}