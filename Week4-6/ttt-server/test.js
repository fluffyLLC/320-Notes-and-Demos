const net =  require("net");

const socket = net.connect({port:320,ip:"127.0.0.1"}, ()=>{
	console.log("connected to server");

	//const username = "Nick";

	const buff  = Buffer.alloc(8);
	buff.write("JOIN");
	buff.writeUInt8(3,4);
	buff.write("Dom",5);

	//socket.write("hello world");
	socket.write(buff);
});

socket.on("error", e=>{
console.log("error: " + e);

});