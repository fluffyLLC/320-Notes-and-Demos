

class Game {
	constructor(server){
		
		this.time = 0;
		this.dt = 16/1000;


		this.ballPos = {
			x: 0,
			y: 0,
			z: 0

		}

		this.server = server;


		this.update();
	}

	update(){
		//console.log(this.time);
		this.time += this.dt;

		this.ballPos.x = Math.sin(this.time) * 2;

		//TODO: tell server to send packets to all clients
		this.sendBallPos();

		setTimeout(()=>this.update(),16);
	}

	sendBallPos(){
		const packet = Buffer.alloc(16);
		packet.write("BALL",0);
		packet.writeFloatBE(this.ballPos.x,4);
		packet.writeFloatBE(this.ballPos.y,8);
		packet.writeFloatBE(this.ballPos.z,12);

		this.server.broadcastToConnected(packet);
	}


}



class Server{

	constructor(){

		this.clients = [];

		//create socket
		this.sock = require('dgram').createSocket("udp4");

		//setup event listeners
		this.sock.on("error",(e)=>this.onError(e));
		this.sock.on("listening",()=>this.onStartListen());
		this.sock.on("message",(msg,rinfo)=>this.onPacket(msg,rinfo));

		this.game = new Game(this);


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
	doesClientExist(rinfo){
		let value = false;

		this.clients.forEach(c=>{
			if(c.address == rinfo.address && c.port == rinfo.port) value = true;

		});

		return value;

	}

	onPacket(msg,rinfo){
		//we would normally check if the client alredy existed and thattehy actually wanted to play this game
		if(msg.length < 4) return;

		const packetID = msg.slice(0,4).toString();

		switch(packetID){
			case "JOIN":
				if(!this.doesClientExist(rinfo)){
					this.clients.push(rinfo);
					console.log("Clinet Joined " + this.clients.length)
				}
			break;

		}

		



		console.log("--- packet recived ---")
		console.log("from " + rinfo.address + " : " + rinfo.port);
		console.log(msg);
	}

	broadcastToConnected(packet){//<<<<<<<<<confusing name, more advanced programmers whould not use this
		this.clients.forEach(c=>{
			this.sock.send(packet,0,packet.length,c.port,c.address,()=>{


			});


		});

	}

}



//const game = new Game();

new Server();
