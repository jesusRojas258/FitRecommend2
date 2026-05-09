const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarVerificacion = async (correo, username, token) => {
  const url = `${process.env.CLIENT_URL}/verificar/${token}`;

  await transporter.sendMail({
    from: `"FitRecommend" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: "Verifica tu cuenta en FitRecommend",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; padding: 32px; background: #1E293B; border-radius: 16px; color: #F8FAFC;">
        <h2 style="color: #3B82F6;">¡Bienvenido, ${username}! 💪</h2>
        <p style="color: #94A3B8;">Gracias por registrarte en FitRecommend. Haz clic en el botón para verificar tu cuenta:</p>
        <a href="${url}" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0;">
          Verificar cuenta
        </a>
        <p style="color: #475569; font-size: 12px;">Si no creaste esta cuenta, ignora este correo.</p>
      </div>
    `
  });
};

module.exports = { enviarVerificacion };