import { getConnection } from "../config/dbConfig.js";
import {
  obtenerHabitacionesDisponibles,
  obtenerHabitacionPorId,
  obtenerHabitacionPorNumero,
  crearHabitacion,
  actualizarEstadoHabitacion,
  obtenerTodasLasHabitaciones,
  obtenerPrecioHabitacion,
  buscarHabitacionesPorCapacidadYFechas
} from "../model/habitacionModel.js";

// 🔹 Habitaciones disponibles
export async function verHabitacionesDisponibles(req, res) {
  try {
    const habitaciones = await obtenerHabitacionesDisponibles();
    res.status(200).json(habitaciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener habitaciones disponibles",
      error: error.message
    });
  }
}

// 🔹 Listar con filtros
export async function listarHabitaciones(req, res) {
  try {
    const filtros = req.query;

    const pool = await getConnection();
    let query = "SELECT * FROM habitacion WHERE 1=1 ";
    const request = pool.request();

    if (filtros.numero) { query += " AND numero = @numero"; request.input("numero", filtros.numero); }
    if (filtros.precioMin) { query += " AND precio >= @precioMin"; request.input("precioMin", filtros.precioMin); }
    if (filtros.precioMax) { query += " AND precio <= @precioMax"; request.input("precioMax", filtros.precioMax); }
    if (filtros.idTipoHabitacion) { query += " AND idTipoHabitacion = @idTipoHabitacion"; request.input("idTipoHabitacion", filtros.idTipoHabitacion); }
    if (filtros.idEstadoHabitacion) { query += " AND idEstadoHabitacion = @idEstadoHabitacion"; request.input("idEstadoHabitacion", filtros.idEstadoHabitacion); }
    if (filtros.idSucursal) { query += " AND idSucursal = @idSucursal"; request.input("idSucursal", filtros.idSucursal); }

    const result = await request.query(query);
    res.status(200).json(result.recordset);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener habitaciones",
      error: error.message
    });
  }
}

// 🔹 Obtener habitación por ID
export async function obtenerHabitacionIdController(req, res) {
  try {
    const habitacion = await obtenerHabitacionPorId(req.params.idHabitacion);
    if (!habitacion) return res.status(404).json({ message: "Habitación no encontrada" });
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar habitación", error: error.message });
  }
}

// 🔹 Obtener habitación por número
export async function obtenerHabitacionNumeroController(req, res) {
  try {
    const habitacion = await obtenerHabitacionPorNumero(req.params.numero);
    if (!habitacion) return res.status(404).json({ message: "Habitación no encontrada" });
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar habitación", error: error.message });
  }
}

// 🔹 Crear habitación
export async function crearHabitacionController(req, res) {
  try {
    const habitacion = await crearHabitacion(req.body);
    res.status(201).json({ message: "Habitación creada", habitacion });
  } catch (error) {
    res.status(500).json({ message: "Error al crear habitación", error: error.message });
  }
}

// 🔹 Actualizar estado de habitación
export async function actualizarEstadoHabitacionController(req, res) {
  try {
    const { numero } = req.params;
    const { idEstadoHabitacion } = req.body;

    const actualizado = await actualizarEstadoHabitacion(numero, idEstadoHabitacion);

    if (!actualizado)
      return res.status(404).json({ message: "Habitación no encontrada" });

    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado", error: error.message });
  }
}

// 🔹 Obtener todas las habitaciones
export async function obtenerTodasLasHabitacionesController(req, res) {
  try {
    const habitacion = await obtenerTodasLasHabitaciones();
    res.status(200).json(habitacion);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones", error: error.message });
  } 
}

// 🔹 Asignar habitación (cambiar estado)
export async function asignarHabitacionController(req, res) {
  try {
    const { numero, idEstadoHabitacion } = req.body;
    const asignado = await actualizarEstadoHabitacion(numero, idEstadoHabitacion);
    if (!asignado)
      return res.status(404).json({ message: "Habitación no encontrada" });
    res.status(200).json({ message: "Habitación asignada correctamente" });
  } catch (error) { 
    res.status(500).json({ message: "Error al asignar habitación", error: error.message });
  }
}

// 🔹 Obtener precio de habitación por ID (opcional)
export async function obtenerPrecioHabitacionController(req, res) {
  try {
    const { idHabitacion } = req.params;
    const precio = await obtenerPrecioHabitacion(idHabitacion);
    if (precio === null) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }
    res.status(200).json({ idHabitacion, precio });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener precio de la habitación", error: error.message });
  }
}

// 🔹 Ver habitaciones de una reserva
export async function verHabitacionesDeReservaController(req, res) {
  try {
    const { idReserva } = req.params; 
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("idReserva", idReserva)
        .query(`
            SELECT h.*
            FROM habitacion h
            JOIN reservaHabitacion rh ON h.idHabitacion = rh.idHabitacion
            WHERE rh.idReserva = @idReserva;
        `);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones de la reserva", error: error.message });
  }
}

// 🔹 Habitaciones adecuadas por sucursal / fechas / capacidad
export async function obtenerHabitacionesAdecuadas(req, res) {
  try {
      const { idSucursal, fechaInicio, fechaFin, cantidadHuespedes } = req.body;

      const habitaciones = await buscarHabitacionesPorCapacidadYFechas(
          idSucursal,
          fechaInicio,
          fechaFin,
          cantidadHuespedes
      );

      res.json(habitaciones);
  } catch (error) {
      res.status(500).json({
          message: "Error al obtener habitaciones",
          error: error.message
      });
  }
}
