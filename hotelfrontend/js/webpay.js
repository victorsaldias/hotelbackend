document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) {
        Swal.fire("Error", "Token inválido", "error")
            .then(() => window.location.href = "../index.html");
        return;
    }

    document.getElementById("btnPagar").addEventListener("click", () => {
        procesarPago(token);
    });

    document.getElementById("btnCancelar").addEventListener("click", () => {
        Swal.fire("Pago cancelado", "", "warning")
            .then(() => window.location.href = "../index.html");
    });
});


async function procesarPago(token) {

    const num = document.getElementById("cardNumber").value;
    const exp = document.getElementById("cardExp").value;
    const cvc = document.getElementById("cardCVC").value;
    const name = document.getElementById("cardName").value.trim();

    // VALIDACIONES
    if (num.length !== 16) return Swal.fire("Error", "Número de tarjeta inválido", "error");
    if (!/^\d{2}\/\d{2}$/.test(exp)) return Swal.fire("Error", "Expiración inválida", "error");
    if (cvc.length !== 3) return Swal.fire("Error", "CVC inválido", "error");
    if (name.length < 3) return Swal.fire("Error", "Nombre inválido", "error");

    Swal.fire({
        icon: "info",
        title: "Procesando pago...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    // 🔥 RESERVA COMPLETA DESDE LOCALSTORAGE
    const reserva = JSON.parse(localStorage.getItem("reservaCompleta"));

    if (!reserva) {
        Swal.close();
        Swal.fire("Error", "No se encontró la reserva", "error");
        return;
    }

    // 🔥 ENVIAR PAGO + RESERVA AL BACKEND
    const response = await fetch("https://hotelbackend-hzc4.onrender.com/api/webpay/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reserva })
    });

    const data = await response.json();
    Swal.close();

    if (!response.ok) {
        Swal.fire("Error", data.error || "Pago rechazado", "error");
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Pago exitoso",
        text: "Tu reserva se ha guardado correctamente"
    }).then(() => {
        localStorage.removeItem("reservaCompleta");
        window.location.href = "../index.html";
    });
}
