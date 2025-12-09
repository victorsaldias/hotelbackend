import { crearReservaService } from "../services/reservaService.js";
import { registrarPagoWebPay } from "../model/webpayModel.js";
import { cambiarEstadoReserva } from "../model/reservaModel.js";

export const iniciarTransaccion = async (req, res) => {
    try {
        const token = "TKN-" + Date.now();

        return res.json({ ok: true, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al iniciar la transacción" });
    }
};

export const confirmarPago = async (req, res) => {
    try {
        const { token, reserva } = req.body;
        

        if (!token || !reserva) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        // 1) Crear reserva con el MISMO método del pago presencial
        const { idReserva, total } = await crearReservaService(reserva);

await registrarPagoWebPay(idReserva, total);

// Estado pendiente
await cambiarEstadoReserva(idReserva, 1);

return res.json({
    ok: true,
    mensaje: "Pago confirmado",
    idReserva
});
    } catch (err) {
        console.error("Error en confirmarPago:", err);
        return res.status(500).json({ error: err.message });
    }
    
};