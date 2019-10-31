'use strict';
const mysql = require('mysql');
const db = require('../config/database').ncr;

module.exports = {
   getUsers (callback) {
      const con = mysql.createConnection(db);

      con.connect(err => {
         if (err) {
            con.end();
            const time = new Date().toLocaleString();
            console.log(time + ' - Problema di connessione al DB NCR (allarmi), tentativo di riconnessione in corso');
            callback(err, null);
         }
         else {
            const sql = 'SELECT * FROM users';

            con.query(sql, (err, result) => {
               con.end();
               if (err) throw err;
               callback(null, result);
            });
         }
      });
   }
};
