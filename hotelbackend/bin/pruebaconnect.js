import { getConnection } from "../config/dbConfig.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Necesario para obtener rutas correctas al usar ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el .env desde la RAÍZ del proyecto
dotenv.config({ path: path.join(__dirname, "..", ".env") });

console.log("Cargando variables .env:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "********" : "undefined");
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_PORT:", process.env.DB_PORT);

async function testConnection() {
    try {
        const pool = await getConnection();

        const result = await pool.request().query(`
            SELECT DB_NAME() AS databaseName
        `);

        console.log("Conectado a la base de datos:");
        console.log(result.recordset);

    } catch (error) {
        console.error("❌ Error al conectarse:", error);
    }
}

testConnection();