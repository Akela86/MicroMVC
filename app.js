'use strict';
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const https = require('https');
const path = require('path');

const { writeError } = require('./src/libs/writeLog');

const app = express();
app.use(helmet());

const server = https.createServer({
   key: fs.readFileSync(path.join(__dirname, '/ssl/selfsigned.key')),
   cert: fs.readFileSync(path.join(__dirname, '/ssl/selfsigned.crt')),
   requestCert: false,
   rejectUnauthorized: false
}, app);

const { env, port } = require('./config/app');
process.env.NODE_ENV = env;

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
server.listen(app.get('port'), () => {
   const time = new Date().toLocaleString();
   console.log(`${time} - Server ${process.env.NODE_ENV} in ascolto sulla porta ${app.get('port')}`);
});

// Gestione Errori e Logs
process.on('uncaughtException', err => {
   writeError(err);
});
