const express = require('express');
const cors = require('cors');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

const https = require('https');

const routerApi = require('./routes/index');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
} = require('./middlewares/error.hander');

// creamos una aplicación
const app = express();

//le decimos el puerto en que queremos que corra la aplicación
const port = process.env.PORT || 3001 || 443;

app.get('/', (req, res) => {
  res.send('hola mi server en express');
});
const httpsOptions = {
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH),
};

const server = https.createServer(httpsOptions, app);

//le decimos a la aplicación en que puesto escuchar
// además creamos un callback que nos avisará cuando esté corriendo
server.listen(port, () => {
  console.log('mi port --> ' + port);
});

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  if (req.originalUrl === '/api/v1/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// cors
app.use(cors());

app.use(passport.initialize({ session: false }));
require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Middleware para hacer log de las solicitudes
app.use((req, res, next) => {
  const logStream = fs.createWriteStream(path.join(__dirname, 'api.log'), {
    flags: 'a',
  });

  logStream.write(`${new Date().toISOString()} - ${req.method} ${req.url}\n`);

  logStream.on('finish', () => {
    console.log('Request logged:', `${req.method} ${req.url}`);
  });

  next();
});

// Manejo de errores

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Algo salió mal');
  next();
});

// log in file app.log

const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), {
  flags: 'a',
});

console.log = function () {
  const msg = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  logStream.write(`${new Date().toISOString()} - ${msg} \n`);
  process.stdout.write(`${new Date().toISOString()} - ${msg} \n`);
};

console.error = function () {
  const msg = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  logStream.write(`${new Date().toISOString()} -  ERROR: ${msg} \n`);
  process.stderr.write(`${new Date().toISOString()} -  ERROR: ${msg} \n`);
};

console.info = function () {
  const msg = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  logStream.write(`${new Date().toISOString()} -  INFO: ${msg} \n`);
  process.stdout.write(`${new Date().toISOString()} -  INFO: ${msg} \n`);
};

console.warn = function () {
  const msg = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
  logStream.write(`${new Date().toISOString()} -  WARN: ${msg} \n`);
  process.stdout.write(`${new Date().toISOString()} -  WARN: ${msg} \n`);
};
