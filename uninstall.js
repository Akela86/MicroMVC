if(process.platform == 'win32'){
  var Service = require('node-windows').Service;
}
else if(process.platform == 'linux'){
  var Service = require('node-linux').Service;
}
else{
  console.log('Sistema operativo '+process.platform+' non supportato');
  exit();
}

// Create a new service object
var svc = new Service({
  name:'app',
  script: require('path').join(__dirname,'app.js')
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall', function(){
  console.log('Disinstallazione completa.');
  //console.log('The service exists: ', svc.exists);
});

// Uninstall the service.
svc.uninstall();