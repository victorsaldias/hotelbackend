// services/empleadoService.js
import {
    obtenerTodosLosEmpleados,
    obtenerEmpleadoPorIdModel,
    crearEmpleadoModel,
    actualizarEmpleadoModel,
    eliminarEmpleadoModel,
    buscarEmpleadosModel
} from "../model/empleadoModel.js";

import sucursalService from "./sucursalServices.js";
import { hashPassword } from "./passwordServices.js";
import { enviarCorreo } from "./emailServices.js";
import { limpiarRut } from "../utils/rutUtils.js";

/* ============================================================
   VALIDACIÓN DE CAMPOS (solo para crear)
============================================================ */
function validarCamposCrear(data) {
    const { rut, nombre, apellido, correo, idRol, idSucursal } = data;

    if (!rut || !nombre || !apellido || !correo || !idRol || !idSucursal) {
        throw new Error("Todos los campos son obligatorios.");
    }
}

/* ============================================================
   CREAR EMPLEADO
============================================================ */
export async function crearEmpleadoService(data) {

    validarCamposCrear(data);

    await sucursalService.validarSucursal(data.idSucursal);

    // Generar contraseña
    const rutLimpio = limpiarRut(data.rut);
    const passwordPlano = rutLimpio + "123";
    const passwordHash = await hashPassword(passwordPlano);

    const empleado = {
        rut: rutLimpio,
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        password: passwordHash,
        idRol: parseInt(data.idRol),
        idEstadoEmpleado: 1,
        idSucursal: parseInt(data.idSucursal)
    };

    const resultado = await crearEmpleadoModel(empleado);

    // Enviar correo
    await enviarCorreo({
        to: data.correo,
        subject: "Credenciales de acceso - Hotel Arellano",
        html: `
            <h2>Hola ${data.nombre} ${data.apellido},</h2>
            <p>Has sido registrado como empleado del <b>Hotel Arellano</b>.</p>
            <p>Tu contraseña provisional es:</p>
            <p style="font-size:18px;font-weight:bold;">${passwordPlano}</p>
            <p>Debes cambiarla al iniciar sesión.</p>
            <br>
            <p>Atentamente,<br>Hotel Arellano</p>
        `
    });

    return resultado;
}

/* ============================================================
   ACTUALIZAR EMPLEADO
============================================================ */
export async function actualizarEmpleadoService(idEmpleado, data) {

    if (data.idSucursal) {
        await sucursalService.validarSucursal(data.idSucursal);
    }

    const empleadoActualizado = {
        rut: limpiarRut(data.rut),
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        idRol: parseInt(data.idRol),
        idEstadoEmpleado: parseInt(data.idEstadoEmpleado) || 1,
        idSucursal: parseInt(data.idSucursal)
    };

    // Si hay nueva contraseña
    if (data.password?.trim()) {
        empleadoActualizado.password = await hashPassword(data.password);
    }

    await actualizarEmpleadoModel(idEmpleado, empleadoActualizado);
}

/* ============================================================
   OBTENER TODOS LOS EMPLEADOS
============================================================ */
export async function obtenerEmpleadosService(idSucursal) {
    if (idSucursal) {
        await sucursalService.validarSucursal(idSucursal);
    }
    return await obtenerTodosLosEmpleados(idSucursal);
}

/* ============================================================
   OBTENER EMPLEADO POR ID
============================================================ */
export async function obtenerEmpleadoPorIdService(idEmpleado) {
    return await obtenerEmpleadoPorIdModel(idEmpleado);
}

/* ============================================================
   BUSCAR EMPLEADOS
============================================================ */
export async function buscarEmpleadosService(q, idSucursal) {

    if (idSucursal) {
        await sucursalService.validarSucursal(idSucursal);
    }

    if (!q || q.trim() === "") {
        return await obtenerTodosLosEmpleados(idSucursal);
    }

    return await buscarEmpleadosModel(q, idSucursal);
}

/* ============================================================
   ELIMINAR EMPLEADO (soft delete)
============================================================ */
export async function eliminarEmpleadoService(idEmpleado) {
    return await eliminarEmpleadoModel(idEmpleado);
}

export default {
    crearEmpleadoService,
    actualizarEmpleadoService,
    obtenerEmpleadoPorIdService,
    obtenerEmpleadosService,
    buscarEmpleadosService,
    eliminarEmpleadoService
};
