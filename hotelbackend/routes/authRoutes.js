import express from "express";
import { loginCliente } from "../controller/authController.js";

const router = express.Router();

router.post("/login", loginCliente);

export default router;