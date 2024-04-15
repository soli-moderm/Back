const passport = require('passport');

const LocalStrategyPassport = require('./strategies/local.strategy');
const JwtStrategy = require('./strategies/jwt.strategy');

passport.use(LocalStrategyPassport);
passport.use(JwtStrategy);
