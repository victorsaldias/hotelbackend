import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

import {
    obtenerTodosLosEmpleados,
    obtenerEmpleadoPorIdModel,
    crearEmpleadoModel,
    actualizarEmpleadoModel,
    eliminarEmpleadoModel,
    buscarEmpleadosModel
} from "../model/empleadoModel.js";


function limpiarRut(rut) {
    return rut.replace(/\./g, "").replace(/-/g, "");
}


export async function obtenerEmpleados(req, res) {
    try {
        const { idSucursal } = req.query;
        const empleados = await obtenerTodosLosEmpleados(idSucursal);
        return res.status(200).json({ success: true, empleados });
    } catch (error) {
        console.error("❌ Error en obtenerEmpleados:", error);
        return res.status(500).json({ success: false, message: "Error al obtener empleados" });
    }
}


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


export async function crearEmpleado(req, res) {
    try {
        const { rut, nombre, apellido, correo, idRol, idSucursal } = req.body;

       
        if (!rut || !nombre || !apellido || !correo || !idRol || !idSucursal) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son obligatorios."
            });
        }

      
        const rutLimpio = limpiarRut(rut);
        const passwordFinal = rutLimpio + "123";

      
        const passwordHash = await bcrypt.hash(passwordFinal, 10);

        const empleadoData = {
            rut,
            nombre,
            apellido,
            correo,
            password: passwordHash,
            idRol: parseInt(idRol),
            idEstadoEmpleado: 1,
            idSucursal: parseInt(idSucursal)
        };

      
        const resultado = await crearEmpleadoModel(empleadoData);

        
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: { rejectUnauthorized: false }
        });

        await transporter.sendMail({
            from: `"Hotel Arellano" <${process.env.EMAIL_USER}>`,
            to: correo,
            subject: "Credenciales de acceso - Hotel Arellano",
            html: `
                <h2>Hola ${nombre} ${apellido},</h2>
                <p>Has sido registrado como empleado del <b>Hotel Arellano</b>.</p>
                <p>Tu contraseña provisional es:</p>
                <p style="font-size:18px;font-weight:bold;">${passwordFinal}</p>
                <p>Por seguridad, debes cambiarla al iniciar sesión.</p>
                <br>
                <p>Atentamente,<br>Hotel Arellano</p>
            `
        });
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length)

        return res.status(201).json({
            success: true,
            message: "Empleado creado y correo enviado correctamente.",
            idEmpleado: resultado.idEmpleado
        });

    } catch (error) {
        console.error("❌ Error en crearEmpleado:", error);
        return res.status(500).json({ success: false, message: "Error al crear empleado" });
    }
}


export async function actualizarEmpleado(req, res) {
    try {
        const { id } = req.params;
        const { rut, nombre, apellido, correo, password, idRol, idEstadoEmpleado, idSucursal } = req.body;

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
            idSucursal: parseInt(idSucursal)
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
        return res.status(500).json({
            success: false,
            message: "Error al eliminar empleado"
        });
    }
}


export async function buscarEmpleados(req, res) {
    try {
        const { q, idSucursal } = req.query;

        if (!q || q.trim() === "") {
            const empleados = await obtenerTodosLosEmpleados(idSucursal);
            return res.status(200).json({ success: true, empleados });
        }

        const empleados = await buscarEmpleadosModel(q, idSucursal);
        return res.status(200).json({ success: true, empleados });

    } catch (error) {
        console.error("❌ Error en buscarEmpleados:", error);
        return res.status(500).json({
            success: false,
            message: "Error al buscar empleados"
        });
    }
}
