import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Rutas
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

// Configurar paths correctamente (equivalente a __dirname en ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear app
const app = express();

// Configurar middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Rutas
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Capturar error 404 y pasarlo al manejador
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.send({
    error: true,
    message: err.message,
  });
});

export default app;
