const sock = require("dgram").createSocket("udp4");

sock.on("listening", ()=>{
console.log("listening");



});


sock.on("message",()=>{
console.log("msg recived");

});


sock.bind(320);