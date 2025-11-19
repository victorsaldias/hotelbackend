import express from "express";
import { loginCliente } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginCliente);

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logout exitoso" });
    });
});

export default router;