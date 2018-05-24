// Database
const mysql = require('mysql');
const db = require('../config/database').ncr;

module.exports = {

    name: 'ncr',

    // Query Allarmi
    getAlarms: function (callback){
        var con = mysql.createConnection(db);

        con.connect(function(err) { 
            if(err) {
                con.end();
                var time =  new Date().toLocaleString();
                console.log(time+' - Problema di connessione al DB NCR (allarmi), tentativo di riconnessione in corso');
                callback(err, null);
                module.exports.isConnected = 1;
            }
            else{
                //console.log(time+' - Connessione al database NCR riuscita');
                module.exports.isConnected = 0;

                var sql = "SELECT * FROM allarmi_aperti JOIN macchine ON macchine.codMacchina = allarmi_aperti.codMacchina JOIN allarmi_macchina ON allarmi_macchina.codTipoAllarme = allarmi_aperti.codTipoAllarme WHERE macchine.abilitata = 1";

                con.query(sql, function (err, result, fields){
                    con.end();
                    if(err) throw err;
                    callback(null, result);
                });
            }
        });
    },

    // Query Problemi
    getProblems: function (callback){
        var con = mysql.createConnection(db);

        con.connect(function(err) {
            var time =  new Date().toLocaleString();
            if(err) {
                console.log(time+' - Problema di connessione al DB NCR (problemi), tentativo di riconnessione in corso');
                callback(err, null);
                module.exports.isConnected = 1;
            }
            else{
                //console.log(time+' - Connessione al database NCR riuscita');
                module.exports.isConnected = 0;

                var sql = "SELECT problemi_aperti.*, macchine.descMacchina FROM problemi_aperti JOIN macchine ON macchine.codMacchina = problemi_aperti.codMacchina WHERE macchine.abilitata = 1 AND presaInCarico = 0";
                
                con.query(sql, function (err, result, fields){
                    con.end();
                    if(err) throw err;
                    callback(null, result);
                });
            }
        });
    }
}