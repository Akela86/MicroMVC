'use strict';
const mysql = require('mysql');
const { connection } = require('../config/database');

module.exports = {
   getUsers (callback) {
      const con = mysql.createConnection(connection);

      con.connect(err => {
         if (err) {
            con.end();
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
