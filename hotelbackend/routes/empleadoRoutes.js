import express from "express";
import {
  loginEmpleado,
  crearEmpleado,
  listarEmpleados,
  modificarEmpleado,
  suspenderEmpleado,
  cambiarPasswordEmpleado
} from "../controllers/empleadoController.js";

import { verificarToken, permitirRol } from "../middlewares/auth.js";

const router = express.Router();

//LOGIN EMPLEADO 
router.post("/login", loginEmpleado);

// CREAR EMPLEADO (ADMIN)
router.post(
  "/crear",
  verificarToken,
  permitirRol("Administrador"),
  crearEmpleado
);
// LISTAR EMPLEADOS (ADMIN)
router.get(
  "/",
  verificarToken,
  permitirRol("Administrador"),
  listarEmpleados
);

// MODIFICAR EMPLEADO (ADMIN)
router.put(
  "/modificar/:idEmpleado",
  verificarToken,
  permitirRol("Administrador"),
  modificarEmpleado
);

// SUSPENDER EMPLEADO (ADMIN)
router.put(
  "/suspender/:idEmpleado",
  verificarToken,
  permitirRol("Administrador"),
  suspenderEmpleado
);

// CAMBIAR PASSWORD EMPLEADO (AUTENTICADO)
router.put(
  "/cambiar-password",
  verificarToken, // solo autenticado
  cambiarPasswordEmpleado
);

export default router;
