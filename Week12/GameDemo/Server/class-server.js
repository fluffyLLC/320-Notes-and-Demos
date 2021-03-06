const Game = require("./class-game.js").Game;
const Client = require("./class-client.js").Client;
const Pawn = require("./class-pawn.js").Pawn;

exports.Server = class Server{

	constructor(){


		this.clients = [];
		this.timeTilNextBroadcast = 5;
		this.port = 320; // server listening on listening
		this.serverName = "Test Server";
		this.clientListenPort = 321;

		//create socket
		this.sock = require('dgram').createSocket("udp4");

		//setup event listeners
		this.sock.on("error",(e)=>this.onError(e));
		this.sock.on("listening",()=>this.onStartListen());
		this.sock.on("message",(msg,rinfo)=>this.onPacket(msg,rinfo));


		//this.game.objs.


		this.game = new Game(this);//fix code so that it doesn't immediatly tick?

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
		//we would normally check if the client alredy existed and thattehy actually wanted to play this game
		//console.log("message recived");

		if(msg.length < 4) return;

		const packetID = msg.slice(0,4).toString();

		const c = this.lookupClient(rinfo);

		if(c) {
			//console.log("client exists")
			c.onPacket(msg,this.game);

		} else {
			if(packetID == "JOIN"){
				this.makeClient(rinfo);
			}

		}

		//this.showClientList();

	}

	getKeyFromRinfo(rinfo){
		return rinfo.address + ":" + rinfo.port; 
	}

	lookupClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		return this.clients[key];
	}

	makeClient(rinfo){
		const key = this.getKeyFromRinfo(rinfo);
		const client = new Client(rinfo);

		//depending on scene (and other conditions) spawn pawn
		client.spawnPawn(this.game);

		this.clients[key] = client;



		this.showClientList();


		// TODO: sent CREATE replication packets for every object...
		const packet = this.game.makeREPL(false);
		this.sendPacketToClient(packet,client);// TODO: needs ACK!! 


		return client;

	}

	disconnectClient(client){
		//console.log("disconnect called");

		if(client.pawn) this.game.removeObject(client.pawn);
		const key = this.getKeyFromRinfo(client.rinfo);
		delete this.clients[key];

		this.showClientList();
	}

	showClientList(){
		console.log("======= "+Object.keys(this.clients).length + " =======") //this.clients.length will not work becuse our objects are refrenced via keys

		for (var key in this.clients) {
			console.log(key)
		}

	}

	getPlayer(num = 0){

		num = parseInt(num);
		let i = 0;
		for(var key in this.clients){
			if(num == i) return this.clients[key];
			return this.clients[num];
			i++;
		}

	}


	sendPacketToAll(packet){//<<<<<<<<<confusing name, more advanced programmers whould not use this
		/*this.clients.forEach(c=>{
			//this.sock.send(packet,0,packet.length,c.port,c.address,()=>{});

			sendPacketToClient(packet,c);
			
			});*/

		for(var key in this.clients){
			this.sendPacketToClient(packet, this.clients[key]);
		}




	}

	broadcastPacket(packet){

		

		this.sock.send(packet,0,packet.length,this.clientListenPort,undefined);
	}

	sendPacketToClient(packet,client){
		

		console.log("sending Packet " + packet.toString('utf8',0,4));

		this.sock.send(packet, 0, packet.length, this.clientListenPort, client.rinfo.address,()=>{});

	}

	broadcastServerHost(){
		const nameLength = this.serverName.length;
		const packet = Buffer.alloc( 7 + nameLength);

		packet.write("HOST",0);
		packet.writeUInt16BE(this.port,4);
		packet.writeUInt8(nameLength,6);
		packet.write(this.serverName,7);

		this.broadcastPacket(packet);
		//console.log("broadcast packet...");

		//let addr = this.sock.address();
		//console.log()

	}

	update(game){
		for (let key in this.clients){
			this.clients[key].update(game);

		}

		this.timeTilNextBroadcast -= game.dt;

		if(this.timeTilNextBroadcast <= 0){
			this.timeTilNextBroadcast = 1.5;
			this.broadcastServerHost();

		}

	}

}

/*
old server:
=========================================


const Game = require("./class-game.js").Game;


exports.Server = class Server{

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

*/
