

class Server{
	constructor(){

		//create socket
		this.sock = require('dgram').createSocket("udp4");

		//setup event listeners
		this.sock.on("error",(e)=>this.onError(e));
		this.sock.on("listening",()=>this.onStartListen());
		this.sock.on("message",(msg,rinfo)=>this.onPacket(msg,rinfo));

		this.port = 320;
		this.sock.bind(this.port);
		// start listening

	}

	onError(e){

		console.log("ERROR: " + e);

	}

	onStartListen(){
		console.log("server is listening on port " + this.port);


	}

	onPacket(msg,rinfo){
		console.log("--- packet recived ---")
		console.log("from " + rinfo.address + " : " + rinfo.port);
		console.log(msg);

	}

}


new Server();
