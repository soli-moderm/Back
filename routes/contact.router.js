const express = require('express');

const router = express.Router();

const { sendEmail } = require('../utils/sendEmail');

router.post('/', async (req, res, next) => {
  try {
    const { email, name, phone, city, message } = req.body;

    const emailContact = 'solimodermcontacto@gmail.com';

    const text = `
    🚀Tienes un nuevo contacto desde la tienda en línea Solimoderm:
    Nombre: ${name}
    Email: ${email}
    Teléfono: ${phone}
    Ciudad: ${city}
    Mensaje: ${message}
    `;

    const html = `
    <p>🚀Tienes un nuevo contacto desde la tienda en línea Solimoderm:</p>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${phone}</p>
    <p><strong>Ciudad:</strong> ${city}</p>
    <p><strong>Mensaje:</strong> ${message}</p>
    `;

    const subject = 'Nuevo contacto desde la 🛒 Tienda en lines Solimoderm';

    await sendEmail(emailContact, subject, text, html);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
