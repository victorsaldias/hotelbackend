// services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function enviarCorreo({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Hotel Arellano" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("📧 Correo enviado:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    throw error;
  }
}

export function templateBienvenidaCliente(nombre, passwordPlano) {
  return `
    <h1>Bienvenido/a, ${nombre}</h1>
    <p>Tu cuenta ha sido creada en Hotel Arellano.</p>
    <p>Tu contraseña temporal es: <b>${passwordPlano}</b></p>
  `;
}
