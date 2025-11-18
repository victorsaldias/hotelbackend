import bcrypt from "bcryptjs";
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

        // Comparar contraseña
        const coincide = await bcrypt.compare(password, cliente.password);

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
