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
   script: require('path').join(__dirname, 'app.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', () => {
   console.log('Disinstallazione completa.');
   // console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();
