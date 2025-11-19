import bcrypt from "bcrypt";
import { buscarClientePorCorreo } from "../model/authModel.js";

function validarFormatoCorreo(correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
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
