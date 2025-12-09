// services/clienteService.js

import {
    insertarCliente,
    obtenerClientePorRut,
    obtenerClientePorId,
    obtenerTodosClientesDB,
    actualizarClientePorIdDB,
    actualizarClientePorRutDB,
    actualizarPassword
} from "../model/clienteModel.js";

import { hashPassword, comparePassword } from "./passwordService.js";
import { enviarCorreo, templateBienvenidaCliente } from "./emailServices.js";
import { limpiarRut } from "../utils/rutUtils.js";


// ============================================================
// VALIDAR DUPLICADOS
// ============================================================
export async function validarDuplicados({ rut, correo }) {
    rut = limpiarRut(rut);

    const clienteRut = await obtenerClientePorRut(rut);
    if (clienteRut) return { ok: false, mensaje: "El RUT ya está registrado." };

    // Si quieres: validar correo único
    // const clienteCorreo = await obtenerClientePorCorreo(correo);

    return { ok: true };
}


// ============================================================
// CREAR CLIENTE DESDE WEB
// ============================================================
export async function crearClienteWebService(data) {
    const { rut, correo, password } = data;

    if (!rut || !correo || !password) {
        throw new Error("RUT, correo y contraseña son obligatorios.");
    }

    const valid = await validarDuplicados({ rut, correo });
    if (!valid.ok) throw new Error(valid.mensaje);

    const hashed = await hashPassword(password);

    return insertarCliente({
        ...data,
        rut: limpiarRut(rut),
        password: hashed
    });
}


// ============================================================
// CREAR CLIENTE DESDE RECEPCIÓN
// ============================================================
export async function crearClienteRecepcionService(data) {
    const { rut, correo } = data;

    if (!rut || !correo) {
        throw new Error("RUT y correo son obligatorios.");
    }

    const rutLimpio = limpiarRut(rut);

    const valid = await validarDuplicados({ rut: rutLimpio, correo });
    if (!valid.ok) throw new Error(valid.mensaje);

    const passwordPlano = rutLimpio + "123";
    const hashed = await hashPassword(passwordPlano);

    const cliente = await insertarCliente({
        ...data,
        rut: rutLimpio,
        password: hashed
    });

    await enviarCorreo({
        to: cliente.correo,
        subject: "Bienvenido a Hotel Arellano",
        html: templateBienvenidaCliente(cliente.nombre, passwordPlano)
    });

    return cliente;
}


// ============================================================
// CAMBIAR CONTRASEÑA
// ============================================================
export async function cambiarPasswordService(idCliente, passwordActual, passwordNueva) {
    const cliente = await obtenerClientePorId(idCliente);
    if (!cliente) throw new Error("Cliente no encontrado.");

    const ok = await comparePassword(passwordActual, cliente.password);
    if (!ok) throw new Error("La contraseña actual es incorrecta.");

    const hashed = await hashPassword(passwordNueva);

    return await actualizarPassword(idCliente, hashed);
}


// ============================================================
// ACTUALIZAR POR ID
// ============================================================
export async function actualizarClientePorIdService(idCliente, data) {
    const cliente = await obtenerClientePorId(idCliente);
    if (!cliente) throw new Error("Cliente no encontrado.");

    if (data.password) {
        data.password = await hashPassword(data.password);
    }

    return await actualizarClientePorIdDB(idCliente, data);
}


// ============================================================
// ACTUALIZAR POR RUT
// ============================================================
export async function actualizarClientePorRutService(rut, data) {
    rut = limpiarRut(rut);

    const cliente = await obtenerClientePorRut(rut);
    if (!cliente) throw new Error("Cliente no encontrado.");

    if (data.password) {
        data.password = await hashPassword(data.password);
    }

    return await actualizarClientePorRutDB(rut, data);
}


// ============================================================
// OBTENER CLIENTE
// ============================================================
export async function obtenerClientePorRutService(rut) {
    return await obtenerClientePorRut(limpiarRut(rut));
}

export async function obtenerClientePorIdService(id) {
    return await obtenerClientePorId(id);
}


// ============================================================
// LISTAR TODOS
// ============================================================
export async function obtenerTodosClientesService() {
    return await obtenerTodosClientesDB();
}
