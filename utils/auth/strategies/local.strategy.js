const { Strategy } = require('passport-local');

const AuthService = require('./../../../services/auth.service');
const service = new AuthService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await service.getUser(email, password);
      console.log('🚀 ~ user-passport:', user);

      if (!user) {
        return done(new Error('Usuario no encontrado'), false);
      }
      done(null, user);
    } catch (error) {
      done(new Error('Error al autenticar el usuario'), false);
    }
  }
);

module.exports = LocalStrategy;
