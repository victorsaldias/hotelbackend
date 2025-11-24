import bcrypt from "bcrypt";
import {
    obtenerTodosLosEmpleados,
    obtenerEmpleadoPorIdModel,
    crearEmpleadoModel,
    actualizarEmpleadoModel,
    eliminarEmpleadoModel,
    buscarEmpleadosModel
} from "../model/empleadoModel.js";


export async function obtenerEmpleados(req, res) {
    try {
        const empleados = await obtenerTodosLosEmpleados();
        return res.status(200).json({
            success: true,
            empleados
        });
    } catch (error) {
        console.error("❌ Error en obtenerEmpleados:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener empleados"
        });
    }
}


export async function obtenerEmpleadoPorId(req, res) {
    try {
        const { id } = req.params;
        const empleado = await obtenerEmpleadoPorIdModel(id);

        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: "Empleado no encontrado"
            });
        }

        
        delete empleado.password;

        return res.status(200).json({
            success: true,
            empleado
        });
    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorId:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener empleado"
        });
    }
}


export async function crearEmpleado(req, res) {
    try {
        const { rut, nombre, apellido, correo, password, rol, idSucursal } = req.body;

        
        if (!rut || !nombre || !apellido || !correo || !password || !rol || !idSucursal) {
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
            rol,
            idEstadoEmpleado: 1, 
            idSucursal: parseInt(idSucursal)
        };

        const resultado = await crearEmpleadoModel(empleadoData);

        console.log("✅ Empleado creado:", resultado.idEmpleado);

        return res.status(201).json({
            success: true,
            message: "Empleado creado exitosamente",
            idEmpleado: resultado.idEmpleado
        });
    } catch (error) {
        console.error("❌ Error en crearEmpleado:", error);
        
        if (error.message.includes("duplicate") || error.message.includes("UNIQUE")) {
            return res.status(409).json({
                success: false,
                message: "El correo o RUT ya existe"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al crear empleado"
        });
    }
}


export async function actualizarEmpleado(req, res) {
    try {
        const { id } = req.params;
        const { rut, nombre, apellido, correo, password, rol, idEstadoEmpleado, idSucursal } = req.body;

        
        if (!rut || !nombre || !apellido || !correo || !rol || !idSucursal) {
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
            rol,
            idEstadoEmpleado: parseInt(idEstadoEmpleado) || 1,
            idSucursal: parseInt(idSucursal)
        };

        if (password && password.trim() !== "") {
            empleadoData.password = await bcrypt.hash(password, 10);
        }

        await actualizarEmpleadoModel(id, empleadoData);

        console.log("✅ Empleado actualizado:", id);

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


export async function eliminarEmpleado(req, res) {
    try {
        const { id } = req.params;

        await eliminarEmpleadoModel(id);

        console.log("✅ Empleado eliminado (desactivado):", id);

        return res.status(200).json({
            success: true,
            message: "Empleado eliminado exitosamente"
        });
    } catch (error) {
        console.error("❌ Error en eliminarEmpleado:", error);
        return res.status(500).json({
            success: false,
            message: "Error al eliminar empleado"
        });
    }
}


export async function buscarEmpleados(req, res) {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            const empleados = await obtenerTodosLosEmpleados();
            return res.status(200).json({
                success: true,
                empleados
            });
        }

        const empleados = await buscarEmpleadosModel(q);

        return res.status(200).json({
            success: true,
            empleados
        });
    } catch (error) {
        console.error("❌ Error en buscarEmpleados:", error);
        return res.status(500).json({
            success: false,
            message: "Error al buscar empleados"
        });
    }
}