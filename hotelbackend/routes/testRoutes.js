import express from "express";
import { getConnection } from "../config/dbConfig.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT GETDATE() AS fecha;");
        res.json({
            success: true,
            azure: "Conexión exitosa a Azure SQL",
            result: result.recordset
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
