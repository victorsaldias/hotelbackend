import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { buscarClientePorCorreo} from "../model/authModel.js";
import { buscarEmpleadoPorCorreo } from "../model/empleadoAuthModel.js";


function validarFormatoCorreo(correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

export async function loginEmpleado(req, res) {
    const { correo, password } = req.body;

    try {
        const empleado = await buscarEmpleadoPorCorreo(correo);

        if (!empleado) {
            return res.status(404).json({ message: "Empleado no encontrado" });
        }

        const passwordValida = await bcrypt.compare(password, empleado.password);

        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({
            idEmpleado: empleado.idEmpleado,
            idRol: empleado.idRol,
            rolNombre: empleado.rolNombre
        }, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.json({
            message: "Login exitoso",
            empleado: {
                idEmpleado: empleado.idEmpleado,
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                idRol: empleado.idRol,
                rolNombre: empleado.rolNombre
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
export async function loginCliente(req, res) {
    try {
        const { correo, password } = req.body;

        // Validar datos obligatorios
        if (!correo || !password) {
            return res.status(400).json({ message: "Correo y contraseña son obligatorios." });
        }

        // Validar formato del correo
        if (!validarFormatoCorreo(correo)) {
            return res.status(400).json({ message: "El correo tiene un formato inválido." });
        }

        // Buscar cliente por correo
        const cliente = await buscarClientePorCorreo(correo);
 
        if (!cliente) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }
console.log("Password recibido:", password);
console.log("Password en la BD:", cliente.password);
console.log("USANDO LIBRERÍA:", bcrypt);
console.log("TIPO DE COMPARE:", typeof bcrypt.compare);
console.log("COMPARE IMPLEMENTACIÓN:", bcrypt.compare.toString());
console.log("Largo hash recibido:", cliente.password.length);
console.log("Hash recibido:", cliente.password);
        // Comparar contraseña
        const coincide = await bcrypt.compare(password, cliente.password);

console.log("Resultado de compare:", coincide);
        if (!coincide) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        // Guardar sesión
        req.session.userId = cliente.idCliente;

        return res.status(200).json({
            message: "Login exitoso",
            idCliente: cliente.idCliente,
            nombre: cliente.nombre,
            apellido: cliente.apellido
        });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
}
