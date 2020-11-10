

class Game {
	constructor(server){
		
		this.frame = 0;
		this.timeTillStateUpdate = 0;
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
		this.frame++;

		//this.ballPos.x = Math.sin(this.time) * 2;
		if(this.server.clients.length > 0){

			const c = this.server.clients[0];
			this.ballPos.x += c.input.h * 1 * this.dt; //ball moves at 1m/s

		}

		if(this.timeTillStateUpdate > 0){
			this.timeTillStateUpdate -= this.dt;

		} else {
			this.timeTillStateUpdate = .1;
			this.sendBallPos();
		}

		//TODO: tell server to send packets to all clients
		

		setTimeout(()=>this.update(),16);
	}

	sendBallPos(){
		const packet = Buffer.alloc(20);
		packet.write("BALL",0);
		packet.writeUInt32BE(this.frame,4);
		packet.writeFloatBE(this.ballPos.x,8);
		packet.writeFloatBE(this.ballPos.y,12);
		packet.writeFloatBE(this.ballPos.z,16);

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

	updateClientInput(rinfo,horizontalMovement){
		for(let i = 0; i < this.clients.length; i++){
			const c = this.clients[i];
			if(c.address == rinfo.address && c.port == rinfo.port){
				c.input.h = horizontalMovement;

			}


		}


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

					rinfo.input = {};
					rinfo.input.h = 0;

					console.log("Clinet Joined " + this.clients.length)
				}
			break;
			case "INPT":
				if(msg.length < 5) return;
				const h = msg.readInt8(4);

				this.updateClientInput(rinfo,h);

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
