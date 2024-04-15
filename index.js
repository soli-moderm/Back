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
app.use(passport.initialize({ session: false }));

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

// cors
app.use(cors());

// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.use(passport.initialize());
require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// log in file app.log

const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), {
  flags: 'a',
});

console.log = function (msg) {
  logStream.write(`${new Date().toISOString()} - ${msg} \n`);
  process.stdout.write(`${new Date().toISOString()} - ${msg} \n`);
};
