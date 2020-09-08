const net = require("net");//import node js tcp socket modual 

const socketToServer = net.connect({port:320, ip:"127.0.0.1"},()=>{
	console.log("we are now connected to the server")
	socketToServer.write("Hello! I am a client...");
});

socketToServer.on("error", errMsg=>{
	console.log("ERROR: " + errMsg);

});


//how we recive info from our pcp socket:
socketToServer.on("data", txt=>{

	console.log("server says: " + txt);

});