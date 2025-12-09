// services/sucursalService.js

import {
    obtenerSucursalesModel,
    obtenerSucursalPorId,
    existeSucursal,
    listarSucursalesBasico
} from "../model/sucursalModel.js";

/* ============================================================
   LISTAR TODAS LAS SUCURSALES
============================================================ */
async function listar() {
    return await obtenerSucursalesModel();
}

/* ============================================================
   OBTENER UNA SUCURSAL POR ID
============================================================ */
async function obtener(idSucursal) {
    return await obtenerSucursalPorId(idSucursal);
}

/* ============================================================
   VALIDAR EXISTENCIA DE SUCURSAL
   (Para usar en Habitaciones, Empleados, Reservas, etc.)
============================================================ */
async function validarSucursal(idSucursal) {
    const existe = await existeSucursal(idSucursal);

    if (!existe) {
        throw new Error("La sucursal especificada no existe.");
    }
}

/* ============================================================
   LISTADO BÁSICO (para selects del frontend)
============================================================ */
async function listarBasico() {
    return await listarSucursalesBasico();
}

/* ============================================================
   EXPORTACIÓN ORDENADA DEL SERVICIO
============================================================ */
export default {
    listar,
    obtener,
    validarSucursal,
    listarBasico
};
