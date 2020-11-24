const Pawn = require("./class-pawn.js").Pawn;


exports.Game = class Game {
	constructor(server){
		
		this.frame = 0;
		this.timeTillStateUpdate = 0;
		this.time = 0;
		this.dt = 16/1000;

		this.objs = []; // store NetworkObjects in here

		this.server = server;

		this.spawnObject(new Pawn());

		this.update();
	}

	update(){
		//console.log(this.time);
		this.time += this.dt;
		this.frame++;

		const player = this.server.getPlayer(0);

		for(var i in this.objs){
			this.objs[i].update(this);
		}

		if(player){
			//this.ballPos.x += player.input.axisH * 1 * this.dt;
		}

		//this.ballPos.x = Math.sin(this.time) * 2;
		/*if(this.server.clients.length > 0){

			const c = this.server.clients[0];
			this.ballPos.x += c.input.h * 1 * this.dt; //ball moves at 1m/s

		}*/

		if(this.timeTillStateUpdate > 0){
			this.timeTillStateUpdate -= this.dt;

		} else {
			this.timeTillStateUpdate = .1;
			this.sendWorldState();
		}

		//TODO: tell server to send packets to all clients
		

		setTimeout(()=>this.update(),16);
	}

	sendWorldState(){
		console.log("sending world state");
		const packet = this.makeREPL(true);

		this.server.sendPacketToAll(packet);
	

	}

	makeREPL(isUpdate){

		isUpdate = !!isUpdate;
		var packet = Buffer.alloc(5);

		packet.write("REPL",0);
		
		packet.writeUInt8(isUpdate?2:1,4);
		
		const packedobjs = []; //should probably be grouped by Class, will also need a way to refrence objects by networkID

		this.objs.forEach(o=>{
			const classID = Buffer.from(o.classID);
			const data = o.serialize();


			packet = Buffer.concat([packet, classID, data]);

			//packedobjs.push(b);

		});

		//console.log(packet)

		return packet;

	}

	spawnObject(obj){
		this.objs.push(obj);

		var packet = Buffer.alloc(5);

		packet.write("REPL",0);
		packet.writeUInt8(2,4);
		
		const classID = Buffer.from(obj.classID);
		const data = obj.serialize();

		packet = Buffer.concat([packet, classID, data]);

		this.server.sendPacketToAll(packet);

			//packedobjs.push(b);

		
		//TODO: send Create replication packet

	}


}
/*
sendBallPos(){
		const packet = Buffer.alloc(20);
		packet.write("BALL",0);
		packet.writeUInt32BE(this.frame,4);
		packet.writeFloatBE(this.ballPos.x,8);
		packet.writeFloatBE(this.ballPos.y,12);
		packet.writeFloatBE(this.ballPos.z,16);

		this.server.sendPacketToAll(packet);
	}*/