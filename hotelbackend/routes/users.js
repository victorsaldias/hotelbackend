import express from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("Ruta de usuarios funcionando ✅");
});

export default router;