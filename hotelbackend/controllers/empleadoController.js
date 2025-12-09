import {
    obtenerEmpleadosService,
    obtenerEmpleadoPorIdService,
    crearEmpleadoService,
    actualizarEmpleadoService,
    eliminarEmpleadoService,
    buscarEmpleadosService
} from "../services/empleadoService.js";


// ================================
// OBTENER TODOS LOS EMPLEADOS
// ================================
export async function obtenerEmpleados(req, res) {
    try {
        const { idSucursal } = req.query;
        const empleados = await obtenerEmpleadosService(idSucursal);

        return res.status(200).json({ success: true, empleados });

    } catch (error) {
        console.error("❌ Error en obtenerEmpleados:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}



// ================================
// OBTENER EMPLEADO POR ID
// ================================
export async function obtenerEmpleadoPorId(req, res) {
    try {
        const { id } = req.params;

        const empleado = await obtenerEmpleadoPorIdService(id);

        if (!empleado) {
            return res.status(404).json({
                success: false,
                message: "Empleado no encontrado"
            });
        }

        delete empleado.password;

        return res.status(200).json({ success: true, empleado });

    } catch (error) {
        console.error("❌ Error en obtenerEmpleadoPorId:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}



// ================================
// CREAR EMPLEADO
// ================================
export async function crearEmpleado(req, res) {
    try {
        const resultado = await crearEmpleadoService(req.body);

        return res.status(201).json({
            success: true,
            message: "Empleado creado correctamente",
            idEmpleado: resultado.idEmpleado
        });

    } catch (error) {
        console.error("❌ Error en crearEmpleado:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



// ================================
// ACTUALIZAR EMPLEADO
// ================================
export async function actualizarEmpleado(req, res) {
    try {
        const { id } = req.params;

        await actualizarEmpleadoService(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Empleado actualizado exitosamente"
        });

    } catch (error) {
        console.error("❌ Error en actualizarEmpleado:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}



// ================================
// ELIMINAR EMPLEADO
// ================================
export async function eliminarEmpleado(req, res) {
    try {
        const { id } = req.params;

        await eliminarEmpleadoService(id);

        return res.status(200).json({
            success: true,
            message: "Empleado eliminado exitosamente"
        });

    } catch (error) {
        console.error("❌ Error en eliminarEmpleado:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



// ================================
// BUSCAR EMPLEADOS
// ================================
export async function buscarEmpleados(req, res) {
    try {
        const { q, idSucursal } = req.query;

        const empleados = await buscarEmpleadosService(q, idSucursal);

        return res.status(200).json({
            success: true,
            empleados
        });

    } catch (error) {
        console.error("❌ Error en buscarEmpleados:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
