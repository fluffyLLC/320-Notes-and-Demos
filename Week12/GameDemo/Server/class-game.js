const Pawn = require("./class-pawn.js").Pawn;


exports.Game = class Game {

	static Singleton;

	constructor(server){

		Game.Singleton = this;
		
		this.frame = 0;
		this.timeTillStateUpdate = 0;
		this.time = 0;
		this.dt = 16/1000;

		this.objs = []; // store NetworkObjects in here

		this.server = server;
		this.update();
	}

	update(){
		//console.log(this.time);
		this.time += this.dt;
		this.frame++;

		this.server.update(this);//check clients for disconnects ect

		for(var i in this.objs){
			this.objs[i].update(this);
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
		//console.log("sending world state");
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

	spawnObject(obj){ // Instantiate()
		this.objs.push(obj);

		var packet = Buffer.alloc(5);

		packet.write("REPL",0);
		packet.writeUInt8(1,4);
		
		const classID = Buffer.from(obj.classID);
		const data = obj.serialize();

		packet = Buffer.concat([packet, classID, data]);

		this.server.sendPacketToAll(packet);

			//packedobjs.push(b);

		
		//TODO: send Create replication packet

	}

	removeObject(obj){// Destroy()
		const index = this.objs.indexOf(obj);

		if(index < 0) return;

		const netID = this.objs[index].networkID;//

		this.objs.splice(index,1);//remove object from array

		const packet = Buffer.alloc(6);
		packet.write("REPL",0)
		packet.writeUInt8(3,4);
		packet.writeUInt8(netID,5);

		this.server.sendPacketToAll(packet);


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