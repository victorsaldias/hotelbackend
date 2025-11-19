import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; 
dotenv.config();

import router from "./routes/index.js";
import habitacionRoutes from "./routes/habitacionRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import provinciaRoutes from "./routes/provinciaRoutes.js";
import comunaRoutes from "./routes/comunaRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";


const app = express();

app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://192.168.0.16:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5000',
        'http://localhost:4000',
        'http://localhost:3000'
    ],
    credentials: true
}));


app.use(
    session({
        secret: process.env.SESSION_SECRET || "clave-secreta-de-respaldo-muy-fuerte",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false
        }
    })
);


app.use("/", router);
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/regiones", regionRoutes);
app.use("/api/provincias", provinciaRoutes);
app.use("/api/comunas", comunaRoutes);

export default app;
