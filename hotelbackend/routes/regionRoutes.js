import express from "express";
import { listarRegiones } from "../controllers/regionController.js";

const router = express.Router();

router.get("/", listarRegiones); 

export default router;
