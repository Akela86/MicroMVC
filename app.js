const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const server = https.createServer({
    key: fs.readFileSync('ssl/selfsigned.key'),
    cert: fs.readFileSync('ssl/selfsigned.crt'),
    requestCert: false,
    rejectUnauthorized: false
}, app);
const io = require('socket.io').listen(server, {
    'transports': ['websocket']
});
const path = require('path');
const ejs = require('ejs');

// Variabili d'ambiente
app.locals.server   = '127.0.0.1';
app.locals.protocol = 'https';
app.locals.port     = 3000;

app.set('port', process.env.PORT || app.locals.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('sanitize').middleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controller
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app, io);
    }
});

// Error 404
app.get('*', function (req, res) {
    res.render('404');
});

// Server HTTPs
server.listen(app.get('port'), function(){
    var time =  new Date().toLocaleString();
    console.log(time+' - Server HTTPs in ascolto sulla porta '+app.get('port'));
});

// Gestione Errori e Logs
process.on('uncaughtException', function (err) {
    var time =  new Date().toLocaleString();
    var string = time+' - '+err+'\r\n';
    var fd = new Date(),
        y    = fd.toLocaleString().substr(2,2),
        m    = fd.getMonth()+1 < 10 ? '0'+(fd.getMonth()+1) : fd.getMonth()+1,
        d    = fd.getDate() < 10 ? '0'+fd.getDate() : fd.getDate();

    console.log(time+' - Errore: ', err);

    fs.open('./logs/'+y+m+d+'-err.log', 'a', function(err, fd){
        fs.write(fd, string, 0, 'utf-8', function(err){
            fs.closeSync(fd);
        });
    });
});
