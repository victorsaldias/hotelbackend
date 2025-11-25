import bcrypt from "bcrypt";
import {
    obtenerTodosLosEmpleados,
    obtenerEmpleadoPorIdModel,
    crearEmpleadoModel,
    actualizarEmpleadoModel,
    eliminarEmpleadoModel,
    buscarEmpleadosModel
} from "../model/empleadoModel.js";

/* ===============================
   OBTENER TODOS
================================ */
export async function obtenerEmpleados(req, res) {
    try {
        const empleados = await obtenerTodosLosEmpleados();
        return res.status(200).json({ success: true, empleados });
    } catch (error) {
        console.error("❌ Error en obtenerEmpleados:", error);
        return res.status(500).json({ success: false, message: "Error al obtener empleados" });
    }
}

/* ===============================
   OBTENER POR ID
================================ */
export async function obtenerEmpleadoPorId(req, res) {
    try {
        const { id } = req.params;
        const empleado = await obtenerEmpleadoPorIdModel(id);

        if (!empleado) {
            return res.status(404).json({ success: false, message: "Empleado no encontrado" });
        }

        delete empleado.password;

        return res.status(200).json({ success: true, empleado });
    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorId:", error);
        return res.status(500).json({ success: false, message: "Error al obtener empleado" });
    }
}

/* ===============================
   CREAR EMPLEADO (sin idSucursal)
================================ */
export async function crearEmpleado(req, res) {
    try {
        const { rut, nombre, apellido, correo, password, idRol } = req.body;

        // Validación sin idSucursal
        if (!rut || !nombre || !apellido || !correo || !password || !idRol) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const empleadoData = {
            rut,
            nombre,
            apellido,
            correo,
            password: passwordHash,
            idRol: parseInt(idRol),
            idEstadoEmpleado: 1,
            idSucursal: 2 // 👈 SE ASIGNA POR DEFECTO DESDE EL BACKEND
        };

        const resultado = await crearEmpleadoModel(empleadoData);

        return res.status(201).json({
            success: true,
            message: "Empleado creado exitosamente",
            idEmpleado: resultado.idEmpleado
        });

    } catch (error) {
        console.error("❌ Error en crearEmpleado:", error);
        return res.status(500).json({ success: false, message: "Error al crear empleado" });
    }
}

/* ===============================
   ACTUALIZAR EMPLEADO (sin idSucursal)
================================ */
export async function actualizarEmpleado(req, res) {
    try {
        const { id } = req.params;
        const { rut, nombre, apellido, correo, password, idRol, idEstadoEmpleado } = req.body;

        if (!rut || !nombre || !apellido || !correo || !idRol) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios"
            });
        }

        const empleadoData = {
            rut,
            nombre,
            apellido,
            correo,
            idRol: parseInt(idRol),
            idEstadoEmpleado: parseInt(idEstadoEmpleado) || 1,
            idSucursal: 2 // 👈 SE ASIGNA POR DEFECTO
        };

        if (password && password.trim() !== "") {
            empleadoData.password = await bcrypt.hash(password, 10);
        }

        await actualizarEmpleadoModel(id, empleadoData);

        return res.status(200).json({
            success: true,
            message: "Empleado actualizado exitosamente"
        });

    } catch (error) {
        console.error("❌ Error en actualizarEmpleado:", error);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar empleado"
        });
    }
}

/* ===============================
   ELIMINAR
================================ */
export async function eliminarEmpleado(req, res) {
    try {
        const { id } = req.params;

        await eliminarEmpleadoModel(id);

        return res.status(200).json({
            success: true,
            message: "Empleado eliminado exitosamente"
        });

    } catch (error) {
        console.error("❌ Error en eliminarEmpleado:", error);
        return res.status(500).json({ success: false, message: "Error al eliminar empleado" });
    }
}

/* ===============================
   BUSCAR
================================ */
export async function buscarEmpleados(req, res) {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            const empleados = await obtenerTodosLosEmpleados();
            return res.status(200).json({ success: true, empleados });
        }

        const empleados = await buscarEmpleadosModel(q);
        return res.status(200).json({ success: true, empleados });

    } catch (error) {
        console.error("❌ Error en buscarEmpleados:", error);
        return res.status(500).json({
            success: false,
            message: "Error al buscar empleados"
        });
    }
}
