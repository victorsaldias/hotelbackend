import { obtenerPerfilEmpleado, actualizarPerfilEmpleado } from "../model/empleadoPerfilModel.js";

export async function getPerfilEmpleado(req, res) {
    try {
        const { idEmpleado } = req.params;
        const empleado = await obtenerPerfilEmpleado(idEmpleado);

        if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });

        res.json(empleado);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener perfil", error: error.message });
    }
}

export async function updatePerfilEmpleado(req, res) {
    try {
        const { idEmpleado } = req.params;
        const actualizado = await actualizarPerfilEmpleado(idEmpleado, req.body);

        if (!actualizado) return res.status(404).json({ message: "Empleado no encontrado" });

        res.json({ message: "Perfil actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
    }
}
