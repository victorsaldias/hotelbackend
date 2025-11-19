import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
dotenv.config();

import indexRoutes from "./routes/index.js";
import habitacionRoutes from "./routes/habitacionRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import reservaRoutes from "./routes/reservaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import provinciaRoutes from "./routes/provinciaRoutes.js";
import comunaRoutes from "./routes/comunaRoutes.js";
import empleadoAuthRoutes from "./routes/empleadoAuthRoutes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
    cors({
        origin: [
            "http://localhost:5500",
            "http://127.0.0.1:5500"
        ],
        credentials: true
    })
);

// 🔥 NECESARIO
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔥 SESIONES
app.use(
    session({
        secret: process.env.SESSION_SECRET || "super-secreto",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false
        }
    })
);
// RUTAS
app.use("/", indexRoutes);
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/regiones", regionRoutes);
app.use("/api/provincias", provinciaRoutes);
app.use("/api/comunas", comunaRoutes);
app.use("/api/empleados", empleadoAuthRoutes);

export default app;
