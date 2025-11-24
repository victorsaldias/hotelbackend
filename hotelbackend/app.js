import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

console.log("📦 VARIABLES CARGADAS:");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_SERVER:", process.env.DB_SERVER);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

import router from "./routes/index.js";
import habitacionRoutes from "./routes/habitacionRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import provinciaRoutes from "./routes/provinciaRoutes.js";
import comunaRoutes from "./routes/comunaRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import sucursalRoutes from "./routes/sucursalRoutes.js";

const app = express();



// MIDDLEWARES
app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://192.168.0.16:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5000",
        "http://localhost:4000",
        "http://localhost:3000"
    ],
    credentials: true
}));

app.use(express.json()); // JSON
app.use(express.urlencoded({ extended: true })); // Formularios

app.use(session({
    secret: process.env.SESSION_SECRET || "clave-secreta-de-respaldo-muy-fuerte",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    }
}));

// RUTAS 
app.use("/", router);
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/regiones", regionRoutes);
app.use("/api/provincias", provinciaRoutes);
app.use("/api/comunas", comunaRoutes);
app.use("/api/sucursales", sucursalRoutes);

export default app;
