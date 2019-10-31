'use strict';
const fs = require('fs');
const path = require('path');
const appPath = path.join(__dirname, '../../');

const writeLogs = {
   /**
    * Scrive i log su file yyyymmdd-trace.log
    *
    * @param {*} trace Trace da scrivere su log
    */
   writeTrace (trace) {
      const fd = new Date();
      const y = fd.getFullYear();
      const m = (fd.getMonth() + 1).toString().padStart(2, '0');
      const d = fd.getDate().toString().padStart(2, '0');
      const H = fd.getHours().toString().padStart(2, '0');
      const i = fd.getMinutes().toString().padStart(2, '0');
      const s = fd.getSeconds().toString().padStart(2, '0');
      const ms = fd.getMilliseconds().toString().padStart(3, '0');
      const string = `${d}/${m}/${y} ${H}:${i}:${s}.${ms} - ${trace}\r\n`;
      fs.appendFileSync(`${appPath}/logs/${y}${m}${d}-trace.log`, string, 'utf-8');
   },

   /**
    * Scrive i log su file yyyymmdd-err.log
    *
    * @param {*} err L'errore da scrivere su log
    */
   writeError (err) {
      let errMsg;
      if (err.hasOwnProperty('stack'))
         errMsg = err.stack;
      else if (typeof err === 'object')
         errMsg = `Error: ${JSON.stringify(err, null, 3)}`;
      else
         errMsg = err;

      const fd = new Date();
      const y = fd.getFullYear();
      const m = (fd.getMonth() + 1).toString().padStart(2, '0');
      const d = fd.getDate().toString().padStart(2, '0');
      const H = fd.getHours().toString().padStart(2, '0');
      const i = fd.getMinutes().toString().padStart(2, '0');
      const s = fd.getSeconds().toString().padStart(2, '0');
      const ms = fd.getMilliseconds().toString().padStart(3, '0');
      const string = `${d}/${m}/${y} ${H}:${i}:${s}.${ms} - ${errMsg}\r\n`;
      fs.appendFileSync(`${appPath}/logs/${y}${m}${d}-err.log`, string, 'utf-8');
   }

};

module.exports = writeLogs;
