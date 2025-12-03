import { crearReservaWebPay, registrarPagoWebPay } from "../model/webpayModel.js";

// ===============================
// INICIAR TRANSACCIÓN (SIMULADA)
// ===============================
export const iniciarTransaccion = async (req, res) => {
    try {
        // crear token simple para simular
        const token = "TKN-" + Date.now();

        return res.json({
            ok: true,
            token
        });

    } catch (err) {
        console.error("Error al iniciar transacción:", err);
        res.status(500).json({ error: "Error al iniciar la transacción" });
    }
};


export const confirmarPago = async (req, res) => {
    try {
        const { token, reserva } = req.body;

        if (!token || !reserva) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        // 1) Crear la reserva
        const idReserva = await crearReservaWebPay(reserva);

        // 2) Registrar pago
        await registrarPagoWebPay(idReserva, reserva.total);

        return res.json({
            ok: true,
            mensaje: "Pago confirmado y reserva creada",
            idReserva
        });

    } catch (err) {
        console.error("Error en confirmarPago:", err);
        return res.status(500).json({ error: "Error al procesar pago" });
    }
};
