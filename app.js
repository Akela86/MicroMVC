'use strict';
const { env, port } = require('./config/app');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const server = env === 'production' ? require('https') : require('http');
const path = require('path');

const { writeError } = require('./src/libs/writeLog');

const app = express();
app.use(helmet());

const serverInstance = server.createServer({
   key: fs.readFileSync(path.join(__dirname, '/certs/selfsigned.key')),
   cert: fs.readFileSync(path.join(__dirname, '/certs/selfsigned.crt')),
   requestCert: false,
   rejectUnauthorized: false
}, app);

app.set('port', port);
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('sanitize').middleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(require('./src/routes'));

// Server HTTPs
if (!module.parent) { // Directly
   serverInstance.listen(app.get('port'), () => {
      const time = new Date().toLocaleString();
      console.log(`${time} - Server ${env === 'production' ? 'HTTPS' : 'HTTP'} ${env} listening on port ${app.get('port')}`);
   });
}
else { // As module
   module.exports = serverInstance;
}

// Uncaught errors handling
process.on('uncaughtException', writeError);
process.on('unhandledRejection', writeError);
