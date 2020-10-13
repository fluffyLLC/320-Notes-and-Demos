const PacketBuilder = require("./packetBuilder.js").PacketBuilder


exports.Client = class Client{

		constructor(socket, server){
			this.socket = socket;
			this.server = server;
			this.username = "";

			this.buffer = Buffer.alloc(0);

			this.socket.on("error",e=>this.onError(e));
			this.socket.on("close",()=>this.onClose());
			this.socket.on("data",d=>this.onData(d));

		}

		onError(errmsg){
			console.log("ERROR:" + errmsg);

		}

		onClose(){
			this.server.onClientDisonnect(this);

		}

		onData(data){
			this.buffer = Buffer.concat([this.buffer,data]);
			//console.log(this.buffer);
			console.log("data recived");

			if(this.buffer.length < 4) return; // not enough data

			const packetIdentifier = this.buffer.slice(0,4).toString();

			console.log("packet identifyer: " + packetIdentifier);

			switch(packetIdentifier){
				case "JOIN": 
					if(this.buffer.length < 5) return; // not enough data
					const lengthOfUsername = this.buffer.readUInt8(4); //one byte 4 bytes into the buffer (the 5th one)
					if(this.buffer.length < 5 + lengthOfUsername) return;
					const desiredUsername = this.buffer.slice(5,5+lengthOfUsername).toString();

					let responseType = this.server.getUsernameResponse(desiredUsername,this);

					const packet = PacketBuilder.join(responseType);

					this.sendPacket(packet);

					//consume data out of buffer
					//consume(5 + lengthOfUsername);
					this.buffer = this.buffer.slice(5 + lengthOfUsername);

					console.log("desired username: " + desiredUsername);
					//check username

				break;
				case "CHAT": break;
				case "PLAY": 
					if(this.buffer.length < 6) return;

					const x = this.buffer.readUInt8(4);
					const y = this.buffer.readUInt8(5);

					console.log("user wants to play at: "+x+" "+y);
					
					this.server.game.playMove(this,x,y);

					this.buffer = this.buffer.slice(6);

					

				break;
				default:
				console.log("ERROR: packet identifyer not recognised (" +packetIdentifier+")");
				this.buffer = Buffer.alloc(0);
				break;

			}

		}

		consume(consumeLength){
			
		}

		sendPacket(packet){
			console.log("sending packet: " + packet);
			this.socket.write(packet);
		}


}