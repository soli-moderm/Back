const express = require('express');
const cors = require('cors');
const passport = require('passport');

const routerApi = require('./routes/index');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.hander');

// creamos una aplicación
const app = express();
app.use(passport.initialize({ session: false }));

//le decimos el puerto en que queremos que corra la aplicación
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('hola mi server en express');
});

//le decimos a la aplicación en que puesto escuchar
// además creamos un callback que nos avisará cuando esté corriendo
app.listen(port, () => {
  console.log('mi port --> ' + port);
});

const whitelist = [
  'https://localhost:5500',
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:3002',
  'https://api.solimoder.com',
  'http://api.solimoder.com',
  'http://www.api.solimoderm.com/',
];

const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido' + origin), false);
    }
  },
};

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(cors(options));
app.use(passport.initialize());
require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);
