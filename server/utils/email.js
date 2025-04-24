// utils/email.js
const nodemailer = require('nodemailer');

// Configuration pour le développement (utilise Mailtrap)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Fonction pour envoyer des emails
exports.sendEmail = async (options) => {
  try {
    // 1) Créer un transporteur
    const transporter = createTransporter();

    // 2) Définir les options de l'email
    const mailOptions = {
      from: 'Exam Calendar System <noreply@examcalendar.com>',
      to: options.email,
      subject: options.subject,
      text: options.message
      // html: options.html (optionnel)
    };

    // 3) Envoyer l'email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Erreur lors de l\'envoi de l\'email:', err);
    throw err;
  }
};

module.exports = exports;