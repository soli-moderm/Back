const express = require('express');

const router = express.Router();

const { sendEmail } = require('../utils/sendEmail');

router.post('/', async (req, res, next) => {
  try {
    const { email, name, phone, city, message } = req.body;

    const emailContact = 'solimodermcontacto@gmail.com';

    const text = `
    🚀Tienes un nuevo contacto desde la tienda en línea Solimoderm:\n
    **Nombre:** ${name}\n
    **Email:** ${email}\n
    **Teléfono:** ${phone}\n
    **Ciudad:** ${city}\n
    **Mensaje:** ${message}\n
    `;

    const subject = 'Nuevo contacto desde la 🛒 Tienda en lines Solimoderm';

    await sendEmail(emailContact, subject, text);
    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
