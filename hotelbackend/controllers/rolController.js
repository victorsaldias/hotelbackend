import { obtenerRoles, crearRol, eliminarRol } from "../model/rolModel.js";


export async function listarRoles(req, res) {
    try {
        const roles = await obtenerRoles();
        res.json(roles);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener roles",
            error: error.message
        });
    }
}

export async function agregarRol(req, res) {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ message: "El nombre del rol es obligatorio" });
        }

        const nuevoRol = await crearRol(nombre);
        res.status(201).json({
            message: "Rol creado exitosamente",
            rol: nuevoRol
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al crear rol",
            error: error.message
        });
    }
}

export async function borrarRol(req, res) {
    try {
        const idRol = req.params.idRol;

        await eliminarRol(idRol);

        res.json({
            message: "Rol eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar rol",
            error: error.message
        });
    }
}
