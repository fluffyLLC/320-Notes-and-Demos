const sock = require("dgram").createSocket("udp4");


const packet = Buffer.from("hello world!");



sock.send(packet,0,packet.length,320,"192.168.0.255", ()=>{

	sock.close();
});