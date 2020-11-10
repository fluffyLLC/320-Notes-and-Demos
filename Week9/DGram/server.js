//require dgram module:
const dgram = require("dgram");

//make udp socket:
const sock = dgram.createSocket('udp4');

//setup eventlisteners:
sock.on("error",(e)=>{
	console.log("ERROR: " + e);

});
sock.on("listening",()=>{
console.log("server listening ...")

});
sock.on("message",(msg, rinfo)=>{
	console.log("--- packet recived ---")
	console.log("from " + rinfo.address + " : " + rinfo.port);
	console.log(msg);
	//console.log(rinfo);
});

//start listening:
sock.bind(320);
