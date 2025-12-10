import { getConnection } from "../config/dbConfig.js";

// ======================================================
// CREAR RESERVA COMPLETA (VERSION WEBPAY)
// ======================================================
export const crearReservaWebPay = async (reserva) => {
    const pool = await getConnection();

    // 1) Insert reserva
    const r = await pool.request()
        .input("fechaInicio", reserva.fechaInicio)
        .input("fechaFin", reserva.fechaFin)
        .input("total", reserva.total)
        .input("idCliente", reserva.idCliente)
        .input("idEstadoReserva", 1) // PAGADA
        .query(`
            INSERT INTO reserva (fechaInicio, fechaFin, total, idCliente, idEstadoReserva)
            OUTPUT INSERTED.idReserva
            VALUES (@fechaInicio, @fechaFin, @total, @idCliente, @idEstadoReserva)
        `);

    const idReserva = r.recordset[0].idReserva;

    // 2) Insert habitación asociada
    await pool.request()
        .input("idReserva", idReserva)
        .input("idHabitacion", reserva.idHabitacion)
        .query(`
            INSERT INTO reservaHabitacion (idReserva, idHabitacion)
            VALUES (@idReserva, @idHabitacion)
        `);

    // 3) Insert acompañantes
    if (reserva.acompanantes && Array.isArray(reserva.acompanantes)) {
        for (const a of reserva.acompanantes) {
            await pool.request()
  .input("tipoPersona", a.tipoPersona)
  .query(`
      INSERT INTO acompaniante (tipoPersona, idReserva)
      VALUES (@tipoPersona, @idReserva)
  `);
        }
    }

    return idReserva;
};

// ======================================================
// REGISTRAR PAGO WEBPAY
// ======================================================
export const registrarPagoWebPay = async (idReserva, total) => {
    const pool = await getConnection();

    // Calcular neto e IVA
    const neto = Math.round(total / 1.19);
    const iva = total - neto;

    await pool.request()
        .input("neto", neto)
        .input("iva", iva)
        .input("idReserva", idReserva)
        .input("idMetodoPago", 1)   // 1 = Crédito
        .input("idEstadoPago", 1)   // 1 = Pagado
        .query(`
            INSERT INTO pago (neto, iva, fecha, hora, idReserva, idMetodoPago, idEstadoPago)
            VALUES (@neto, @iva, CONVERT(date, GETDATE()), CONVERT(time, GETDATE()), @idReserva, @idMetodoPago, @idEstadoPago)
        `);
};
