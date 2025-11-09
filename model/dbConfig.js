import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    server : process.env.DB_SERVER,
    database : process.env.DB_DATABASE,
    port : parseInt(process.env.DB_PORT),
    options : { encrypt: true, trustServerCertificate: true }
}

//Funcion para exportar la conexion a la base de datos
export async function testConexion() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("Conexion exitosa a la base de datos");
        return pool;
    } catch (error) {
        console.log("Error de conexion a la base de datos: ", error.message);
    }
}

export default dbConfig;