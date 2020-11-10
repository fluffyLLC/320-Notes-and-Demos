

// require module
const dgram = require("dgram");


// create our socket
const sock = dgram.createSocket('udp4', )


// create a packet
const packet = Buffer.from("get wiggly");


// send packet
sock.send(packet,0,packet.length, 320, "127.0.0.1",()=>{

	console.log("packet sent :)");
	sock.close();
	
});