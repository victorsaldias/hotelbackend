import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: { encrypt: true, trustServerCertificate: true }
};

export async function testConexion() {
  try {
    const conn = await sql.connect(dbConfig);
    console.log("✅ Conexión exitosa a la base de datos");
    return conn;
  } catch (error) {
    console.log("❌ Error de conexión:", error.message);
  }
}

export default dbConfig;        