import * as HabitacionModel from "../model/habitacionModel.js";
import sucursalService from "./sucursalService.js";

/* ============================================================
   1) DISPONIBILIDAD / BÚSQUEDA
============================================================ */
async function obtenerDisponibles(idSucursal) {

    await sucursalService.validarSucursal(idSucursal);

    return await HabitacionModel.obtenerHabitacionesDisponibles(idSucursal);
}

async function buscarAdecuadas({ idSucursal, fechaInicio, fechaFin, cantidadHuespedes }) {

    if (!idSucursal || !fechaInicio || !fechaFin || !cantidadHuespedes) {
        throw new Error("Faltan parámetros obligatorios para buscar habitaciones.");
    }

    await sucursalService.validarSucursal(idSucursal);

    return await HabitacionModel.buscarHabitacionesPorCapacidadYFechas(
        idSucursal, fechaInicio, fechaFin, cantidadHuespedes
    );
}

async function listarConFiltros(filtros) {

    // Si el usuario envía idSucursal, validamos.
    if (filtros.idSucursal) {
        await sucursalService.validarSucursal(filtros.idSucursal);
    }

    return await HabitacionModel.listarConFiltros(filtros);
}

/* ============================================================
   2) CRUD HABITACIONES
============================================================ */
async function obtenerPorId(idHabitacion) {
    const h = await HabitacionModel.obtenerHabitacionPorId(idHabitacion);
    if (!h) return null;

    const sucursal = await sucursalService.obtener(h.idSucursal);

    return { ...h, sucursal };
}


async function obtenerPorNumero(numero) {
    return await HabitacionModel.obtenerHabitacionPorNumero(numero);
}

async function crear(data) {

    await sucursalService.validarSucursal(data.idSucursal);

    return await HabitacionModel.crearHabitacion(data);
}

async function editar(idHabitacion, data) {

    if (data.idSucursal) {
        await sucursalService.validarSucursal(data.idSucursal);
    }

    return await HabitacionModel.editarHabitacionModel(idHabitacion, data);
}

async function actualizarEstado(numero, idEstadoHabitacion) {
    return await HabitacionModel.actualizarEstadoHabitacion(numero, idEstadoHabitacion);
}

/* ============================================================
   3) TIPOS, CARACTERÍSTICAS, SERVICIOS
============================================================ */

async function obtenerTipos() {
    return await HabitacionModel.obtenerTiposHabitacion();
}

async function obtenerCaracteristicas() {
    return await HabitacionModel.obtenerCaracteristicas();
}

async function obtenerCaracteristicaPorId(id) {
    return await HabitacionModel.obtenerCaracteristicaPorId(id);
}

async function actualizarCaracteristica(id, data) {
    return await HabitacionModel.actualizarCaracteristica(id, data);
}

async function obtenerServicios() {
    return await HabitacionModel.obtenerServicios();
}

async function obtenerServiciosHabitacion(idHabitacion) {
    return await HabitacionModel.obtenerServiciosHabitacion(idHabitacion);
}

async function actualizarServicios(idHabitacion, servicios) {
    if (!Array.isArray(servicios)) {
        throw new Error("El formato de servicios debe ser una lista.");
    }

    return await HabitacionModel.actualizarServiciosHabitacionModel(idHabitacion, servicios);
}

async function obtenerCaracteristicasPorTipo(idTipo) {
    return await HabitacionModel.obtenerCaracteristicasPorTipo(idTipo);
}

async function obtenerServiciosPorTipo(idTipo) {
    return await HabitacionModel.obtenerServiciosPorTipo(idTipo);
}

async function obtenerEmpleadoDetalle(idEmpleado) {
    const empleado = await empleadoModel.obtenerEmpleadoPorId(idEmpleado);
    if (!empleado) return null;

    const sucursal = await sucursalService.obtenerPorId(empleado.idSucursal);

    return {
        ...empleado,
        sucursal
    };
}



/* ============================================================
   EXPORTACIÓN
============================================================ */
export default {
    obtenerDisponibles,
    buscarAdecuadas,
    listarConFiltros,
    obtenerPorId,
    obtenerPorNumero,
    crear,
    editar,
    actualizarEstado,
    obtenerTipos,
    obtenerCaracteristicas,
    obtenerCaracteristicaPorId,
    actualizarCaracteristica,
    obtenerServicios,
    obtenerServiciosHabitacion,
    actualizarServicios,
    obtenerCaracteristicasPorTipo,
    obtenerServiciosPorTipo,
    obtenerEmpleadoDetalle
};
