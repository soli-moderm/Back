const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');
const UserService = require('./user.service');
const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 480 * 60, //8h
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async createPassword(password, id) {
    const hash = await bcrypt.hash(password, 10);
    const ihavePassword = await service.findOne(id);
    if (ihavePassword.password) {
      throw boom.badRequest('Ya tienes contraseña');
    }
    const user = await service.update(id, { password: hash }).catch((err) => {
      throw boom.badRequest(err);
    });

    const token = this.signToken(user).token;
    delete user.dataValues.password;
    return { token, user };
  }

  async me(token) {
    const payload = jwt.verify(token, config.jwtSecret);

    console.log(
      '🚀 ~ file: auth.service.js ~ line 42 ~ AuthService ~ me ~ payload',
      payload
    );
    const user = await service.findOne(payload.sub);
    console.log(
      '🚀 ~ file: auth.service.js ~ line 43 ~ AuthService ~ me ~ user',
      user
    );
    const newToken = this.signToken(user).token;
    return { user, token: newToken };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: 'soporte@glamouroso.shop',
      to: `${user.email}`,
      subject: 'Email para recuperar contraseña',
      html: `<b>Ingresa a este link => ${link}</b>`,
    };
    console.log(
      '🚀 ~ file: auth.service.js ~ line 52 ~ AuthService ~ sendRecovery ~ mail',
      mail
    );
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      service: 'Godaddy',

      auth: {
        user: 'soporte@glamouroso.shop',
        pass: 'Willi3315',
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }
}

// async sendMail(infoMail) {
//   const transporter = nodemailer.createTransport({
//     host: "email-smtp.us-east-1.amazonaws.com",
//     port:  2587,
//     secure: false,
//     auth: {
//       user: "AKIA2PA5VUZXKM3Q5HIB",
//       pass: "BIYTo0nUhmfKFC4rfHVDcsFuPcIC1/uGPobkcyzCvVjZ",
//     },
//     debug: true
//   });
//   await transporter.sendMail(infoMail);
//   return { message: 'mail sent' };
// }
// }

module.exports = AuthService;
