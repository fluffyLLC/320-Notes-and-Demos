const NetworkObj = require("./class-networkobject.js").NetworkObject;

exports.Client = class Client {
	constructor(rinfo){
		this.rinfo = rinfo;
		this.input = {
			axisH:0,
			axisV:0,

		};



	}
	onPacket(packet){//calle message in server
		//console.log("packetrecieved");
		if(packet.length < 4) return; // ignore packet
		const packetID = packet.slice(0,4).toString();

		switch(packetID){
			
			case "INPT":

				if(packet.length < 5) return;
				this.input.axisH = packet.readInt8(4);

				break;

			default:
			console.log("ERROR: packetID not recognised");
		}
	}



}