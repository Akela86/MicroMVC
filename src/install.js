let Service;

if (process.platform === 'win32')
   Service = require('node-windows').Service;

else if (process.platform === 'linux')
   Service = require('node-linux').Service;

else {
   console.log(`Sistema operativo ${process.platform} non supportato`);
   exit();
}

// Create a new service object
const svc = new Service({
   name: 'app',
   description: 'Titolo App.',
   script: require('path').join(__dirname, 'app.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install', () => {
   console.log('Installazione completa');
   svc.start();
});

svc.install();
