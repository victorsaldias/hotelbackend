import express from "express";
import { listarComunas } from "../controller/comunaController.js";

const router = express.Router();

router.get("/", listarComunas);

export default router;
