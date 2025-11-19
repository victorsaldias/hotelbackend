import express from "express";
import { listarRegiones } from "../controller/regionController.js";

const router = express.Router();

router.get("/", listarRegiones); 

export default router;
