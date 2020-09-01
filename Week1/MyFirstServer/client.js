const net = require('net');

//attempts to connect to server:
//"127.0.0.1" auto connects to this computer
var socket = net.connect({port:12345,host:"127.0.0.1"}, ()=>{console.log("You connected to the server!");});


socket.on("error", errMsg=>{console.log("there was an error: " + errMsg);});