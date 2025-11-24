import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

console.log("Cargando variables .env:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        useUTC: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

export async function getConnection() {
    try {
        console.log("Intentando conectar a Azure SQL...");
        const pool = await sql.connect(dbConfig);
        console.log("Conexión exitosa a Azure SQL.");
        return pool;
    } catch (error) {
        console.error("Error conectando a Azure SQL:", error);
        throw error;
    }
}

export default dbConfig;
