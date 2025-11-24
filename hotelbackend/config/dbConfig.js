import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

console.log("Cargando variables .env:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_PORT:", process.env.DB_PORT);

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        useUTC: true,
        tdsVersion: "7_4"
    }
};

export async function getConnection() {
    try {
        console.log("Intentando conectar al SQL Server...");
        const pool = await sql.connect(dbConfig);
        console.log("Conexión exitosa al SQL Server.");
        return pool;
    } catch (error) {
        console.log("Error conectando a la BD:", error);
        throw error;
    }
}

export default dbConfig;