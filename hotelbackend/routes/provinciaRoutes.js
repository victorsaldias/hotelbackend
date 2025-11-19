import express from "express";
import { listarProvincias } from "../controller/provinciaController.js";

const router = express.Router();

router.get("/:idRegion", listarProvincias); 

export default router;
