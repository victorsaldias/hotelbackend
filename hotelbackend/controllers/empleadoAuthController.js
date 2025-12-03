import bcrypt from "bcrypt";
import { buscarEmpleadoPorCorreo } from "../model/empleadoAuthModel.js";
import jwt from "jsonwebtoken";

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

function normalizarRol(rol) {
    const roles = {
        'administrador': 'admin',
        'recepcionista': 'recepcionista',
        'aseo': 'aseo'
    };
    return roles[rol.toLowerCase()] || rol.toLowerCase();
}

export async function loginEmpleado(req, res) {
    const { correo, password } = req.body;

    try {
        // Buscar empleado por correo
        const empleado = await buscarEmpleadoPorCorreo(correo);

        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        // Validar contraseña
        const passwordValida = await bcrypt.compare(password, empleado.password);

        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar token con datos del empleado + rol
        const token = jwt.sign({
            idEmpleado: empleado.idEmpleado,
            idRol: empleado.idRol,
            rolNombre: empleado.rolNombre
        }, process.env.JWT_SECRET, { expiresIn: "8h" });

        // Respuesta final
        res.json({
            message: "Login exitoso",
            empleado: {
                idEmpleado: empleado.idEmpleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                correo: empleado.correo,
                idRol: empleado.idRol,
                rolNombre: empleado.rolNombre,
                idSucursal: empleado.idSucursal 
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Error en login",
            error: error.message
        });
    }
}
