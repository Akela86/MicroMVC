module.exports.controller = function(app, io) {

    //Route
    app.get('/', function(req, res) {

        obj = {
            title   : 'Monitor Allarmi e Problemi',
            port    : app.get('port'),
            server  : app.locals.server,
            protocol: app.locals.protocol
        };

        res.render('main', obj);
    });


    // DELETE
    app.get('/deleteall/', function(req, res) {
        if (!req.query) return res.sendStatus(400);
        var nome = req.queryString('nome');

        var content = '\
            <h4>Eliminare tutti gli Allarmi?</h4>\
            <form id="deleteform">\
                <div class="buttons">\
                    <button class="cancel">Annulla</button>\
                    <button class="confirm">Elimina</button>\
                </div>\
            </form>\
        ';
        res.send(content);

    });

    app.get('/deleteall/save/', function(req, res) {

        var mysql = require('mysql');
        var trap = require('../models/Trap');

        var db = {
            host: "10.0.0.114",
            user: "ovvdb",
            password: "zxzro_ovvdb",
            database: "trap"
        }

        var con;

        con = mysql.createConnection(db);

        con.connect(function(err) {
            if(err) res.send('<span><i class="material-icons red-status">warning</i> Errore di connessione!<!--'+err+'--></span>');
            return;
        });

        var fd = new Date(),
        y    = fd.toLocaleString().substr(2,2),
        m    = fd.getMonth()+1 < 10 ? '0'+(fd.getMonth()+1) : fd.getMonth()+1,
        d    = fd.getDate() < 10 ? '0'+fd.getDate() : fd.getDate(),
        h    = fd.getHours() < 10 ? '0'+fd.getHours() : fd.getHours(),
        mn   = fd.getMinutes() < 10 ? '0'+fd.getMinutes() : fd.getMinutes(),
        s   = fd.getSeconds() < 10 ? '0'+fd.getSeconds() : fd.getSeconds(),
        date = ''+y+''+m+''+d+''+h+''+mn+''+s;

        trap.getTraps(function(err, result){
            var sql = '';
            for(var i = 0, len = result.length; i < len; i++){
                sql += "INSERT INTO allarmi_chiusi (codMacchina, codTipoAllarme, infoAllarme, dataCreazione, dataUltimaNotifica, numNotifiche, presaInCarico, dataPresa, codUtentePresa, notePresa, dataChiusura, codUtenteChiusura, noteChiusura, sms, snmp, email) VALUES ('"+result[i]['codMacchina']+"', '"+result[i]['codTipoAllarme']+"', '"+result[i]['infoAllarme']+"', '"+result[i]['dataCreazione']+"', '"+result[i]['dataUltimaNotifica']+"', "+result[i]['numNotifiche']+", '"+result[i]['presaInCarico']+"', '"+result[i]['dataPresa']+"', '"+result[i]['codUtentePresa']+"', '"+result[i]['notePresa']+"', '"+date+"', 'mds', '', '0', '0', '0');";

                if(len == (i+1)){
                    con.query(sql, function (err, result, fields){
                        var sql = "DELETE FROM allarmi_aperti";
                        con.query(sql, function (err, result, fields){
                            if(err) {
                                res.send('<span><i class="material-icons red-status">warning</i> Errore di eliminazione!<!--'+err+'--></span>');
                            }
                            else{
                                res.send('<span><i class="material-icons green-status">done</i> Eliminazione avvenuta</span>');
                            }

                        });
                    });
                }
            }

        });

    });

    // Monitor
    var tcp = require('../models/Tcp');
    var ncr = require('../models/Ncr');
    var ssl = require('../models/Ssl');
    var rtg = require('../models/Rtg');
    var trap = require('../models/Trap');

    alarmTable = function(model, callback){

        model.getAlarms(function(err, result){

            var rows = [],
                listaallarmi = [],
                warning = 0;

            for(var i = 0, len = result.length; i < len; i++){
                var anno    = result[i]['dataCreazione'].substr(0, 4);
                var mese    = result[i]['dataCreazione'].substr(4, 2);
                var giorno  = result[i]['dataCreazione'].substr(6, 2);
                var ore     = result[i]['dataCreazione'].substr(8, 2);
                var minuti  = result[i]['dataCreazione'].substr(10, 2);
                var secondi = result[i]['dataCreazione'].substr(12, 2);
                var data = ore+':'+minuti+':'+secondi+' - '+giorno+'/'+mese+'/'+anno;

                var iconpause = '<i class="material-icons red-status">pause</i>';
                var iconstop = '<i class="material-icons red-status">stop</i>';

                if(result[i]['numNotifiche'] > 10){
                    warning = 2;
                    switch(result[i]['wngLevel']){
                        case 1:
                        case 2:
                        case 6:
                            icon = iconpause;
                            break;
                        case 3:
                        case 4:
                        case 5:
                            icon = iconstop;
                    }
                }
                else if(warning < 2){
                    warning = 1;
                    icon = iconpause;
                }


                listaallarmi = {
                    'icon': icon,
                    'mac': result[i]['descMacchina'],
                    'dataora': data,
                    'desc': result[i]['descAllarme'],
                    'notifiche': result[i]['numNotifiche'],
                    'cod': result[i]['codTipoAllarme'],
                    'warning': warning
                };

                rows.push(listaallarmi);
            }
            result = {
                rows: rows,
                name: model.name
            }
            callback(null, result);
        });

    }

    problemTable = function(model, callback){
        model.getProblems(function(err, result){
            var rows = [],
                listaproblemi = [],
                warning = 0;

            for(var i = 0, len = result.length; i < len; i++){
                var anno    = result[i]['dataCreazione'].substr(0, 4);
                var mese    = result[i]['dataCreazione'].substr(4, 2);
                var giorno  = result[i]['dataCreazione'].substr(6, 2);
                var ore     = result[i]['dataCreazione'].substr(8, 2);
                var minuti  = result[i]['dataCreazione'].substr(10, 2);
                var secondi = result[i]['dataCreazione'].substr(12, 2);
                var data = ore+':'+minuti+':'+secondi+' - '+giorno+'/'+mese+'/'+anno;

                var iconpause = '<i class="material-icons red-status">pause</i>';
                var iconstop = '<i class="material-icons red-status">stop</i>';

                switch(result[i]['codStatoAttuale']){
                    case '0000':
                        status = 'OK';
                        break;
                    case '9000':
                        status = 'Non Operativa';
                        icon = iconpause;
                        warning = 1;
                        break;
                    case '9500':
                        status = 'Non Connessa';
                        icon = iconstop;
                        warning = 2;
                        break;
                    default:
                        status = 'Stato Sconosciuto';
                }

                listaproblemi = {
                    'icon': icon,
                    'mac': result[i]['descMacchina'],
                    'dataora': data,
                    'desc': status,
                    'warning': warning
                };

                rows.push(listaproblemi);
            }

            result = {
                rows: rows,
                name: model.name
            }
            callback(null, result)
        });

    }

    trapTable = function(model, callback){
        model.getTraps(function(err, result){
            var rows = [],
                listaproblemi = [],
                warning = 0;

            for(var i = 0, len = result.length; i < len; i++){
                var anno    = result[i]['dataUltimaNotifica'].substr(0, 4);
                var mese    = result[i]['dataUltimaNotifica'].substr(4, 2);
                var giorno  = result[i]['dataUltimaNotifica'].substr(6, 2);
                var ore     = result[i]['dataUltimaNotifica'].substr(8, 2);
                var minuti  = result[i]['dataUltimaNotifica'].substr(10, 2);
                var secondi = result[i]['dataUltimaNotifica'].substr(12, 2);
                var data = ore+':'+minuti+':'+secondi+' - '+giorno+'/'+mese+'/'+anno;

                var iconpause = '<i class="material-icons red-status">pause</i>';
                var iconstop = '<i class="material-icons red-status">stop</i>';

                if(result[i]['abilitata'] == 1){
                   var icon = iconpause;
                }
                else{
                   var icon = iconstop;
                }

                listaproblemi = {
                    'icon': icon,
                    'mac': result[i]['descmacchina'],
                    'dataora': data,
                    'desc': result[i]['descAllarme'],
                    'notifiche': result[i]['numNotifiche'],
                    'info': result[i]['infoAllarme'],
                    'warning': result[i]['wngLevel']
                };

                rows.push(listaproblemi);
            }

            result = {
                rows: rows,
                name: model.name
            }
            callback(null, result)
        });

    }

    // Sockets
    var allarmi,
        problemi,
        name;

    var models = [rtg, tcp, ncr, ssl];

    io.on('connection', function (socket) {

        for(var i = 0; models.length > i; i++){// Allarmi

            (function(){
                var j = i;
                process.nextTick(function() {
                    if(models[j].isConnected == 1){
                        io.emit(models[j].name+'/alarm', 'error');
                    }
                    else{
                        alarmTable(models[j], function(err, result){
                            if(err) return;
                            allarmi = result.rows;
                            name = result.name;
                            io.emit(name+'/alarm', allarmi);
                        });
                    }
                });
            })();
        }

        for(var i = 0; models.length > i; i++){// Problemi
            (function(){
                var j = i;
                process.nextTick(function() {
                    if(models[j].isConnected == 1){
                        io.emit(models[j].name+'/problem', 'error');
                    }
                    else{
                        problemTable(models[j], function(err, result){
                            problemi = result.rows;
                            name = result.name;
                            io.emit(name+'/problem', problemi);
                        });
                    }
                });
            })();
        }



        if(trap.isConnected == 1){ // Trap
                io.emit('trap/problem', 'error');
        }
        else{
            trapTable(trap, function(err, result){
                problemi = result.rows;
                io.emit('trap/problem', problemi);
            });
        }
    });

    // Refresh
    setInterval(function(){
        for(var i = 0; models.length > i; i++){// Allarmi
            (function(){
                var j = i;
                process.nextTick(function() {
                    if(models[j].isConnected == 1){
                        io.emit(models[j].name+'/alarm', 'error');
                    }
                    else{
                        alarmTable(models[j], function(err, result){
                            if(err) return;
                            allarmi = result.rows;
                            name = result.name;
                            io.emit(name+'/alarm', allarmi);
                        });
                    }
                });
            })();
        }

        for(var i = 0; models.length > i; i++){// Problemi
            (function(){
                var j = i;
                process.nextTick(function() {
                    if(models[j].isConnected == 1){
                        io.emit(models[j].name+'/problem', 'error');
                    }
                    else{
                        problemTable(models[j], function(err, result){
                            problemi = result.rows;
                            name = result.name;
                            io.emit(name+'/problem', problemi);
                        });
                    }
                });
            })();
        }

        trapTable(trap, function(err, result){
            problemi = result.rows;
            io.emit('trap/problem', problemi);
        });

    }, 30000);
}
