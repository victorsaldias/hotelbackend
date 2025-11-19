import express from "express";
import { listarProvincias } from "../controllers/provinciaController.js";

const router = express.Router();

router.get("/:idRegion", listarProvincias); 

export default router;
