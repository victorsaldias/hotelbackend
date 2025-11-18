import bcrypt from "bcryptjs";
import {
    crearCliente,
    buscarClientePorRut,
    buscarClientePorCorreo,
    buscarClientePorId
} from "../model/clienteModel.js";

function validarFormatoCorreo(correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

export async function registrarCliente(req, res) {
    try {
        const { rut, password, nombre, apellido, telefono, correo, direccion, idComuna } = req.body;

        if (!rut || !password || !nombre || !apellido || !correo) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        if (!validarFormatoCorreo(correo)) {
            return res.status(400).json({ message: "El formato del correo es inválido." });
        }

        const existe = await buscarClientePorRut(rut);
        if (existe) {
            return res.status(409).json({ message: "El RUT ya está registrado." });
        }
        
        const existeCorreo = await buscarClientePorCorreo(correo);
        if (existeCorreo) {
            return res.status(409).json({ message: "El correo ya está registrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevo = await crearCliente({
            rut,
            password: hashedPassword,
            nombre,
            apellido,
            telefono,
            correo,
            direccion,
            idComuna
        });

        res.status(201).json({
            message: "Cliente registrado correctamente",
            idCliente: nuevo.idCliente
        });

    } catch (err) {
        console.error("Error en registrarCliente:", err);
        res.status(500).json({ message: "Error interno del servidor al registrar el cliente." });
    }
}

export async function loginCliente(req, res) {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: "El correo y la contraseña son obligatorios." });
        }
        
        if (!validarFormatoCorreo(correo)) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const cliente = await buscarClientePorCorreo(correo);
        
        if (!cliente) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        const passwordValida = await bcrypt.compare(password, cliente.password);

        if (!passwordValida) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

       
        req.session.userId = cliente.idCliente;

        res.json({
            message: "Login exitoso",
            idCliente: cliente.idCliente,
            nombre: cliente.nombre,
            apellido: cliente.apellido
        });

    } catch (err) {
        console.error("Error en loginCliente:", err);
        res.status(500).json({ message: "Error interno del servidor durante el inicio de sesión." });
    }
}

export async function logoutCliente(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).json({ message: 'Error al cerrar sesión.' });
        }
        res.status(200).json({ message: 'Sesión cerrada correctamente.' });
    });
}

export async function obtenerCliente(req, res) {
    try {
        
        const id = parseInt(req.params.id, 10);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID proporcionado es inválido." });
        }

        const cliente = await buscarClientePorId(id);

        if (!cliente) return res.status(404).json({ message: "Cliente no encontrado." });

        res.json(cliente);

    } catch (err) {
        console.error("Error en obtenerCliente:", err);
        res.status(500).json({ message: "Error interno del servidor al obtener cliente." });
    }
}