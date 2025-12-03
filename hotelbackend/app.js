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
import empleadoAuthRoutes from "./routes/empleadoAuthRoutes.js";
import sucursalRoutes from "./routes/sucursalRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import rolRoutes from "./routes/rolRoutes.js";
import limpiezaRoutes from "./routes/limpiezaRoutes.js";
import { getConnection } from "./config/dbConfig.js";
import empleadoPerfilRoutes from "./routes/empleadoPerfilRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";
import webpayRoutes from "./routes/webpayRoutes.js";

console.log("Cargando rutas...");

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:3000",
            "http://192.168.0.16:5500"
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS bloqueado por seguridad: " + origin));
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || "clave-secreta-de-respaldo-muy-fuerte",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }
}));

app.get("/api/test", async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT GETDATE() AS fecha");
        res.json({
            ok: true,
            azure: "Conexión exitosa a Azure SQL",
            result: result.recordset
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.get("/api/test-mail", async (req, res) => {
    try {
        await transporter.sendMail({
            from: `"Hotel Arellano" <${process.env.EMAIL_USER}>`,
            to: "TUCORREO@gmail.com",
            subject: "TEST HOTEL",
            text: "El correo funciona!"
        });
        res.send("CORREO ENVIADO OK");
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

app.use("/", router);
app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/regiones", regionRoutes);
app.use("/api/provincias", provinciaRoutes);
app.use("/api/comunas", comunaRoutes);
app.use("/api/sucursales", sucursalRoutes);
app.use("/api/empleados", empleadoAuthRoutes);
app.use("/api/empleados-admin", empleadoRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/limpieza", limpiezaRoutes);
app.use("/api/empleados", empleadoPerfilRoutes);
app.use("/api/reportes",reportesRoutes)
app.use("/api/webpay", webpayRoutes);

console.log("Rutas cargadas:");
app._router.stack.forEach(r => {
    if (r.route && r.route.path) {
        console.log(r.route.stack[0].method.toUpperCase(), r.route.path);
    }
});

export default app;
