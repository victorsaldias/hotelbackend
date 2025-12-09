// controllers/clienteController.js
import {
    crearClienteWebService,
    crearClienteRecepcionService,
    cambiarPasswordService,
    actualizarClientePorIdService,
    actualizarClientePorRutService,
    obtenerClientePorIdService,
    obtenerClientePorRutService,
    obtenerTodosClientesService
} from "../services/clienteService.js";


// ============================================================
// 1) CREAR CLIENTE DESDE WEB
// ============================================================
export async function crearClienteWeb(req, res) {
    try {
        const cliente = await crearClienteWebService(req.body);
        return res.status(201).json({
            success: true,
            message: "Cuenta creada exitosamente",
            cliente
        });
    } catch (err) {
        console.error("❌ crearClienteWeb:", err);
        return res.status(400).json({ success: false, message: err.message });
    }
}


// ============================================================
// 2) CREAR CLIENTE DESDE RECEPCIÓN
// ============================================================
export async function crearClienteRecepcionista(req, res) {
    try {
        const cliente = await crearClienteRecepcionService(req.body);

        return res.status(201).json({
            success: true,
            message: "Cliente creado y correo enviado",
            cliente
        });

    } catch (error) {
        console.error("❌ crearClienteRecepcionista:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
}


// ============================================================
// 3) OBTENER CLIENTE POR ID
// ============================================================
export async function obtenerClientePorIdController(req, res) {
    try {
        const cliente = await obtenerClientePorIdService(req.params.idCliente);

        if (!cliente) {
            return res.status(404).json({ success: false, message: "Cliente no encontrado" });
        }

        return res.status(200).json(cliente);

    } catch (error) {
        console.error("❌ obtenerClientePorId:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


// ============================================================
// 4) OBTENER CLIENTE POR RUT
// ============================================================
export async function obtenerCliente(req, res) {
    try {
        const cliente = await obtenerClientePorRutService(req.params.rut);

        if (!cliente) {
            return res.status(404).json({ success: false, message: "Cliente no encontrado" });
        }

        return res.status(200).json(cliente);

    } catch (error) {
        console.error("❌ obtenerCliente:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


// ============================================================
// 5) ACTUALIZAR CLIENTE POR ID
// ============================================================
export async function modificarClientePorId(req, res) {
    try {
        const cliente = await actualizarClientePorIdService(
            req.params.idCliente,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Cliente actualizado exitosamente",
            cliente
        });

    } catch (error) {
        console.error("❌ modificarClientePorId:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
}


// ============================================================
// 6) ACTUALIZAR CLIENTE POR RUT
// ============================================================
export async function modificarCliente(req, res) {
    try {
        const cliente = await actualizarClientePorRutService(
            req.params.rut,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Cliente actualizado exitosamente",
            cliente
        });

    } catch (error) {
        console.error("❌ modificarCliente:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
}


// ============================================================
// 7) LISTAR TODOS LOS CLIENTES
// ============================================================
export async function obtenerTodosLosClientes(req, res) {
    try {
        const clientes = await obtenerTodosClientesService();
        return res.status(200).json(clientes);

    } catch (error) {
        console.error("❌ obtenerTodosLosClientes:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


// ============================================================
// 8) CAMBIAR PASSWORD
// ============================================================
export async function cambiarPasswordController(req, res) {
    try {
        const { idCliente } = req.params;
        const { passwordActual, passwordNueva } = req.body;

        await cambiarPasswordService(idCliente, passwordActual, passwordNueva);

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error("❌ cambiarPassword:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
}
