const NetworkObj = require("./class-networkobject.js").NetworkObject;
const Game = require("./class-game.js").Game;
const Pawn = require("./class-pawn.js").Pawn;


exports.Client = class Client {

	static TIMEOUT = 8;

	constructor(rinfo){
		this.rinfo = rinfo;
		this.input = {
			axisH:0,
			axisV:0,

		};

		this.pawn = null;

		this.timeOfLastPacket = Game.Singleton.time;//mesured in seconds

	}

	spawnPawn(game){
		if(this.pawn) return; //if pawn exists do nothing
		//console.log("making client");

		this.pawn = new Pawn();
		game.spawnObject(this.pawn);

	}

	update(game){
		if(game.time > this.timeOfLastPacket + Client.TIMEOUT){
			
			// send a "KICK" packet to client // not yet in protocol

			//remove spawn (and send repl delete packts)
			game.server.disconnectClient(this);
			//remove client (self)


		}
	}

	onPacket(packet, game){//calle message in server
		//console.log("packetrecieved");

		this.timeSinceLastPacket = game.time;

		if(packet.length < 4) return; // ignore packet
		const packetID = packet.slice(0,4).toString();

		switch(packetID){
			
			case "INPT":

				if(packet.length < 5) return;
				this.input.axisH = packet.readInt8(4);

				if(this.pawn) this.pawn.input = this.input;

				break;

			default:
			console.log("ERROR: packetID not recognised");
		}
	}



}