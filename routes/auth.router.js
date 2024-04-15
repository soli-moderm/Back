const express = require('express');
const passport = require('passport');

const AuthService = require('./../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post(
  '/login',
  //verificas si existe el email y si coincide la contraseña
  passport.authenticate('local', { failureRedirect: '/' }),
  async (req, res, next) => {
    try {
      //usuario que te regresa Password
      const user = req.user;
      console.log('🚀 ~ user:', user);
      if (!user) {
        return res.status(400).json({ error: 'Invalid user' });
      }
      const token = service.signToken(user);
      if (!token) {
        return res.status(400).json({ error: 'Unable to sign token' });
      }
      //retorna un token
      res.json(token);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      console.log(
        '🚀 ~ file: auth.router.js ~ line 31 ~ req.body headers',
        req.headers
      );
      const { authorization } = req.headers;
      const token = authorization.split(' ')[1];
      const user = await service.me(token);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/createPassword', async (req, res, next) => {
  try {
    const { password, id } = req.body;
    const rta = await service.createPassword(password, id);
    console.log('🚀 ~ file: auth.router.js:49 ~ router.post ~ rta:', rta);
    res.status(201).json({
      status: 'success',
      message: 'Password created',
      data: rta,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/recovery', async (req, res, next) => {
  try {
    const { email } = req.body;
    const rta = await service.sendRecovery(email);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

router.post('/change-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const rta = await service.changePassword(token, newPassword);
    res.json(rta);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
